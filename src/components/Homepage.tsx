import { useEffect, useState } from 'react';
import "../styles/Homepage.css";
import yourQuizzesLogo from '../assets/your-quizzes-logo.svg';
import publicQuizzesLogo from "../assets/public-quizzes-logo.svg"
import statisticsLogo from "../assets/statistics-logo.svg"
import settingsIcon from "../assets/settings-icon.svg"
import linkedinLogo from "../assets/LinkedIn.svg"
import redditLogo from "../assets/Reddit.svg"
import facebookLogo from "../assets/Facebook.svg"
import fireIcon from "../assets/icon-fire.svg"
import { useDispatch, useSelector } from 'react-redux';
import { setActiveComponent } from '../store/navigationSlice';
import { RootState } from '../store/store';


//components
import YourQuizzes from './YourQuizzes';
import PublicQuizzes from './PublicQuizzes'; 
import Statistics from './Statistics'; 
import Profile from './Profile';

import WaveTransition from './WaveTransition';

const Homepage = () => {
  const dispatch = useDispatch();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldRenderNext, setShouldRenderNext] = useState(false);
  const activeComponent = useSelector((state: RootState) => state.navigationSlice.activeComponent);
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);



  const handleSetActiveComponent = (component: string | null) => {
    setIsTransitioning(true);
    setTimeout(() => {
      dispatch(setActiveComponent(component));
      setShouldRenderNext(true);
    }, 500); 
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  }

  useEffect(() => {
    if (activeComponent === null) {
        setShouldRenderNext(false);
    }
}, [activeComponent]);

const handlePlaceholderClick = (section: string) => {
  setShowComingSoon(section);
  setTimeout(() => {
      setShowComingSoon(null);
  }, 2000); // Show for 2 seconds
};


  return (
    <>
      {isTransitioning && <WaveTransition onAnimationComplete={handleTransitionComplete} />}
      
      {(shouldRenderNext && activeComponent === "YourQuizzes") && <YourQuizzes />}
      {(shouldRenderNext && activeComponent === "PublicQuizzes") && <PublicQuizzes />}
      {(shouldRenderNext && activeComponent === "Statistics") && <Statistics />}
      {activeComponent === "Profile" && <Profile />}
      
      {!shouldRenderNext && !activeComponent && (
        <div className='Homepage-main-div'>
          <div className='Your-quizzes-div' onClick={() => handleSetActiveComponent("YourQuizzes")}>
            <div className='Your-quizzes-logo-div'>
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
            <div className='Statistics-div' id='Statistics-div' onClick={() => handlePlaceholderClick("statistics")}>
                <img src={statisticsLogo} className="icon" alt="Statistics logo" />
                <p>Statistics</p>
                {showComingSoon === 'statistics' && (
                    <div className="coming-soon-stats">Coming Soon!</div>
                )}
            </div>
          </div>

          <div className='Homepage-third-div'>
            <div className='Social-div' id="Social-div" onClick={() => handlePlaceholderClick('social')}>
              <div className='loghi-div'>
                <img src={facebookLogo} className="icon" alt="Facebook Icon" />
                <img src={redditLogo} className="icon" alt="Reddit Icon" />
                <img src={linkedinLogo} className="icon" alt="Linkedin Icon" />
              </div>
              <p>Social</p>
              {showComingSoon === 'social' && (
                <div className="coming-soon">Coming Soon!</div>
              )}
            </div>
            <div className='Settings-div' id="Settings-div" onClick={() => handlePlaceholderClick('settings')}>
              <img src={settingsIcon} className="icon" alt="Settings icon" />
              <p>Settings</p>
              {showComingSoon === 'settings' && (
                <div className="coming-soon">Coming Soon!</div>
              )}
            </div>
          </div>

          <div className='Homepage-fourth-div' style={{ position: 'relative' }} onClick={() => handlePlaceholderClick('stats')}>
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
                <div className='monday-placeholder'></div>
              </div>
              <div className='container-number-day'>
                <p>T</p>
                <div className='monday-placeholder'></div>
              </div>
              <div className='container-number-day'>
                <p>W</p>
                <div className='monday-placeholder' style={{ backgroundColor: "#E24F46" }}></div>
              </div>
              <div className='container-number-day'>
                <p>T</p>
                <div className='monday-placeholder'></div>
              </div>
              <div className='container-number-day'>
                <p>F</p>
                <div className='monday-placeholder'></div>
              </div>
              <div className='container-number-day'>
                <p>S</p>
                <div className='monday-placeholder' style={{ backgroundColor: "#808080" }}></div>
              </div>
              <div className='container-number-day'>
                <p>S</p>
                <div className='monday-placeholder' style={{ backgroundColor: "#808080" }}></div>
              </div>
            </div>
            {showComingSoon === 'stats' && (
              <div className="coming-soon-fourth">Coming Soon!</div>
            )}
          </div>
        </div>
      )}
    </>
);
}

export default Homepage;
