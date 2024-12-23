// React and Hooks
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setActiveSubComponent } from '../store/navigationSlice';

// Interfaces and Types
import { QuizViewProps, QuizDetails } from '../interfaces/quiz';
import { RootState } from '../store/store';

// Services & Utils
import { fetchQuizDetails } from '../services/quizzes';
import { truncateText } from '../utils/helpers';

// Components
import QuizResults from './QuizResults';

// Styles
import '../styles/QuizView.css';


const QuizView = ({ quiz, onBack }: QuizViewProps) => {
  const dispatch = useDispatch();

  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null); // Formatta i dati del quiz per poterli utilizzare nel componente
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  // Tiene traccia a che domanda del quiz è l'utente
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // Tiene traccia delle risposte dell'utente
  const [isQuizComplete, setIsQuizComplete] = useState(false); // Tiene traccia se il quiz è stato finito oppure no

  // Selettore Redux
  const token = useSelector((state: RootState) => state.authenticationSlice.token);

  // Imposta il subcomponent su QuizView, ci serve in questo caso per applicare dello style dinamico
  useEffect(() => {
    dispatch(setActiveSubComponent('QuizView'));
    
    return () => {
      dispatch(setActiveSubComponent(null));
    };
  }, [dispatch]);

  // Fetch dei dettagli del quiz al montaggio del componente
  useEffect(() => {
    const loadQuizDetails = async () => {
      const details = await fetchQuizDetails(quiz.id, token);
      setQuizDetails(details);
    };

    loadQuizDetails();
  }, [quiz.id, token]);

  // Si occupa di tenere traccia delle risposte dell'user durante il quiz
  const handleAnswerSelect = (optionIndex: number) => {
    if (!quizDetails || userAnswers[currentQuestionIndex] !== undefined) {
      return;
    }

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestionIndex]: optionIndex,
    };
    setUserAnswers(updatedAnswers);

    const totalQuestions = quizDetails.quizQuestions.$values.length;
    const unansweredIndex = Object.keys(updatedAnswers).length < totalQuestions
      ? quizDetails.quizQuestions.$values.findIndex((_, i) => updatedAnswers[i] === undefined)
      : -1;

    // Delay per dare un feedback all'user prima di passare alla domanda successiva
    setTimeout(() => {
      if (unansweredIndex !== -1) {
        setCurrentQuestionIndex(unansweredIndex);
      } else {
        setIsQuizComplete(true);
      }
    }, 2000);
  };

  // Utility fn per dare un feedback sulla scelta effettuata dall' user (giusta/sbagliata) 
  const getOptionClassName = (questionIndex: number, optionIndex: number): string => {
    if (!quizDetails || userAnswers[questionIndex] === undefined) {
      return "option-div";
    }

    const correctAnswer = quizDetails.quizQuestions.$values[questionIndex].question.correctAnswerIndex;
    
    if (userAnswers[questionIndex] === optionIndex) {
      return optionIndex === correctAnswer ? "option-div correct" : "option-div incorrect";
    }

    return "option-div";
  };

  // Loading del componente
  if (!quizDetails) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  // Se il componente è vuoto
  if (quizDetails.quizQuestions.$values.length === 0) {
    return (
      <div className="quiz-empty">
        <h2>This quiz is empty!</h2>
        <p>There are no questions available in this quiz.</p>
        <button onClick={onBack} className="back-button">
          Return to Your Quizzes
        </button>
      </div>
    );
  }

  // Mostra il componente che organizza i risultati del quiz
  if (isQuizComplete) {
    return (
      <QuizResults 
        userAnswers={userAnswers}
        quizDetails={quizDetails}
        onBack={onBack}
      />
    );
  }

  // Current Question Data
  const currentQuestion = quizDetails.quizQuestions.$values[currentQuestionIndex];

  return (
    <div className="quiz-view">
      <div className="quiz-view-header">
        <div id="header-new-quiz-div">
          <div className="navigation-controls">
            <span 
              className={`nav-link ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
              onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              Prev
            </span>
            <span 
              className={`nav-link ${currentQuestionIndex === quizDetails.quizQuestions.$values.length - 1 ? 'disabled' : ''}`}
              onClick={() => currentQuestionIndex < quizDetails.quizQuestions.$values.length - 1 && setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >
              Next
            </span>
          </div>
          <h1 id="HeaderNewQuiz">{truncateText(quiz.title)}</h1>
          <div className="Line-three"></div>
        </div>
        <p className='question-counter'>{currentQuestionIndex + 1} / {quizDetails.quizQuestions.$values.length}</p>
      </div>

      <div className="quiz-content">
        <div className="question-block">
          <div className='question-div'>
            <h3>{currentQuestion.question.text}</h3>
          </div>
          <div className="options-list">
            {currentQuestion.question.options.$values.map((option, optionIndex) => (
              <button
                key={optionIndex}
                className="option-button"
                onClick={() => handleAnswerSelect(optionIndex)}
                disabled={userAnswers[currentQuestionIndex] !== undefined}
              >
                <div className={getOptionClassName(currentQuestionIndex, optionIndex)}>
                  {option.text}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizView;

