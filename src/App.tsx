import './App.css';
import SignInPage from './components/SignInPage';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState }  from 'react'
import { authenticationSlice, tokenValidationStatus, userAuthenticated } from './store/authenticationSlice';
import { RootState } from './store/store';
import { validateToken } from './services/authentication';



function App() {
  const {isLoggedIn} = useSelector((state:RootState) => state.authenticationSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
      dispatch(userAuthenticated({ accessToken: token, email:"", userId:"", usernameAndEmail: ""}))
    }
  }, [dispatch])


  const state = useSelector((state: RootState) => state);
  useEffect(() => {
    console.log("Current Redux state:", state); 
  }, [state]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Chiama la funzione di validazione del token
      validateToken(dispatch)
        .then((response) => {
          // Se la validazione ha successo, imposta valid a true
          console.log("Token validated successfully");
          dispatch(tokenValidationStatus({ isValid: true }));
        })
        .catch((error) => {
          // Se la validazione fallisce, imposta valid a false
          console.log("Token validation failed", error);
          dispatch(tokenValidationStatus({ isValid: false }));
        });
    } else {
      // Se non c'è un token, imposta valid a false
      dispatch(tokenValidationStatus({ isValid: false }));
    }
  }, [dispatch, isLoggedIn]);
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Homepage /> : <Navigate to="/signin" />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignInPage />} /> {/*  queste rotte da rivedere*/} 
        <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <SignInPage />} />
      </Routes>
    </Router>

  );
}

export default App;