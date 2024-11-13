import './App.css';
import SignInPage from './components/SignInPage';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState }  from 'react'
import { authenticationSlice, userAuthenticated } from './store/authenticationSlice';
import { RootState } from './store/store';


function App() {
  const {isLoggedIn} = useSelector((state:RootState) => state.authenticationSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
      dispatch(userAuthenticated({ accessToken: token, email:"", userId:"", usernameAndEmail: ""}))
    }
  }, [dispatch])


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