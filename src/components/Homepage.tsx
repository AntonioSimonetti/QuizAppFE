import { useDispatch, useSelector } from 'react-redux';
import { setActiveComponent } from '../store/navigationSlice';
import { validateToken, logout } from '../services/authentication';
import { RootState } from '../store/store';  // Assicurati che questo sia importato correttamente
import { AuthState } from '../types/authTypes'; 
import React, { useState } from 'react';
import "../styles/Homepage.css";
import yourQuizzesLogo from '../assets/your-quizzes-logo.svg';
import publicQuizzesLogo from "../assets/public-quizzes-logo.svg"
import statisticsLogo from "../assets/statistics-logo.svg"
import settingsIcon from "../assets/settings-icon.svg"
import linkedinLogo from "../assets/LinkedIn.svg"
import redditLogo from "../assets/Reddit.svg"
import facebookLogo from "../assets/Facebook.svg"
import fireIcon from "../assets/icon-fire.svg"

//componenti
import YourQuizzes from './YourQuizzes';
import PublicQuizzes from './PublicQuizzes'; 
import Statistics from './Statistics'; 


const Homepage = () => {
  const dispatch = useDispatch();
  
  // Ottieni lo stato globale da Redux
  const activeComponent = useSelector((state: RootState) => state.navigationSlice.activeComponent);

  const handleSetActiveComponent = (component: string | null) => {
    dispatch(setActiveComponent(component));
  };


  const handleLogout = () => {
    logout(dispatch);
  };



   // Funzione per tornare alla Homepage
   const goBackToHomepage = () => {
    setActiveComponent(null);
  };

   // Rendering dinamico
   if (activeComponent === "YourQuizzes") {
    return <YourQuizzes   />;
  }

  if (activeComponent === "PublicQuizzes") {
    return <PublicQuizzes  />;
  }

  if (activeComponent === "Statistics") {
    return <Statistics   />;
  }

  return (
    <div className='Homepage-main-div'>
      <div className='Your-quizzes-div' onClick={() => handleSetActiveComponent("YourQuizzes")}>
        <div className='Your-quizzes-logo-div' >
           <img src={yourQuizzesLogo} className="icon" alt="Your quizzes logo" />
        </div>
        <div className='Para-div'>
          <p>Your</p>
          <p className='Para-quizzes'>Quizzes</p>
        </div>
      </div>
      <div className='Homepage-second-div'>
        <div className='Public-div' id='Public-div' onClick={() => handleSetActiveComponent("PublicQuizzes")}>
          <img src={publicQuizzesLogo} className="icon" alt="Public Quizzes logo" />
          <p>Public Quizzes</p>
        </div>
        <div className='Statistics-div' id='Statistics-div' onClick={() => handleSetActiveComponent("Statistics")}>
          <img src={statisticsLogo} className="icon" alt="Statistics logo" />
          <p>Statistics</p>
        </div>
      </div>
      <div className='Homepage-third-div'>
          <div className='Social-div' id="Social-div">
              <div className='loghi-div'>
                <img src={facebookLogo} className="icon" alt="Facebook Icon" />
                <img src={redditLogo} className="icon" alt="Reddit Icon" />
                <img src={linkedinLogo} className="icon" alt="Linkedin Icon" />
              </div>
              <p>Social</p>
          </div>
          <div className='Settings-div' id="Settings-div">
              <img src={settingsIcon} className="icon" alt="Settings icon" />
              <p>Settings</p>
          </div>
      </div>
      <div className='Homepage-fourth-div'>
         <div className='container-icon'>
             <img src={fireIcon} className="icon" alt="Fire icon" />
             <div className='container-text-numeber'>
               <p>Quizzes completed</p>
               <p id='number-placeholder'>20</p>
             </div>
         </div>
         <div className='container-days'>
            <div className='container-number-day'>
                <p>M</p>
                <div className='monday-placeholder'>

                </div>
            </div>
            <div className='container-number-day'>
                <p>T</p>
                <div className='monday-placeholder'>

                </div>
            </div>
            <div className='container-number-day'>
                <p>W</p>
                <div className='monday-placeholder' style={{ backgroundColor: "#E24F46" }}>

                </div>
            </div>
            <div className='container-number-day'>
                <p>T</p>
                <div className='monday-placeholder'>

                </div>
            </div>
            <div className='container-number-day'>
                <p>F</p>
                <div className='monday-placeholder'>

                </div>
            </div>
            <div className='container-number-day'>
                <p>S</p>
                <div className='monday-placeholder' style={{ backgroundColor: "#808080" }}>

                </div>
            </div>
            <div className='container-number-day'>
                <p>S</p>
                <div className='monday-placeholder' style={{ backgroundColor: "#808080" }}>

                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Homepage;
