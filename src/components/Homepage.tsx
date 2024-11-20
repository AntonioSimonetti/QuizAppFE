import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../services/authentication';
import { RootState } from '../store/store';
import { useEffect } from 'react';

const Homepage = () => {
  const dispatch = useDispatch();
  
  // Ottieni lo stato globale da Redux
  const state = useSelector((state: RootState) => state);

  const handleLogout = () => {
    logout(dispatch);
  }

  // useEffect per loggare lo stato quando il componente è montato per la prima volta
  useEffect(() => {
    console.log("Homepage component mounted, current Redux state:", state);
  }, []); // L'array vuoto fa sì che l'effetto venga eseguito solo una volta al montaggio del componente

  return (
    <div>
      <h1>Homepage</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Homepage;
