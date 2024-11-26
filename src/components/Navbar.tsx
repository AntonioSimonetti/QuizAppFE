import "../styles/Navbar.css";
import firstIcon from '../assets/icon-user-navbar.svg';
import secondIcon from "../assets/icon-home-navbar.svg";
import thirdIcon from "../assets/icon-logout-navbar.svg";


const Navbar = () => {
  return (
    <nav className="navbar">
        <div className="nav-first">
            <img src={firstIcon} className="icon" alt="First navbar icon" />
        </div>
        <div className="nav-second">
            <img src={secondIcon} className="icon" alt="Second navbar icon" />
        </div>
        <div className="nav-third">
         <img src={thirdIcon} className="icon" alt="Third navbar icon" />
        </div>
    </nav>
  );
};

export default Navbar;
