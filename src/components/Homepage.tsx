import { useDispatch } from 'react-redux';
import { logout } from '../services/authentication';

const Homepage = () => {

    const dispatch = useDispatch();

    const handleLogout = () => {
        logout(dispatch);
    }

    return(
        <div>
            <h1>Homepage</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
   )
}

export default Homepage;