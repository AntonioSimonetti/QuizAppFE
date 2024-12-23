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

        // Da controllare se ho bisogno di passare tutti questi dati qui
        localStorage.setItem("token", data.accessToken);

        const email = credentials.email;
        /*
        const linkesponse = await generateConfirmationLink(email); // probabilmente non mi servirà
        const emailConfirmationLink = linkesponse ? linkesponse : "";
        */

        const emailConfirmationLink = "";

        // Probabilmente superfluo e rindondante perchè se la chiamata fallisce il dispatch non sarebbe mai partito e quindi non c'è bisogno di controllare la validità del token
        // Se invece la chiamata viene effettuata con successo (e torna 200 ok()) il token è stato anche validato dal BE e quindi non c'è bisogno anche di questa ulteriore chiamata
        // await validateToken(dispatch);

        dispatch(userAuthenticated({... data, emailConfirmationLink, valid: true}));

        return data; 
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

/*
export const SignIn = async (dispatch: AppDispatch, credentials: Credentials) => {
    try {
        // Chiamata per il login
        console.log('Starting login attempt with:', credentials.email);
        const { data } = await axiosInstance.post("/login", credentials);
        console.log("Login response data:", data);

        const userDataResponse = await axiosInstance.get("/api/user/profile", {
            headers: {
                Authorization: `Bearer ${data.accessToken}`
            }
        });
        console.log('User profile response:', userDataResponse.data);
        console.log('Email confirmed status:', userDataResponse.data.emailConfirmed);

        const { id, email, emailConfirmed  } = userDataResponse.data;

        if (!id || !email) {
            throw new Error("User data is incomplete or missing.");
        }

        if (!emailConfirmed) {
            return { error: "EMAIL_NOT_CONFIRMED" };
        }
        
        localStorage.setItem("token", data.accessToken);

        // Probabilmente superfluo e rindondante perchè se la chiamata fallisce il dispatch non sarebbe mai partito e quindi non c'è bisogno di controllare la validità del token
        // Se invece la chiamata viene effettuata con successo (e torna 200 ok()) il token è stato anche validato dal BE e quindi non c'è bisogno anche di questa ulteriore chiamata
        //await validateToken(dispatch);

        dispatch(userAuthenticated({...data, userId: id, email, valid: true}))

        // Ritorna semplicemente data per la validazione di login
        return data;
    } catch (error) {
        console.log('Login error:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { error: 'Username or password incorrect' };
        }
        return { error: 'An unexpected error occurred' };
    }
};*/

export const SignIn = async (dispatch: AppDispatch, credentials: Credentials) => {
    try {
        const { data } = await axiosInstance.post("/login", credentials);
        console.log("Login response data:", data);

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



export const logout = (dispatch: AppDispatch) => {
    localStorage.removeItem("token")
    dispatch(logoutAction());
}