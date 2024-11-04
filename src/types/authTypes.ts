export interface AuthState {
    token: string;
    isLoggedIn: boolean;
    emailConfirmationLink: string;
    userId: string;
    usernameAndEmail: string;
}

// Initial state

export const initialState: AuthState = {
    token: "",
    isLoggedIn: false,
    emailConfirmationLink: "",
    userId: "",
    usernameAndEmail: ""
}