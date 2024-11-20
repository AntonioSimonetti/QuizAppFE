import axios from "axios";
import { AppDispatch } from "../store/store";
import { tokenValidationStatus, userAuthenticated, logout as logoutAction } from "../store/authenticationSlice"

// Da decidere dove mettere dopo
interface Credentials {
    email: string, 
    password: string;
}

const axiosInstance = axios.create({
    baseURL:"https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/"
})

/*
export const validateToken = async (dispatch: AppDispatch) => {
    try {
        // Aggiungo un log per vedere se il token è presente in localStorage
        const token = localStorage.getItem("token");
        //console.log("Token retrieved from localStorage:", token); // Log token

        if (!token) {
            console.error("No token found in localStorage.");
            throw new Error("No token found in localStorage.");
        }

        // Chiamata per la validazione del token
        const response = await axiosInstance.get("/api/Token/ValidateToken", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Aggiungo un log per vedere la risposta dell'API
        console.log("Token validation response:", response);

        // Se la risposta è valida
        if (response.status === 200) {
            console.log("Token is valid.");
            dispatch(tokenValidationStatus({ isValid: true }));
        } else {
            console.log("Token validation failed (unexpected status).");
            dispatch(tokenValidationStatus({ isValid: false }));
            dispatch(logoutAction());
        }
    } catch (error) {
        console.error("Token validation failed:", error);
        dispatch(tokenValidationStatus({ isValid: false }));
        dispatch(logoutAction());
    }
};
*/

export const validateToken = async (dispatch: AppDispatch) => {
    try {
        // Log dello stato di valid prima della modifica
        console.log("Current valid state before change:", localStorage.getItem("token") ? "true" : "false");

        // Ottieni il valore del token da localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            // Se il token non è presente in localStorage, allora considera valid = false
            console.error("No token found in localStorage.");
            dispatch(tokenValidationStatus({ isValid: false })); // Invia stato "invalid" se non c'è un token
            return;
        }

        // Log del token attuale (per debug)
        console.log("Token retrieved from localStorage:", token);

        // Cambia lo stato della validità al contrario (se è true diventa false, e viceversa)
        dispatch(tokenValidationStatus({ isValid: false })); // Qui fai il contrario per il test

    } catch (error) {
        console.error("Token validation failed:", error);
        dispatch(tokenValidationStatus({ isValid: false }));
        dispatch(logoutAction());
    }
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

export const generateConfirmationLink = async(email:string) => {
    try {
        const response = await axiosInstance.post("/api/User/egenerateConfirmationLink", JSON.stringify(email), { //controllare se è questo il percorso dell'endpoint.
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
        const linkesponse = await generateConfirmationLink(email); // probabilmente non mi servirà
        const emailConfirmationLink = linkesponse ? linkesponse : "";

        dispatch(userAuthenticated({... data, emailConfirmationLink}));

        return data; 
    } catch (error: unknown) {
        if(axios.isAxiosError(error)){
        console.error("Error during the signup", error);
        } else {
            console.error("An unexpected error occurred", error);
        }
        throw error;
    }
}

export const SignIn = async (dispatch: AppDispatch, credentials: Credentials) => {
    try {
        // Chiamata per il login
        const { data } = await axiosInstance.post("/login", credentials);

        // Verifica il contenuto di data
        console.log("Login response data:", data);

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

        dispatch(userAuthenticated({...data, userId: id, email}))

        // Ritorna semplicemente data per la validazione di login
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error during SignIn:", error.message);
        } else {
            console.error("Unexpected error during SignIn:", error);
        }
        throw error; // Rilancia l'errore per una gestione successiva
    }
};

export const logout = (dispatch: AppDispatch) => {
    localStorage.removeItem("token")
    dispatch(logoutAction());
}