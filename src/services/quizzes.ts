import axios from "axios";
import { AppDispatch } from '../store/store';
import { setQuizzes, setStatus, setError } from '../store/quizzesSlice';

export interface CreateQuizPayload {
  id: number;
  title: string;
  isPublic: boolean;
  timelimit: number;
  userId: string;
}

export const fetchQuizzesByUserId = async (userId: string, token: string, dispatch: AppDispatch) => {
  if (!userId || !token) {
    console.error('Missing userId or token');
    return;
  }

  try {
    const response = await axios.get(
      `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/user/${userId}/quizzes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('API Response:', response.data);
    const quizzes = response.data.$values;
    dispatch(setQuizzes(quizzes));
    return quizzes;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


export const deleteQuizById = async (userId: string, quizId: number, token: string, dispatch: AppDispatch) => {
  try {
    await axios.delete(
      `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/DeleteQuizById/${quizId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (userId) {
      await fetchQuizzesByUserId(userId, token, dispatch);
    }
  } catch (error) {
    console.error('Delete Quiz Error:', error);
    throw error;
  }
};

export const createQuiz = async (userId: string, payload: CreateQuizPayload, token: string, dispatch: AppDispatch) => {
  console.log('Creating quiz with payload:', payload);

  try {
    const response = await axios.post(
      'https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/CreateQuiz',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    
    // Aggiorna la view
    if (userId) {
      await fetchQuizzesByUserId(userId, token, dispatch);
    }
    
    return response.data;
  } catch (error) {
    console.error('Create Quiz Error:', error);
    throw error;
  }
};