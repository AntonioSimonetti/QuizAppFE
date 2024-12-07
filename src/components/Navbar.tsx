import "../styles/Navbar.css";
import firstIcon from '../assets/icon-user-navbar.svg';
import secondIcon from "../assets/icon-home-navbar.svg";
import thirdIcon from "../assets/icon-logout-navbar.svg";
import { useDispatch } from 'react-redux';
import { setActiveComponent } from '../store/navigationSlice';
import { logout } from '../services/authentication';


const Navbar = () => {
  const dispatch = useDispatch();

  const handleGoHome = () => {
    dispatch(setActiveComponent(null)); 
  };

  const handleLogout = () => {
    logout(dispatch); 
  };

  return (
    <nav className="navbar">
        <div className="nav-first">
            <img src={firstIcon} className="icon" alt="First navbar icon" />
        </div>
        <div className="nav-second"  onClick={handleGoHome}>
            <img src={secondIcon} className="icon" alt="Second navbar icon" />
        </div>
        <div className="nav-third" onClick={handleLogout}>
         <img src={thirdIcon} className="icon" alt="Third navbar icon" />
        </div>
    </nav>
  );
};

export default Navbar;
