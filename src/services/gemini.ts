export async function askMathTutor(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}

export async function generatePracticeProblems(topic: string, difficulty: string) {
  try {
    const response = await fetch('/api/generate-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Problem Generation Error:", error);
    return [];
  }
}
