import "../styles/SignInPage.css";
import googleLogo from '../assets/google-logo.svg';
import githubLogo from '../assets/github-logo.svg';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SignUp, SignIn } from "../services/authentication";

const SignInPage = () => {
    const [login, setLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    //emailin use // validationError // loader?

    const dispatch = useDispatch();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
            try {

                console.log("email, password: ", email, password);

                const data = login
                    ? await SignIn(dispatch, { email, password })
                    : await SignUp(dispatch, { email, password });
                
                console.log("Response data: ", data);        
            } catch(error){
                console.log("errore durante l'autenticazione", error)
            }
        
    }

    return (
        
            <div className="Main-div">
                <div className="Top-div">
                    <p>Create your unique quizzes</p>
                </div>
                <h1>
                    {login? "Sign in" : "Sign up account"}
                </h1>
                <p className="Para-Call">
                    {login ? "Enter your personal data to log in" : "Enter your personal data to create your account"}   
                </p>
                <div className="Line"></div>
                <div className="Login-btn-div">
                    <div className="Google-div">
                        <img src={googleLogo} className="icon" alt="Google logo" />
                    </div>
                    <div className="Github-div">
                         <img src={githubLogo} className="icon" alt="Github logo" />
                    </div>
                </div>
                <div className="Gray-lines-div">
                    <div className="Gray-line"></div>
                    <div className="Or-div">
                        <p>or</p>
                    </div>
                    <div className="Gray-line"></div>
                </div>
                <form className="Sign-in-form" onSubmit={handleSubmit}>
                    <div className="Input-wrapper">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email"
                        value ={email}
                        onChange={(event) => setEmail(event.target.value || '')}
                    />
                    </div>
                    <div className="Input-wrapper">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="password"
                        value ={password}
                        onChange={(event) => setPassword(event.target.value || '')}
                    />
                    </div>
                    {!login && (
                    <div className="Input-wrapper">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="confirm password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                    </div>
                    )}
                    <button type="submit" className="Submit-btn">
                        {login ? "Sign in" : "Sign up"}
                    </button>
                </form>
                <div className="Bottom-div">
                    <div className="p-div">
                        <p>{login ? "Don't have an account?" : "Already have an account?"}</p>
                    </div>
                    <div className="Log-in-div" onClick={()=> setLogin(!login)}>
                        <p>{login? "Sign up": "Log in"}</p>
                    </div>
                </div>
            </div>
    )
}

export default SignInPage;


//ri implementare check email in use nel signup
//implementare validation