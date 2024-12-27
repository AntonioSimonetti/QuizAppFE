import React, { useState, useEffect } from "react";
import "../styles/PublicQuizzes.css";
import { blinkAnimation } from '../styles/Animations';
import removeIcon from "../assets/remove-icon.svg";
import editIcon from "../assets/edit-icon.svg";
import QuizView from './QuizView';

// Services and Utils
import { fetchPublicQuizzes } from "../services/quizzes";
import truncateTitle from "../utils/helpers";

// Types and Interfaces
import { Quiz } from '../interfaces/quiz'; 

// Custom Hooks
import { useQuizPagination } from "../hooks/useQuizPagination";

const PublicQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // Stato locale per i quiz
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null); // Stato per il quiz selezionato

  const [loading, setLoading] = useState<boolean>(false); // Stato di caricamento
  const [error, setError] = useState<string | null>(null); // Stato per errori
  const [token, setToken] = useState<string | null>(localStorage.getItem('token')); // Token dell'utente (può essere localStorage o redux)

  const QUIZZES_PER_PAGE = 5;
  const { quizzesToShow, nextPage, previousPage, hasNextPage, hasPreviousPage } = useQuizPagination(quizzes, QUIZZES_PER_PAGE);

  // Effettua il fetch dei quiz quando il componente viene montato
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchPublicQuizzes(token)
        .then((data) => {
          console.log('Dati ricevuti dalla API:', data);
          setQuizzes(data); // Salviamo i quiz nello stato locale
          setLoading(false);
        })
        .catch((err) => {
          console.error('Errore nel recupero dei quiz pubblici:', err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError('Token non trovato.');
    }
  }, [token]);

  // Funzione per selezionare un quiz da visualizzare
  const handleQuizClick = (quiz: Quiz) => {
    console.log('Quiz selezionato:', quiz);
    setSelectedQuiz(quiz);
  };

  return (
    <div className={`main-div ${!selectedQuiz ? 'active-component' : ''}`}>
      {selectedQuiz ? (
        <QuizView quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
      ) : (
        <>
          <div id="your-quizzes-top-div">
              <h1>Public Quizzes</h1>
              <div className="Line-two"></div>
          </div>

          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          
          <div id="quizzes-container">
            {quizzesToShow.length > 0 ? (
              quizzesToShow.map((quiz: Quiz) => (
                <div
                  className="single-quiz-container"
                  key={quiz.id}
                  onClick={() => handleQuizClick(quiz)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="single-quiz-para"        
                   title={quiz.title}
                  >
                    <p title={quiz.title}>{truncateTitle(quiz.title)}</p>
                  </div>
                 
                </div>
              ))
            ) : (
              <div>No quizzes available</div>
            )}
          </div>

          <div className="pagination-buttons">
            <button onClick={previousPage} disabled={!hasPreviousPage}>
              &lt;
            </button>
            <button onClick={nextPage} disabled={!hasNextPage}>
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PublicQuizzes;
