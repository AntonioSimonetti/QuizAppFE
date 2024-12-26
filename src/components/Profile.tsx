import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { resetPassword, forgotPassword } from "../services/authentication";
import { validateConfirmPassword, validatePassword } from "../utils/helpers";
import "../styles/Profile.css";


const Profile = () => {
    // Recuperiamo l'email dell'utente dallo store Redux
    const email = useSelector((state: RootState) => state.authenticationSlice.email);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [resetToken, setResetToken] = useState(""); // Stato per il reset token
    const [isResetEmailSent, setIsResetEmailSent] = useState(false); // Stato per il messaggio di email inviata
    const [emailError, setEmailError] = useState<string | null>(null); // Per gestire errori di invio email
    const [showForm, setShowForm] = useState(false);

    const handleChangePassword  = async () => {
        // Reset error messages
        setEmailError(null);
        setMessage(null);

        if (!email) {
            setEmailError("Email not found in the profile.");
            return;
        }

        try {
            setIsProcessing(true);
            const result = await forgotPassword(email);
            if (result?.error) {
                setEmailError(result.error);
            } else {
                setIsResetEmailSent(true);
                setMessage("Password reset email sent. Please check your inbox.");
                setShowForm(true)
            }
        } catch (error) {
            setEmailError("An unexpected error occurred while sending the reset email.");
            console.error("Error sending reset email:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePasswordReset = async () => {
        // Reset error messages
        setPasswordError(null);
        setConfirmPasswordError(null);

        // Validate password
        const passwordValidationError = validatePassword(newPassword);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        // Validate confirm password
        const confirmPasswordValidationError = validateConfirmPassword(newPassword, confirmPassword);
        if (confirmPasswordValidationError) {
            setConfirmPasswordError(confirmPasswordValidationError);
            return;
        }

        if (!email || !resetToken) {
            setMessage("Reset token is required, check your email.");
            return;
        }

        setIsProcessing(true);
        try {
            
            const result = await resetPassword(email, resetToken, newPassword);
            if (result?.error) {
                setMessage(result.error);
            } else {
                setMessage("Password successfully reset.");
                setTimeout(() => {
                    setShowForm(false);
                    setNewPassword(""); 
                    setConfirmPassword("");
                    setResetToken(""); 
                    setIsResetEmailSent(false); 
                }, 2000)
            }
        } catch (error) {
            setMessage("An unexpected error occurred.");
            console.error("Error resetting password:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <p>Email: {email}</p>

            {!showForm && (
                <button onClick={handleChangePassword} disabled={isProcessing} className="change-password-btn" >
                    {isProcessing ? "Sending..." : "Change Password"}
                </button>
            )}

            {isResetEmailSent && !showForm && (
                <div>
                    <p>Please check your inbox for the reset token.</p>
                </div>
            )}

            {showForm && (
                <div className="password-reset-section">
                    <input
                        className="input-profile"
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Reset Token"
                    />

                    <input
                        className="input-profile"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                    />

                    <input
                        className="input-profile"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                    />

                    <button onClick={handlePasswordReset} disabled={isProcessing} className="reset-password-btn">
                        {isProcessing ? "Processing..." : "Reset Password"}
                    </button>

                    {(passwordError || confirmPasswordError || emailError || message) && (
                        <div className="error-messages">
                            {passwordError && <p className="error-message">{passwordError}</p>}
                            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                            {emailError && <p className="error-message">{emailError}</p>}
                            {message && <p>{message}</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export default Profile;

