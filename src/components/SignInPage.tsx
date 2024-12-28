import "../styles/SignInPage.css";
import googleLogo from '../assets/google-logo.svg';
import githubLogo from '../assets/github-logo.svg';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SignUp, SignIn, resendConfirmationEmail, resetPassword, forgotPassword } from "../services/authentication";
import { validateEmail, validatePassword, validateConfirmPassword } from "../utils/helpers";

const SignInPage = () => {
    const [login, setLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");
    const [resetMessage, setResetMessage] = useState<string | null>(null);
    const [isProcessingReset, setIsProcessingReset] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);

    const [shakingButton, setShakingButton] = useState<'google' | 'github' | null>(null);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setAuthError(null);

        // Email validation
        const emailError = validateEmail(email);
        if (emailError) {
            setAuthError(emailError);
            return;
        }

        // Password validation
        if (!login) {  // Solo per sign up
            const passwordError = validatePassword(password);
            if (passwordError) {
                setAuthError(passwordError);
                return;
            }

            const confirmError = validateConfirmPassword(password, confirmPassword);
            if (confirmError) {
                setAuthError(confirmError);
                return;
            }
        } else {  // Per login
            if (!password) {
                setAuthError('Password is required');
                return;
            }
        }

        setIsAuthenticating(true);

        try {
            if (login) {
                const data = await SignIn(dispatch, { email, password });
                if (data?.error) {
                    const errorMessage = data.error === 'EMAIL_NOT_CONFIRMED'
                        ? 'Please confirm your email before logging in'
                        : data.error;
                    setAuthError(errorMessage);
                    return;
                }
                navigate("/");
            } else {
                const result = await SignUp(dispatch, { email, password });
                if (result?.error) {
                    setAuthError(result.error);
                    return;
                }
                if (result?.success) {
                    setAuthError(result.message); // Using authError to display success message
                    // Optional: reset form
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                }
            }
        } catch (error) {
            setAuthError("An unexpected error occurred. Please try again later.");
        } finally {
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

    const handleForgotPassword = async () => {
        setResetMessage(null);
        
        if (!resetEmail) {
            setResetMessage("Email is required");
            return;
        }

        setIsProcessingReset(true);
        try {
            const result = await forgotPassword(resetEmail);
            if (result?.error) {
                setResetMessage(result.error);
            } else {
                setShowResetForm(true);
                setResetMessage("Reset token has been sent to your email");
            }
        } catch (error) {
            setResetMessage("An unexpected error occurred");
        } finally {
            setIsProcessingReset(false);
        }
    };

    const resetModalState = () => {
        setResetEmail("");
        setResetToken("");
        setNewPassword("");
        setResetConfirmPassword("");
        setResetMessage(null);
        setShowResetForm(false);
    };

    const closeResetModal = () => {
        setShowResetModal(false);
        resetModalState();
    }

    const handlePasswordReset = async () => {
        setResetMessage(null);

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setResetMessage(passwordError);
            return;
        }

        const confirmError = validateConfirmPassword(newPassword, resetConfirmPassword);
        if (confirmError) {
            setResetMessage(confirmError);
            return;
        }

        setIsProcessingReset(true);
        try {
            const result = await resetPassword(resetEmail, resetToken, newPassword);
            if (result?.error) {
                setResetMessage(result.error);
            } else {
                setResetMessage("Password successfully reset");
                setTimeout(() => {
                    setShowResetModal(false);
                    resetModalState();
                }, 2000);
            }
        } catch (error) {
            setResetMessage("An unexpected error occurred");
        } finally {
            setIsProcessingReset(false);
        }
    };

    const handleSocialClick = (provider: 'google' | 'github') => {
        setShakingButton(provider);
        setAuthError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`);
        
        setTimeout(() => {
            setShakingButton(null);
            setAuthError(null);
        }, 2000);
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
                <div className={`Google-div ${shakingButton === 'google' ? 'social-button-error' : ''}`}
                        onClick={() => handleSocialClick('google')}>
                        <img src={googleLogo} className="icon" alt="Google logo" />
                    </div>
                <div className={`Github-div ${shakingButton === 'github' ? 'social-button-error' : ''}`}
                        onClick={() => handleSocialClick('github')} >
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
                            value={email}
                            onChange={(event) => setEmail(event.target.value || '')}
                        />
                    </div>
                    <div className="Input-wrapper">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value || '')}
                        />
                    </div>
                    {login && (
                        <div className="forgot-password" onClick={() => setShowResetModal(true)}>
                            Forgot Password?
                        </div>
                    )}
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
                    <div className="Log-in-div" onClick={() => setLogin(!login)}>
                        <p>{login? "Sign up": "Log in"}</p>
                    </div>
                </div>
                {authError && (
                    <div className={`error-message ${authError.includes('successful') ? 'success' : ''}`}>
                        {authError}
                        {authError === 'Please confirm your email before logging in' && (
                            <button 
                                className="resend-button" 
                                onClick={handleResendEmail}
                            >
                                Resend confirmation email
                            </button>
                        )}
                    </div>
                )}
        
                {/* Modal per il reset della password */}
                {showResetModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="modal-close" onClick={closeResetModal}>×</button>
                            <h2 className="modal-title">Reset Password</h2>
                            
                            <div className="modal-form">
                                {!showResetForm ? (
                                    <>
                                        <input
                                            type="email"
                                            className="modal-input"
                                            placeholder="Enter your email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                        />
                                        <button
                                            className="modal-button"
                                            onClick={handleForgotPassword}
                                            disabled={isProcessingReset}
                                        >
                                            {isProcessingReset ? "Sending..." : "Send Reset Token"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            className="modal-input"
                                            placeholder="Enter reset token"
                                            value={resetToken}
                                            onChange={(e) => setResetToken(e.target.value)}
                                        />
                                        <input
                                            type="password"
                                            className="modal-input"
                                            placeholder="New password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <input
                                            type="password"
                                            className="modal-input"
                                            placeholder="Confirm new password"
                                            value={resetConfirmPassword}
                                            onChange={(e) => setResetConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            className="modal-button"
                                            onClick={handlePasswordReset}
                                            disabled={isProcessingReset}
                                        >
                                            {isProcessingReset ? "Resetting..." : "Reset Password"}
                                        </button>
                                    </>
                                )}
                                
                                {resetMessage && (
                                    <div className={`modal-message ${resetMessage.includes('error') ? 'modal-error' : ''}`}>
                                        {resetMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );

}

export default SignInPage;


