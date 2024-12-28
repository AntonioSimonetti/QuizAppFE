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
  const activeComponent = useSelector((state: RootState) => state.navigationSlice.activeComponent);
  const activeSubComponent = useSelector((state: RootState) => state.navigationSlice.activeSubComponent);

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
        const currentState = useSelector((state: RootState) => state.authenticationSlice);
        dispatch(
          userAuthenticated({
            ...currentState, // Mantieni i valori esistenti
            accessToken: validToken,
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


  if (isValidating) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      background: 'transparent',
      backgroundImage: 'linear-gradient(to right, rgb(0, 255, 144), rgb(245, 254, 55))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Homepage /> : <Navigate to="/signin" />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignInPage />} />
            <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <SignInPage />} />
          </Routes>
        </div>
        {isLoggedIn && <div id='nav-container'
          className={activeComponent === 'YourQuizzes' && activeSubComponent === 'QuizView' ? 'active-component' : ''}
          ><Navbar /></div>}
      </div>
    </Router>
);
  

}

export default App;