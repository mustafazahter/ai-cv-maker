export interface CVAnalysisScore {
    overall: number;
    format: number;
    content: number;
    atsCompatibility: number;
    keywords: number;
    readability: number;
}

export interface CVStrength {
    id: string;
    title: string;
    description: string;
    category: 'format' | 'content' | 'keywords' | 'structure';
}

export interface CVImprovement {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'format' | 'content' | 'keywords' | 'structure';
}

export interface CVAnalysisResult {
    scores: CVAnalysisScore;
    strengths: CVStrength[];
    improvements: CVImprovement[];
    summary: string;
    keywordsFound: string[];
    keywordsMissing: string[];
    atsWarnings: string[];
}

export interface AnalysisState {
    status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
    progress: number;
    result: CVAnalysisResult | null;
    error: string | null;
}
