import axios from "axios";
import { RootState } from '../store/store';
import { AppDispatch } from "../store/store";
import { userAuthenticated, logout as logoutAction, setValidating } from "../store/authenticationSlice"
import { Credentials } from "../interfaces/auth";

const axiosInstance = axios.create({
    baseURL:"https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/"
})

export const validateToken = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) throw new Error("No token found.");
  
    const response = await axiosInstance.get("/api/Token/ValidateToken", {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (response.status !== 200) {
      throw new Error("Token validation failed.");
    }
  
    return token;
};

export const checkEmailInUse = async (email: string) => {
    try {
        const response = await axiosInstance.post("/api/User/isEmailInUse", JSON.stringify(email), { // Non esiste questo endpoint lo devo scrivere
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error){
        console.log("Error in check email in use: ", error); //migliorabile?
    }
}

const checkEmailConfirmation = async (token: string): Promise<boolean> => {
    const response = await axiosInstance.get("/api/user/email-confirmation-status", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data.isConfirmed;
};

export const generateConfirmationLink = async(email:string) => {
    try {
        const response = await axiosInstance.post("/api/User/generateConfirmationLink", JSON.stringify(email), { //controllare se è questo il percorso dell'endpoint.
            headers: {
            'Content-Type': 'application/json'
            }
        });
        return response.data.confirmationLink;
    }catch(error){
        console.log("Error in generate confirmation link: ", error); //migliorabile?
    }
}

export const SignUp = async (dispatch: AppDispatch, credentials: Credentials) => {
    try {
        const { data } = await axiosInstance.post("/register", credentials);
        return { success: true, message: 'Registration successful! Please check your email to confirm your account.' };
    } catch (error: unknown) {
        if(axios.isAxiosError(error)){
            if (error.response?.data?.errors?.DuplicateUserName) {
                return { error: 'Email is already in use' };
            }
            return { error: 'Registration failed' };
        }
        return { error: 'An unexpected error occurred' };
    }
}

export const SignIn = async (dispatch: AppDispatch, credentials: Credentials) => {
    try {
        const { data } = await axiosInstance.post("/login", credentials);

        const isEmailConfirmed = await checkEmailConfirmation(data.accessToken);
        if (!isEmailConfirmed) {
            return { error: 'EMAIL_NOT_CONFIRMED' };
        }

        const userDataResponse = await axiosInstance.get("/api/user/profile", {
            headers: {
                Authorization: `Bearer ${data.accessToken}`
            }
        });

        const { id, email } = userDataResponse.data;

        if (!id || !email) {
            throw new Error("User data is incomplete or missing.");
        }

        localStorage.setItem("token", data.accessToken);
        dispatch(userAuthenticated({...data, userId: id, email, valid: true}));
        return data;
    } catch (error: unknown) {
        console.log('Login error full response:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { error: 'Username or password incorrect' };
        }
        return { error: 'An unexpected error occurred' };
    }
};

export const resendConfirmationEmail = async (email: string) => {
    try {
        const response = await axiosInstance.post("/resendConfirmationEmail", { email });
        return { success: true };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || 'Failed to resend confirmation email' };
        }
        return { error: 'An unexpected error occurred' };
    }
};

export const forgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post("/forgotPassword", { email });
        return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Error in forgotPassword:", error);
            // Gestiamo eventuali errori specifici di axios
            return error.response?.data || { error: "An unexpected error occurred" };
          }
          // Gestione di errori generici
          return { error: "An unexpected error occurred" };
        }
};

export const resetPassword = async (email: string, resetCode: string, newPassword: string) => {
    try {
    const response = await axiosInstance.post("/resetPassword", {
      email,
      resetCode,
      newPassword
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Error in resetPassword:", error);
      return error.response?.data || { error: "An unexpected error occurred" };
    }
  }
};

// Non dovrebbe stare qui??
export const logout = (dispatch: AppDispatch) => {
    localStorage.removeItem("token")
    dispatch(logoutAction());
}