import './App.css';
import SignInPage from './components/SignInPage';
import Homepage from './components/HomePage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState }  from 'react'
import { authenticationSlice } from './store/authenticationSlice';
import { RootState } from './store/store';


function App() {
  const {isLoggedIn} = useSelector((state:RootState) => state.authenticationSlice);
  const dispatch = useDispatch();


  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Homepage /> : <Navigate to="/signin" />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignInPage />} />
      </Routes>
    </Router>

  );
}

export default App;