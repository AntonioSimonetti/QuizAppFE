import axios from "axios";
import { userAuthenticated } from "../store/authenticationSlice";
import { AppDispatch } from "../store/store";

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

        // Check if email is already in use
        const emailCheck = await checkEmailInUse(credentials.email);

        if(emailCheck.isEmailInUse) {
            const error = new Error("Email is already in use.");
            //error.response = { status: 400, data: "Email is already in use."}; definirò una classe specifica estendendo la classe base error? 
            throw error;
        }

        const { data } = await axiosInstance.post("/register", credentials);

        // Da controllare se ho bisogno di passare tutti questi dati qui

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