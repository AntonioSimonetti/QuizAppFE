import axios from "axios";
import { AppDispatch } from '../store/store';
import { setQuizzes } from '../store/quizzesSlice';
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
      console.log('Current Quiz Data:', currentQuiz);

      // 1. Create the quiz
      console.log('Creating quiz with data:', {
        title: currentQuiz.title,
        userId: userId
      });
      
      const quizResponse = await axios.post(
        'https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/api/Quiz/CreateQuiz',
        {
          id: 0,
          title: currentQuiz.title,
          isPublic: true,
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

      console.log('Quiz created successfully:', quizResponse.data);
      const quizId = quizResponse.data.id;

      // 2. Create questions and their options
      for (const [questionId, question] of Object.entries(currentQuiz.questions)) {
        console.log('Creating question:', question);
        
        const correctAnswerIndex = Object.entries(question.options)
          .findIndex(([_, option]) => option.isCorrect);
        console.log('Correct answer index:', correctAnswerIndex);

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

        console.log('Question created successfully:', questionResponse.data);
        const questionId = questionResponse.data.id;

        // Link question to quiz
        console.log('Linking question to quiz:', {
          questionData: questionResponse.data,
          quizId: quizId
        });

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
          console.log('Creating option:', option);
          
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

          console.log('Option created successfully:', optionResponse.data);

          console.log('Linking option to question:', {
            optionData: optionResponse.data,
            questionId: questionId
          });

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


