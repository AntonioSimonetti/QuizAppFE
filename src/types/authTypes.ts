export interface AuthState {
    token: string;
    isLoggedIn: boolean;
    email: string;
    userId: string;
    usernameAndEmail: string;
}

// Initial state

export const initialState: AuthState = {
    token: "",
    isLoggedIn: false,
    email: "",
    userId: "",
    usernameAndEmail: ""
}