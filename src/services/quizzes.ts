import axios from "axios";
import store, { AppDispatch } from '../store/store';
import { deleteQuiz, setQuizzes } from '../store/quizzesSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LocalQuizState } from '../interfaces/quiz'; 

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
    const quizzes = response.data.$values;
    dispatch(setQuizzes(quizzes));
    return quizzes;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchPublicQuizzes = async (token: string) => {
  try {
    const response = await axios.get(
      "https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/public",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.$values;
  } catch (error) {
    console.error("Failed to fetch public quizzes:", error);
    throw error;
  }
};


export const deleteQuizById = async (userId: string, quizId: number, token: string, dispatch: AppDispatch) => {
  // Salviamo lo stato corrente dei quiz prima della cancellazione
  const currentQuizzes = store.getState().quizzesSlice.data.quizzes;

  try {
    // Aggiorniamo subito l'UI (optimistic update)
    dispatch(deleteQuiz(quizId));

    // Proviamo la chiamata API
    await axios.delete(
      `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/DeleteQuizById/${quizId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
  } catch (error) {
    // Se la chiamata fallisce, ripristiniamo lo stato precedente
    dispatch(setQuizzes(currentQuizzes));
    console.error('Delete Quiz Error:', error);
    throw error;
  }
};



/*
 * Creates a complete quiz with questions and options using multiple API calls.
 * Uses createAsyncThunk since it performs multiple async operations that need
 * to be tracked in the Redux store. The thunk pattern is required here due to
 * the complex async flow, and could be beneficial for the other API calls
 * (fetchQuizzesByUserId, deleteQuizById) to maintain consistency
 * in state management.
 */
export const createCompleteQuiz = createAsyncThunk(
  'quizzes/createComplete',
  async ({ quizData, token, userId }: { 
    quizData: LocalQuizState, 
    token: string, 
    userId: string 
  }) => {
    try {
      const currentQuiz = quizData.quizzes[quizData.currentQuizId];

      // 1. Create the quiz

      const quizResponse = await axios.post(
        'https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/CreateQuiz',
        {
          id: 0,
          title: currentQuiz.title,
          isPublic: currentQuiz.isPublic,
          timelimit: 0,
          userId: userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const quizId = quizResponse.data.id;

      // 2. Create questions and their options
      for (const [questionId, question] of Object.entries(currentQuiz.questions)) {
        
        const correctAnswerIndex = Object.entries(question.options)
          .findIndex(([_, option]) => option.isCorrect);

        const questionResponse = await axios.post(
          'https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/CreateQuestion',
          {
            id: 0,
            text: question.text,
            correctAnswerIndex: correctAnswerIndex,
            points: 1,
            negativePoints: 0,
            userId: userId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const questionId = questionResponse.data.id;

   

        await axios.post(
          `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/AddQuestionToQuiz?quizId=${quizId}`,
          questionResponse.data.id,  // Just sending the integer ID
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Create and link options
        for (const [optionId, option] of Object.entries(question.options)) {
          
          const optionResponse = await axios.post(
            'https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/CreateOption',
            {
              id: 0,
              text: option.text,
              questionId: questionId
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );



          await axios.post(
            `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/AddOptionToQuestion?questionId=${questionId}`,
            optionResponse.data.id,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }
      }

      return quizId;
    } catch (error) {
      console.error('Quiz creation error:', error);
      throw error;
    }
  }
);

export const fetchQuizDetails = async (quizId: number, token: string) => {
  try {
    // First get the quiz with its questions
    const quizResponse = await axios.get(
      `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/GetQuizById/${quizId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const quiz = quizResponse.data;
    
    // For each question, fetch its options
    const questions = quiz.quizQuestions.$values;
    for (const questionData of questions) {
      const questionId = questionData.question.id;
      const optionsResponse = await axios.get(
        `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/GetOptionsByQuestionId/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Add the options to the question object
      questionData.question.options = optionsResponse.data;
    }
    
    return quiz;
  } catch (error) {
    console.error('Failed to fetch quiz details:', error);
    throw error;
  }
};

export const updateQuizBasicInfo = async (
  quizId: number, 
  updateData: {
      id: number,
      title: string,
      isPublic: boolean,
      timelimit: number,
      userId: string
  }, 
  token: string,
  dispatch: AppDispatch
) => {
  try {
      await axios.put(
          `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/UpdateQuiz/${quizId}`,
          updateData,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          }
      );

      // Refresh the quizzes list after update
      await fetchQuizzesByUserId(updateData.userId, token, dispatch);
  } catch (error) {
      console.error('Update Quiz Error:', error);
      throw error;
  }
};


export const removeQuestionFromQuiz = async (quizId: number, questionId: number, token: string) => {
  try {
      await axios.delete(
          `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/${quizId}/RemoveQuestion/${questionId}`,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              }
          }
      );
  } catch (error) {
      console.error('Remove Question Error:', error);
      throw error;
  }
};

export const updateQuestion = async (
  questionId: number, 
  questionData: {
      id: number,
      text: string,
      correctAnswerIndex: number,
      points: number,
      negativePoints: number,
      userId: string
  }, 
  token: string
) => {
  try {
      await axios.put(
          `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/UpdateQuestion/${questionId}`,
          questionData,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              }
          }
      );
  } catch (error) {
      console.error('Update Question Error:', error);
      throw error;
  }
};

export const updateOption = async (
  optionId: number,
  optionData: {
      id: number,
      text: string,
      questionId: number
  },
  token: string
) => {
  try {
      await axios.put(
          `https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/UpdateOption/${optionId}`,
          optionData,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              }
          }
      );
  } catch (error) {
      console.error('Update Option Error:', error);
      throw error;
  }
};
