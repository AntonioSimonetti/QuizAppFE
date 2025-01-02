import { createSlice } from "@reduxjs/toolkit";
import { Question, initialStateQuiz, Option  } from "../interfaces/quiz";


export const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: initialStateQuiz, 
  reducers: {
    setQuizzes(state, action) {
      state.data.quizzes = action.payload;
    },
    deleteQuiz(state, action) {
      state.data.quizzes = state.data.quizzes.filter(quiz => quiz.id !== action.payload);
    },
    setQuestions(state, action) {
      action.payload.forEach((question: Question) => {
        state.data.questions[question.id] = question;
      });
    },
    setOptions(state, action) {
      action.payload.forEach((option: Option) => {
        state.data.options[option.id] = option;
      });
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetState(state) {
      Object.assign(state, initialStateQuiz); 
    },
  },
});

export const {
  setQuizzes,
  deleteQuiz, 
  setQuestions,
  setOptions,
  setStatus,
  setError,
  resetState,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
