// React and core dependencies
import React, { useState, useEffect } from "react";

// Styles
import "../styles/YourQuizzes.css";
import { blinkAnimation } from '../styles/Animations';

// Assets
import removeIcon from "../assets/remove-icon.svg";
import editIcon from "../assets/edit-icon.svg";
import homeBtnIcon from "../assets/house-btn-icon.svg";

// Components
import { QuestionForm } from './QuestionForm';
import { TitleForm } from "./TitleForm";
import QuizView from './QuizView';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";

// Services and Utils
import { fetchQuizzesByUserId, deleteQuizById, createCompleteQuiz } from "../services/quizzes";
import truncateTitle from "../utils/helpers";

// Types and Interfaces
import { Quiz, LocalQuizState, initialQuizState } from '../interfaces/quiz'; 

// Custom Hooks
import { useQuizValidation } from "../hooks/useQuizValidation";
import { useQuizPagination } from "../hooks/useQuizPagination";

const YourQuizzes = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Stati locali
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null); // stato per gestire il quiz selezionato da visualizzare
  const [deletingQuizId, setDeletingQuizId] = useState<number | null>(null); // stato locale per gestire il quiz da eliminare
  const [showModal, setShowModal] = useState(false);   // stato per mostrare il modale
  const [currentStep, setCurrentStep] = useState<'title' | 'questions'>('title'); // stato per renderizzare il componente giusto nel modale
  const [localQuizState, setLocalQuizState] = useState<LocalQuizState>(initialQuizState); // stato per salvare localmente il quiz creato dall'utente
  const [currentQuestion, setCurrentQuestion] = useState({ text: '',options: ['', '', '', ''], correctOption: -1}); // stato per salvare la domanda corrente create dall'user
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);


  // Selettori per lo stato globale
  const token = useSelector((state: RootState) => { return state.authenticationSlice.token;});
  const userId = useSelector((state: RootState) => state.authenticationSlice.userId);
  const quizzes = useSelector((state: RootState) => { return state.quizzesSlice.data.quizzes;}); 
  const status = useSelector((state: RootState) => state.quizzesSlice.status);
  const error = useSelector((state: RootState) => state.quizzesSlice.error);

  // Custom Hooks
  const { validationError, validateInputs } = useQuizValidation(); // hook per la validazione
  const QUIZZES_PER_PAGE = 5; // variabile per l'hook di paginazione
  const { quizzesToShow, nextPage, previousPage, hasNextPage, hasPreviousPage } = useQuizPagination(quizzes, QUIZZES_PER_PAGE); // hook per la paginazione

  // Recupera i quiz dell'utente al mount del componente o quando cambiano i dati di autenticazione
  // Evita chiamate API se mancano i dati di autenticazione
  useEffect(() => {
    if (!token || !userId) {
      return;
    }
  
    fetchQuizzesByUserId(userId, token, dispatch);
  }, [token, userId, dispatch]);
  
  // ----  FUNZIONI ---- //

  // Fn per cancellare un quiz
  const handleDelete = async (quizId: number) => {
    try {
      setDeletingQuizId(quizId);
      await deleteQuizById(userId,quizId, token, dispatch);
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    } finally {
      setDeletingQuizId(null);
    }
  }

  // Fn toggle del modale
  const toggleModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      setCurrentStep('title');
      setCurrentQuestion({
        text: '',
        options: ['', '', '', ''],
        correctOption: -1
      });
    }
  };

  // Fn per mostrare cambiare il componente da renderizzare nel modale
  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuiz = localQuizState.quizzes[localQuizState.currentQuizId];
    if (currentQuiz?.title.trim()) {
      setCurrentStep('questions');
    }
  };

  // Aggiorna lo stato locale con il contenuto del titolo mentre l'utente scrive nell'input del titolo
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuizState(prev => ({
      ...prev,
      quizzes: {
        ...prev.quizzes,
        [prev.currentQuizId]: {
          title: e.target.value,
          questions: {}
        }
      }
    }));
  };

  // Aggiunge la domanda con le opzioni associate allo stato locale che sarà poi usato dalla API
  const addQuestionToLocalState = () => {
    if (!validateInputs(currentQuestion)) {
        return;
    }
    const currentQuiz = localQuizState.quizzes[localQuizState.currentQuizId];
    const questionId = Object.keys(currentQuiz?.questions || {}).length;
    
    const newQuestion = {
      text: currentQuestion.text,
      options: currentQuestion.options.reduce((acc, text, index) => {
        acc[index] = {
          text,
          isCorrect: index === currentQuestion.correctOption
        };
        return acc;
      }, {} as Record<number, { text: string; isCorrect: boolean }>)
    };

    setLocalQuizState(prev => ({
      ...prev,
      quizzes: {
        ...prev.quizzes,
        [prev.currentQuizId]: {
          ...prev.quizzes[prev.currentQuizId],
          questions: {
            ...prev.quizzes[prev.currentQuizId].questions,
            [questionId]: newQuestion
          }
        }
      }
    }));

    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctOption: -1
    });
  };

  // Gestisce la creazione dello stato locale con dei controlli e la chiamata finale per la creazione del quiz con le domande associate
  const handleFinishQuiz = async () => {
    if (!validateInputs(currentQuestion)) {
          return;
    }
    const isFormFilled = currentQuestion.text && 
      !currentQuestion.options.some(opt => !opt) && 
      currentQuestion.correctOption !== -1;

    if (isFormFilled) {
      addQuestionToLocalState();
    }
    setIsCreatingQuiz(true);
    try {
      await dispatch(createCompleteQuiz({
        quizData: localQuizState,
        token,
        userId
      })).unwrap();

      // Dopo una creazione con successo, aggiorna la lista dei quiz
      await fetchQuizzesByUserId(userId, token, dispatch);
      
      // Resetta lo stato del form
      setLocalQuizState(prev => ({
        ...prev,
        currentQuizId: prev.currentQuizId + 1
      }));
      setCurrentQuestion({
        text: '',
        options: ['', '', '', ''],
        correctOption: -1
      });
      setCurrentStep('title');
      toggleModal();
    } catch (error) {
      console.error('Failed to create quiz:', error);
      // Aggiungere un errore da mostrare all'utente
    } finally {
      setIsCreatingQuiz(false);
  }
  };

  // Fn che seleziona il quiz da mostrare in QuizView
  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };



