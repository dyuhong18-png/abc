export interface Problem {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface ProblemResponse {
  problems: Problem[];
  isFallback: boolean;
  isCustom?: boolean;
  fallbackReason?: 'MISSING_KEY' | 'QUOTA_LIMIT' | 'GENERIC_ERROR' | 'CONNECTION_ERROR';
  errorMessage?: string;
}

export async function generatePracticeProblems(topic: string, difficulty: string, useCustomOnly?: boolean): Promise<ProblemResponse> {
  try {
    const response = await fetch('/api/generate-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, useCustomOnly })
    });
    const data = await response.json();
    
    if (data && typeof data === 'object' && 'problems' in data) {
      return data as ProblemResponse;
    }
    
    if (Array.isArray(data)) {
      return {
        problems: data as Problem[],
        isFallback: false
      };
    }
    
    throw new Error("Invalid response format received from server");
  } catch (error) {
    console.error("Problem Generation Error:", error);
    return {
      problems: [],
      isFallback: true,
      fallbackReason: "CONNECTION_ERROR",
      errorMessage: String(error)
    };
  }
}

export async function getCustomProblems(): Promise<Record<string, Problem[]>> {
  try {
    const response = await fetch('/api/custom-problems');
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error("Error loading custom problems from backend:", error);
    return {};
  }
}

export async function importProblems(topic: string, problems: Omit<Problem, "id">[]): Promise<{ success: boolean; count: number; problems: Problem[] }> {
  try {
    const response = await fetch('/api/import-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, problems })
    });
    return await response.json();
  } catch (error) {
    console.error("Error importing problems to backend:", error);
    return { success: false, count: 0, problems: [] };
  }
}

export async function deleteCustomProblem(topic: string, id: number): Promise<{ success: boolean; problems: Problem[] }> {
  try {
    const response = await fetch('/api/delete-problem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, id })
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting custom problem from backend:", error);
    return { success: false, problems: [] };
  }
}
