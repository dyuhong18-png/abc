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