return (
<div className={`main-div ${!selectedQuiz ? 'active-component' : ''}`}>
{isCreatingQuiz && (
      <>
        <div className="creating-quiz-line"></div>
        <div className="creating-quiz-text">Creating Quiz...</div>
      </>
    )}
    {!isCreatingQuiz && (
      <>
        {showModal ? (
          <div className="modal-overlay">
            <div className="modal-content">
              {validationError && <p className="validation-error">{validationError}</p>}
              {currentStep === 'title' ? ( 
                <TitleForm 
                  title={localQuizState.quizzes[localQuizState.currentQuizId]?.title || ''}
                  onTitleChange={handleTitleChange}
                  onSubmit={handleTitleSubmit}
                  onCancel={toggleModal}
                /> ) : (
                <QuestionForm 
                  currentQuestion={currentQuestion}
                  onQuestionChange={setCurrentQuestion}
                  onAddQuestion={addQuestionToLocalState}
                  onFinishQuiz={handleFinishQuiz}
                  onCancel={toggleModal}
                />
              )}
            </div>
          </div>
        ) : selectedQuiz ? (
          <QuizView 
            quiz={selectedQuiz} 
            onBack={() => setSelectedQuiz(null)} 
          />
        ) : (
          <>
            <div id="your-quizzes-top-div">
              <h1>Your Quizzes</h1>
              <div className="Line-two"></div>
            </div>
            
            {status === 'loading' && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            
            <div id="quizzes-container">
              {quizzesToShow.map((quiz: Quiz) => (
                <div 
                  className="single-quiz-container" 
                  key={quiz.id}
                  onClick={() => handleQuizClick(quiz)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="single-quiz-para">
                    <p title={quiz.title}>{truncateTitle(quiz.title)}</p>
                  </div>
                  <div className="remove-icon" onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(quiz.id);
                  }}
                    style={deletingQuizId === quiz.id ? blinkAnimation : {}}
                  >
                    <img src={removeIcon} className="icon" alt="remove icon" />
                  </div>
                  <div className="edit-icon">
                    <img src={editIcon} className="icon" alt="edit icon" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination-buttons">
              <button onClick={previousPage} disabled={!hasPreviousPage}>
                &lt;
              </button>
              <button onClick={nextPage} disabled={!hasNextPage}>
                &gt;
              </button>
            </div>

            <div className="create-quiz-btn" onClick={toggleModal}>
              <img src={homeBtnIcon} className="icon" alt="icon inside button"/>
              <p>Create new quiz</p>
            </div>
          </>
        )}
      </>
    )}
  </div>
);
}


export default YourQuizzes;