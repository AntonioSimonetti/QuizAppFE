import './App.css';
import SignInPage from './components/SignInPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


function App() {
  return (
    <SignInPage/>
  );
}

export default App;