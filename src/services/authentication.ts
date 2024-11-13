import axios from "axios";
import { userAuthenticated } from "../store/authenticationSlice";
import { AppDispatch } from "../store/store";
import { logout as logoutAction } from "../store/authenticationSlice"

// Da decidere dove mettere dopo
interface Credentials {
    email: string, 
    password: string;
}

const axiosInstance = axios.create({
    baseURL:"https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/"
})

export const checkEmailInUse = async (email: string) => {
    try {
        const response = await axiosInstance.post("/api/User/isEmailInUse", JSON.stringify(email), { //controllare se è questo il percorso dell'endpoint.
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