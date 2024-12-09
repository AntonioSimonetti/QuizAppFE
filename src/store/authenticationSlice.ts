import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthPayload, AuthState, initialState } from "../interfaces/auth";

export const authenticationSlice = createSlice({
    name: "authentication",
    initialState, 
    reducers: {
        userAuthenticated: (state: AuthState, action: PayloadAction<AuthPayload>) => {
            localStorage.setItem("token", action.payload.accessToken);
            state.token = action.payload.accessToken;
            state.isLoggedIn = true;
            state.email = action.payload.email || state.email;
            state.userId = action.payload.userId;
            state.usernameAndEmail = action.payload.usernameAndEmail || state.usernameAndEmail;
            state.valid = action.payload.valid;
        },
        setValidating: (state: AuthState, action: PayloadAction<boolean>) => {
            state.isValidating = action.payload; 
          },
        logout: (state: AuthState) => {
            localStorage.clear();
            state.token = "";
            state.isLoggedIn = false;
            state.email = "";
            state.userId = "";
            state.usernameAndEmail = "";
            state.valid = false;
        },
        emailConfirmed: (state: AuthState) => {
            state.isLoggedIn = false;
        },
   
    }
});

export const { userAuthenticated, logout, setValidating, emailConfirmed  } = authenticationSlice.actions;

export default authenticationSlice.reducer; //export solo del riduttore 