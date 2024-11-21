import axios from "axios";
import { RootState } from '../store/store';
import { AppDispatch } from "../store/store";
import { userAuthenticated, logout as logoutAction } from "../store/authenticationSlice"

// Da decidere dove mettere dopo
interface Credentials {
    email: string, 
    password: string;
}

const axiosInstance = axios.create({
    baseURL:"https://quizappbe-cjavc5btahfscyd9.eastus-01.azurewebsites.net/"
})

// validate token
/*
export const validateToken = async (dispatch: AppDispatch, getState: Function) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found in localStorage.");
            throw new Error("No token found in localStorage.");
        }

        // Chiamata all'API per validare il token
        const response = await axiosInstance.get("/api/Token/ValidateToken", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const currentState = getState();

            const { email, userId, usernameAndEmail } = currentState.authentication; 

            // Dispatch solo aggiornando il campo `valid` senza sovrascrivere gli altri valori
            dispatch(userAuthenticated({
                accessToken: token,            
                valid: true,                   
                userId: userId || "",       
                usernameAndEmail: usernameAndEmail || "",  
                email: email || "",            
            }));
        } else {
            console.log("Token validation failed.");
            dispatch(logoutAction()); // Effettua il logout se necessario
        }
    } catch (error) {
        console.error("Token validation failed:", error);
        // In caso di errore, invalida e fai logout
        dispatch(userAuthenticated({
            valid: false, 
            accessToken: "", 
            userId: "",       
            usernameAndEmail: "", 
            email: "", 
        }));
        dispatch(logoutAction());
    }
};
*/

export const validateToken = async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState().authenticationSlice; // Ottieni lo stato di authenticationSlice
      const token = currentState.token;
  
      if (!token) {
        console.error("No token found.");
        throw new Error("No token found.");
      }
  
      // Chiamata all'API per validare il token
      const response = await axiosInstance.get("/api/Token/ValidateToken", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        // Se il token è valido, aggiorna lo stato esistente
        dispatch(
          userAuthenticated({
            accessToken: token,
            email: currentState.email || "",
            userId: currentState.userId || "",
            usernameAndEmail: currentState.usernameAndEmail || "",
            valid: true,
          })
        );
      } else {
        console.log("Token validation failed.");
        dispatch(logoutAction()); // Effettua il logout se il token non è valido
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      dispatch(
        userAuthenticated({
          accessToken: "",
          email: "",
          userId: "",
          usernameAndEmail: "",
          valid: false,
        })
      );
      dispatch(logoutAction()); // Effettua il logout in caso di errore
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

        // Probabilmente superfluo e rindondante perchè se la chiamata fallisce il dispatch non sarebbe mai partito e quindi non c'è bisogno di controllare la validità del token
        // Se invece la chiamata viene effettuata con successo (e torna 200 ok()) il token è stato anche validato dal BE e quindi non c'è bisogno anche di questa ulteriore chiamata
        // await validateToken(dispatch);

        dispatch(userAuthenticated({... data, emailConfirmationLink, valid: true}));

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

        // Probabilmente superfluo e rindondante perchè se la chiamata fallisce il dispatch non sarebbe mai partito e quindi non c'è bisogno di controllare la validità del token
        // Se invece la chiamata viene effettuata con successo (e torna 200 ok()) il token è stato anche validato dal BE e quindi non c'è bisogno anche di questa ulteriore chiamata
        //await validateToken(dispatch);

        dispatch(userAuthenticated({...data, userId: id, email, valid: true}))

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