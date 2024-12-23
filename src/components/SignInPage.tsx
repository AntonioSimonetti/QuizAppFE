import "../styles/SignInPage.css";
import googleLogo from '../assets/google-logo.svg';
import githubLogo from '../assets/github-logo.svg';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SignUp, SignIn, resendConfirmationEmail } from "../services/authentication";

const SignInPage = () => {
    const [login, setLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showResendButton, setShowResendButton] = useState(false);



    //emailin use // validationError // loader?

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setAuthError(null);

        // Field validation
        if (!email && !password) {
            setAuthError('Email and password are required');
            return;
        }
        if (!email) {
            setAuthError('Email is required');
            return;
        }
        if (!password) {
            setAuthError('Password is required');
            return;
        }

        // Sign up specific validations
        if (!login) {
            if (!confirmPassword) {
                setAuthError('Please confirm your password');
                return;
            }
            if (password !== confirmPassword) {
                setAuthError('Passwords do not match');
                return;
            }
        }

        setIsAuthenticating(true); 

            try {
                const data = login
                    ? await SignIn(dispatch, { email, password })
                    : await SignUp(dispatch, { email, password });

                if (data?.error) {
                    const errorMessage = data.error === 'EMAIL_NOT_CONFIRMED' 
                        ? 'Please confirm your email before logging in'
                        : data.error;
                    setAuthError(errorMessage);
                    return;
                }
                
                navigate("/");     
            } catch(error){
                setAuthError("An unexpected error occurred. Please try again later.");
            }finally {
                setIsAuthenticating(false);
            }  
    }

    const handleResendEmail = async () => {
        const result = await resendConfirmationEmail(email);
        if (result.success) {
            setAuthError('Confirmation email has been resent. Please check your inbox.');
        } else {
            setAuthError(result.error);
        }
    };

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
                <div className={`Line ${isAuthenticating ? 'authenticating' : ''}`}></div>
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
                {authError && (
                        <div className="error-message">
                        {authError}
                        {authError === 'Please confirm your email before logging in' && (
                            <button 
                                className="resend-button" 
                                onClick={handleResendEmail}
                            >
                                Resend confirmation email
                            </button>
                        )}
                    </div>)}
            </div>
    )
}

export default SignInPage;


