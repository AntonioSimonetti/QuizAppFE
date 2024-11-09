import "../styles/SignInPage.css";
import googleLogo from '../assets/google-logo.svg';
import githubLogo from '../assets/github-logo.svg';
import { useState } from "react";

const SignInPage = () => {
    const [login, setLogin] = useState(true);

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
                <form className="Sign-in-form">
                    <div className="Input-wrapper">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email"
                    />
                    </div>
                    <div className="Input-wrapper">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="password"
                    />
                    </div>
                    <div className={`Input-wrapper ${login ? "Input-wrapper-none" : ""}`}>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="confirm password"
                    />
                    </div>
                    <button className="Submit-btn">
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
