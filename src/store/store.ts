import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './navigationSlice';
import authenticationReducer from './authenticationSlice';
import { initialStateQuiz } from '../interfaces/quiz';
import { initialState } from '../interfaces/auth';
import { initialNavigationState } from './navigationSlice';
import quizzesSlice from './quizzesSlice';

// Define the reset action type right in the store file
export const RESET_STORE = 'RESET_STORE';

// Create the root reducer
const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    return {
        authenticationSlice: initialState,
        navigationSlice: initialNavigationState,
        quizzesSlice: initialStateQuiz
    };
  }
  return {
    authenticationSlice: authenticationReducer(state?.authenticationSlice, action),
    navigationSlice: navigationReducer(state?.navigationSlice, action),
    quizzesSlice: quizzesSlice(state?.quizzesSlice, action)
  };
};

export const store = configureStore(
    {
        reducer: rootReducer
    }
)

export const resetStore = () => ({ type: RESET_STORE });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;