import axios from "axios";

export const fetchQuizzesByUserId = async (userId: string, token: string) => {
  try {
    const response = await axios.get(
      `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/user/${userId}/quizzes`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    console.log(response.data);
    return response.data; 
  } catch (error) {
    throw new Error("API Error: " + error);
  }
};
