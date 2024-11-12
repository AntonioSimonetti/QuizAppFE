import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './authenticationSlice';

export const store = configureStore(
    {
        reducer: {
            authenticationSlice: authenticationReducer,
        }
    }
)

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;