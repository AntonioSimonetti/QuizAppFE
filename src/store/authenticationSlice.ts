import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, initialState } from "../types/authTypes";

// Forse lo sposto da qui dopo
interface AuthPayload {
    accessToken: string;
    email?: string; 
    userId: string;
    usernameAndEmail: string;
}

// Anche questo forse lo sposto
interface TokenValidationPayload {
    isValid: boolean; 
}

export const authenticationSlice = createSlice({
    name: "authentication",
    initialState, // definito nell'interfaccia ed importato direttamente qui invece che definirlo qua
    reducers: {
        userAuthenticated: (state: AuthState, action: PayloadAction<AuthPayload>) => {
            localStorage.setItem("token", action.payload.accessToken);
            state.token = action.payload.accessToken;
            state.isLoggedIn = true;
            state.email = action.payload.email || state.email;
            state.userId = action.payload.userId;
            state.usernameAndEmail = action.payload.usernameAndEmail || state.usernameAndEmail;
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
        tokenValidationStatus: (state: AuthState, action: PayloadAction<TokenValidationPayload>) => {
            // Si potrebbe mettere una funzione helper
            state.isLoggedIn = action.payload.isValid; 
            if (!action.payload.isValid) {
                localStorage.clear(); 
                state.token = "";
                state.email = "";
                state.userId = "";
                state.usernameAndEmail = "";
            }
        }
    }
});

export const { userAuthenticated, logout, emailConfirmed, tokenValidationStatus  } = authenticationSlice.actions;

export default authenticationSlice.reducer; //export solo del riduttore 