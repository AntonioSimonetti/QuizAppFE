import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './navigationSlice';
import authenticationReducer from './authenticationSlice';

export const store = configureStore(
    {
        reducer: {
            authenticationSlice: authenticationReducer,
            navigationSlice: navigationReducer,
        }
    }
)

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;