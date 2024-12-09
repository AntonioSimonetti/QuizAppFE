export interface Credentials {
    email: string, 
    password: string;
}

export interface AuthPayload {
    accessToken: string;
    email?: string; 
    userId: string;
    usernameAndEmail: string;
    valid: boolean;
}

export interface AuthState {
    token: string;
    isLoggedIn: boolean;
    email: string;
    userId: string;
    usernameAndEmail: string;
    valid: boolean;
    isValidating: boolean;
}

export const initialState: AuthState = {
    token: "",
    isLoggedIn: false,
    email: "",
    userId: "",
    usernameAndEmail: "",
    valid: false,
    isValidating: false,
}