export interface AuthState {
    token: string;
    isLoggedIn: boolean;
    email: string;
    userId: string;
    usernameAndEmail: string;
    valid: boolean;
}

// Initial state

export const initialState: AuthState = {
    token: "",
    isLoggedIn: false,
    email: "",
    userId: "",
    usernameAndEmail: "",
    valid: false
}

  