import './App.css';
import SignInPage from './components/SignInPage';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect }  from 'react'
import { userAuthenticated, setValidating, logout  } from './store/authenticationSlice';
import { RootState } from './store/store';
import { validateToken } from './services/authentication';



function App() {
  const {isLoggedIn, isValidating } = useSelector((state:RootState) => state.authenticationSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    dispatch(setValidating(true));
  
    if (!token) {
      dispatch(setValidating(false));
      return;
    }
  
    validateToken()
      .then((validToken) => {
        dispatch(
          userAuthenticated({
            accessToken: validToken,
            email: "",
            userId: "",
            usernameAndEmail: "",
            valid: true,
          })
        );
      })
      .catch((error) => {
        dispatch(logout());
      })
      .finally(() => {
        dispatch(setValidating(false));
      });
  }, [dispatch]);

  useEffect(() => {
    console.log("isValidating changed:", isValidating);
  }, [isValidating]);

  if (isValidating) {
    return <div>Loading...</div>;
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Homepage /> : <Navigate to="/signin" />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignInPage />} /> {/*  queste rotte da rivedere*/} 
        <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <SignInPage />} />
      </Routes>
        {isLoggedIn && <div id='nav-container'><Navbar /></div>}
    </Router>

  );
}

export default App;