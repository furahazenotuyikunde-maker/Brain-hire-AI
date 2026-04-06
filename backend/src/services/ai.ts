const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API;

export interface AIAnalysis {
  score: number;
  reasoning: string;
  matchedKeywords: string[];
  strengths: string;
  gaps: string;
}

const extractResponseText = (data: any): string => {
  if (!data) return '';
  if (typeof data.output_text === 'string') return data.output_text;
  if (Array.isArray(data.output)) {
    return data.output
      .flatMap((entry: any) => {
        if (!entry?.content) return [];
        return entry.content.map((item: any) => item?.text || item?.value || '').filter(Boolean);
      })
      .join(' ');
  }
  if (typeof data === 'string') return data;
  return JSON.stringify(data);
};

const parseJsonFromText = (raw: string): any => {
  try {
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return null;
    const jsonString = raw.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

const calculateScore = (jd: string, cvText: string): AIAnalysis => {
  const jdClean = jd.toLowerCase();
  const cvClean = cvText.toLowerCase();

  const techMarkers = [
    'react', 'node', 'typescript', 'javascript', 'python', 'java', 'aws', 'docker', 'kubernetes',
    'machine learning', 'artificial intelligence', 'sql', 'mongodb', 'postgresql', 'rust', 'go',
    'redux', 'express', 'distributed', 'microservices', 'devops', 'ci/cd', 'architecture'
  ];

  const powerWords = ['leadership', 'management', 'agile', 'scrum', 'mentor', 'strategic', 'scale'];
  const jdWords = (jdClean.match(/\b(\w+)\b/g) || []) as string[];
  const uniqueJd = new Set(jdWords.filter((w) => w.length > 3));

  let scorePoints = 0;
  let totalPossible = 0;
  const matches: string[] = [];

  uniqueJd.forEach((word) => {
    const isTech = techMarkers.some((m) => word.includes(m) || m.includes(word));
    const isPower = powerWords.some((p) => word.includes(p) || p.includes(word));
    const weight = isTech ? 5 : isPower ? 3 : 1;
    totalPossible += weight;

    if (cvClean.includes(word)) {
      scorePoints += weight;
      matches.push(word);
    }
  });

  const finalScore = totalPossible > 0 ? Math.min(100, Math.round((scorePoints / totalPossible) * 100)) : 0;
  const techMatches = matches.filter((m) => techMarkers.some((t) => m.includes(t)));
  const powerMatches = matches.filter((m) => powerWords.some((p) => m.includes(p)));

  let reasoning = '';
  if (finalScore > 85) {
    reasoning = `Elite alignment discovered. Candidate demonstrates deep mastery of ${techMatches.slice(0, 3).join(' and ')} combined with ${powerMatches[0] || 'strong'} leadership potential. Ideal for direct deployment.`;
  } else if (finalScore > 65) {
    reasoning = `Strong technical profile. Key strengths identified in ${techMatches.slice(0, 2).join(' & ')}. Alignment with ${powerMatches.slice(0, 2).join(', ')} suggests good cultural and process fit.`;
  } else if (finalScore > 40) {
    reasoning = `Functional match with core requirements. Shows baseline capability in ${techMatches[0] || 'industry tools'}. May require additional onboarding for specific niche requirements.`;
  } else {
    reasoning = `Preliminary technical assessment shows gaps in core required competencies. Candidate has exposure to ${matches.slice(0, 2).join(', ')} but lacks critical stack depth for this role.`;
  }

  const strengths = techMatches.length > 1 ? `Significant stack depth in ${techMatches.join(', ')}.` : 'Broad professional experience.';
  const missing = Array.from(uniqueJd).filter((w) => !cvClean.includes(w) && techMarkers.some((t) => w.includes(t)));
  const gaps = missing.length > 0 ? `Missing specialized expertise in ${missing.slice(0, 2).join(', ')}.` : 'Minimal stack gaps detected.';

  return {
    score: finalScore,
    reasoning,
    matchedKeywords: matches.slice(0, 15),
    strengths,
    gaps,
  };
};

export const generateAIAnalysis = async (jobDescription: string, cvText: string): Promise<AIAnalysis> => {
  const localResult = calculateScore(jobDescription, cvText);

  if (!OPENAI_API_KEY) {
    return localResult;
  }

  try {
    const prompt = `You are an AI recruitment assistant. Compare the following job description and resume content, then return a valid JSON object with these keys: score (0-100), reasoning, matchedKeywords (array), strengths, gaps.\n\nJob Description:\n${jobDescription}\n\nResume Text:\n${cvText}`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: prompt,
        max_output_tokens: 350,
      }),
    });

    if (!response.ok) {
      return localResult;
    }

    const data = await response.json();
    const rawText = extractResponseText(data);
    const parsed = parseJsonFromText(rawText);

    if (!parsed || typeof parsed !== 'object') {
      return localResult;
    }

    return {
      score: typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : localResult.score,
      reasoning: String(parsed.reasoning || localResult.reasoning),
      matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : localResult.matchedKeywords,
      strengths: String(parsed.strengths || localResult.strengths),
      gaps: String(parsed.gaps || localResult.gaps),
    };
  } catch (error) {
    return localResult;
  }
};
