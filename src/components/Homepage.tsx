import { useDispatch, useSelector } from 'react-redux';
import { validateToken, logout } from '../services/authentication';
import { RootState } from '../store/store';  // Assicurati che questo sia importato correttamente
import { AuthState } from '../types/authTypes'; 

const Homepage = () => {
  const dispatch = useDispatch();
  
  // Ottieni lo stato globale da Redux
  const state = useSelector((state: RootState) => state.authenticationSlice) as AuthState;




  const handleLogout = () => {
    logout(dispatch);
  };

  const handleValidateToken = async () => {
    try {
      await validateToken(dispatch, () => ({
        authenticationSlice: state
      } as RootState));
      console.log('Token validated successfully');
    } catch (error) {
      console.error('Token validation failed:', error);
    }
  };

  return (
    <div>
      <h1>Homepage</h1>
      <button onClick={handleLogout}>Logout</button>
      <br />
      <button onClick={handleValidateToken}>Validate Token</button>
      <div>
        <p>Email: {state.email}</p>
        <p>UserId: {state.userId}</p>
        <p>Valid: {state.valid ? 'True' : 'False'}</p>
      </div>
    </div>
  );
};

export default Homepage;
