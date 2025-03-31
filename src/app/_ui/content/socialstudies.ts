export const fetchSocialStudiesQuestions = async () => {
  try {
    const response = await fetch("https://quiz-backend-4x8z.onrender.com/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: "social studies",
        difficulty: "medium", // You can make this dynamic
      }),
    });

    const data = await response.json();
    return data.questions; // Ensure your backend returns questions in this format
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};
