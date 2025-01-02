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
import { EditQuiz } from "./EditQuiz";

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
  const [isEditing, setIsEditing] = useState<boolean>(false);



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

  // Mock di dati provvisorio per test
  /*
  useEffect(() => {
    const mockQuizzes = [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        isPublic: true,
        timeLimit: "00:30:00",
        userId: "test-123",
        questions: [
          {
            id: 1,
            text: "What is JavaScript?",
            options: [
              { id: 1, text: "A programming language", isCorrect: true },
              { id: 2, text: "A markup language", isCorrect: false },
              { id: 3, text: "A database system", isCorrect: false },
              { id: 4, text: "An operating system", isCorrect: false }
            ]
          },
          {
            id: 2,
            text: "What is the typeof operator used for?",
            options: [
              { id: 1, text: "To check file type", isCorrect: false },
              { id: 2, text: "To determine variable type", isCorrect: true },
              { id: 3, text: "To create new types", isCorrect: false },
              { id: 4, text: "To convert types", isCorrect: false }
            ]
          },
          {
            id: 3,
            text: "What is closure in JavaScript?",
            options: [
              { id: 1, text: "A way to close browser", isCorrect: false },
              { id: 2, text: "A database connection", isCorrect: false },
              { id: 3, text: "A function with access to outer scope", isCorrect: true },
              { id: 4, text: "A way to end loops", isCorrect: false }
            ]
          },
          {
            id: 4,
            text: "What is the DOM?",
            options: [
              { id: 1, text: "Data Object Model", isCorrect: false },
              { id: 2, text: "Document Object Model", isCorrect: true },
              { id: 3, text: "Digital Ordinance Model", isCorrect: false },
              { id: 4, text: "Document Order Model", isCorrect: false }
            ]
          },
          {
            id: 5,
            text: "What is event bubbling?",
            options: [
              { id: 1, text: "A way to create events", isCorrect: false },
              { id: 2, text: "Event propagation from child to parent", isCorrect: true },
              { id: 3, text: "Creating multiple events", isCorrect: false },
              { id: 4, text: "Deleting events", isCorrect: false }
            ]
          },
          {
            id: 6,
            text: "What is a Promise?",
            options: [
              { id: 1, text: "A guarantee in code", isCorrect: false },
              { id: 2, text: "A type of function", isCorrect: false },
              { id: 3, text: "An object representing future completion", isCorrect: true },
              { id: 4, text: "A way to promise variables", isCorrect: false }
            ]
          },
          {
            id: 7,
            text: "What is async/await?",
            options: [
              { id: 1, text: "A way to handle promises", isCorrect: true },
              { id: 2, text: "A type of loop", isCorrect: false },
              { id: 3, text: "A variable declaration", isCorrect: false },
              { id: 4, text: "A math operation", isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "React Fundamentals",
        isPublic: false,
        timeLimit: "00:15:00",
        userId: "test-123",
        questions: [
          {
            id: 1,
            text: "What is React?",
            options: [
              { id: 1, text: "A JavaScript library", isCorrect: true },
              { id: 2, text: "A database", isCorrect: false },
              { id: 3, text: "A programming language", isCorrect: false },
              { id: 4, text: "An operating system", isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "TypeScript Advanced Concepts",
        isPublic: true,
        timeLimit: "01:00:00",
        userId: "test-123",
        questions: [
          {
            id: 1,
            text: "What are Generics?",
            options: [
              { id: 1, text: "Type-safe containers", isCorrect: true },
              { id: 2, text: "General variables", isCorrect: false },
              { id: 3, text: "Global functions", isCorrect: false },
              { id: 4, text: "Generic names", isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 4,
        title: "Redux State Management",
        isPublic: true,
        timeLimit: "00:45:00",
        userId: "test-123",
        questions: [
          {
            id: 1,
            text: "What is Redux?",
            options: [
              { id: 1, text: "State management library", isCorrect: true },
              { id: 2, text: "Database", isCorrect: false },
              { id: 3, text: "Framework", isCorrect: false },
              { id: 4, text: "Programming language", isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 5,
        title: "Node.js Basics",
        isPublic: false,
        timeLimit: "00:20:00",
        userId: "test-123",
        questions: [
          {
            id: 1,
            text: "What is Node.js?",
            options: [
              { id: 1, text: "JavaScript runtime", isCorrect: true },
              { id: 2, text: "Web browser", isCorrect: false },
              { id: 3, text: "Programming language", isCorrect: false },
              { id: 4, text: "Database system", isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 6,
        title: "Git Version Control",
        isPublic: true,
        timeLimit: "00:35:00",
        userId: "test-123",
        questions: [
          {
            id: 1,
            text: "What is Git?",
            options: [
              { id: 1, text: "Version control system", isCorrect: true },
              { id: 2, text: "Programming language", isCorrect: false },
              { id: 3, text: "Database", isCorrect: false },
              { id: 4, text: "Web framework", isCorrect: false }
            ]
          }
        ]
      },
      {
        id: 7,
        title: "CSS Advanced Styling",
        isPublic: true,
        timeLimit: "00:25:00",
        userId: "test-123",
        questions: [
          {
            id: 1,
            text: "What is Flexbox?",
            options: [
              { id: 1, text: "Layout model", isCorrect: true },
              { id: 2, text: "JavaScript library", isCorrect: false },
              { id: 3, text: "HTML element", isCorrect: false },
              { id: 4, text: "CSS preprocessor", isCorrect: false }
            ]
          }
        ]
      }
    ];
  
    dispatch({ 
      type: 'quizzes/setQuizzes',
      payload: mockQuizzes
    });
  }, [dispatch]);
  */
  
  // ----  FUNZIONI ---- //

  // Fn per cancellare un quiz
  const handleDelete = async (quizId: number) => {
    try {
      setDeletingQuizId(quizId);

      await new Promise(resolve => setTimeout(resolve, 1000));
      await deleteQuizById(userId, quizId, token, dispatch);
      
      // If the deleted quiz was selected, clear the selection
      if (selectedQuiz?.id === quizId) {
        setSelectedQuiz(null);
      }
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
          isPublic: prev.quizzes[prev.currentQuizId]?.isPublic || false,
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

  const toggleIsPublic = () => { // forse la cancello e lascio cosi la gestione del cambio ispublic nella creazione
    setLocalQuizState(prev => ({
      ...prev,
      quizzes: {
        ...prev.quizzes,
        [prev.currentQuizId]: {
          ...prev.quizzes[prev.currentQuizId],
          isPublic: !prev.quizzes[prev.currentQuizId]?.isPublic 
        }
      }
    }));
  };

  const handleEdit = (quiz: Quiz, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuiz(quiz);
    setIsEditing(true);
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
                  isPublic={localQuizState.quizzes[localQuizState.currentQuizId]?.isPublic || false}
                  onTogglePublic={(isPublic) => {
                    setLocalQuizState(prev => ({
                      ...prev,
                      quizzes: {
                        ...prev.quizzes,
                        [prev.currentQuizId]: {
                          ...prev.quizzes[prev.currentQuizId],
                          isPublic
                        }
                      }
                    }));
                  }}
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
        ) : isEditing && selectedQuiz ? (
          <EditQuiz 
              quiz={selectedQuiz}
              onBack={() => {
                  setIsEditing(false);
                  setSelectedQuiz(null);
              }}
          />
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
            
            {status === 'loading' && <div className="loading-your-quizzes">Loading...</div>}
            {error && <div>Error: {error}</div>}
            
            <div id="quizzes-container">
              {quizzesToShow.length === 0 ? (
                <div className="no-quizzes-message">
                  No quiz found, create your first quiz!
                </div>
              ) : (
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
                    <div className="remove-icon" onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(quiz.id);
                    }}
                      style={deletingQuizId === quiz.id ? blinkAnimation : {}}
                    >
                      <img src={removeIcon} className="icon" alt="remove icon" />
                    </div>
                    <div className="edit-icon" onClick={(e) => handleEdit(quiz, e)}>
                        <img src={editIcon} className="icon" alt="edit icon" />
                    </div>
                  </div>
                ))
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