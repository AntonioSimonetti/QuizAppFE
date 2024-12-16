import React, { useState, useEffect } from "react";
import "../styles/YourQuizzes.css";
import removeIcon from "../assets/remove-icon.svg";
import editIcon from "../assets/edit-icon.svg";
import homeBtnIcon from "../assets/house-btn-icon.svg";
import { Quiz } from '../interfaces/quiz';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { fetchQuizzesByUserId, deleteQuizById, createCompleteQuiz } from "../services/quizzes";
import { LocalQuizState, initialQuizState } from '../interfaces/quiz'; 
import { AppDispatch } from '../store/store';

// pulire questo componente 

const YourQuizzes = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const quizzesPerPage = 5;
  const dispatch = useDispatch<AppDispatch>();


  // Selettori per Redux
  const token = useSelector((state: RootState) => { return state.authenticationSlice.token;});
  const userId = useSelector((state: RootState) => state.authenticationSlice.userId);
  const quizzes = useSelector((state: RootState) => { return state.quizzesSlice.data.quizzes;}); 
  const status = useSelector((state: RootState) => state.quizzesSlice.status);
  const error = useSelector((state: RootState) => state.quizzesSlice.error);

  useEffect(() => {
    if (!token || !userId) {
      console.log('Missing token or userId:', { token, userId });
      return;
    }
  
    console.log('Fetching with:', { token, userId });
    fetchQuizzesByUserId(userId, token, dispatch);
  }, [token, userId, dispatch]);
  
// Variabili e fn per l'algo di impaginazione
const startIndex = currentPage * quizzesPerPage;
const endIndex = startIndex + quizzesPerPage;
const quizzesToShow = quizzes.slice(startIndex, endIndex);

const nextPage = () => {
  if (endIndex < quizzes.length) {
    setCurrentPage(currentPage + 1);
  }
};

const previousPage = () => {
  if (startIndex > 0) {
    setCurrentPage(currentPage - 1);
  }
};

const truncateTitle = (title: string, maxLength: number = 20) => {
  return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};

// Cancella quiz
const [deletingQuizId, setDeletingQuizId] = useState<number | null>(null);

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

// Animazione durante la cancellazione
const blinkAnimation = {
  animation: 'blink 0.5s linear infinite',
  WebkitAnimation: 'blink 0.5s linear infinite'
};


// Stato locale per il modale di creazione e lo stato per fare la creazione del Quiz
const [showModal, setShowModal] = useState(false);
const [currentStep, setCurrentStep] = useState<'title' | 'questions'>('title');
const [localQuizState, setLocalQuizState] = useState<LocalQuizState>(initialQuizState);

const [currentQuestion, setCurrentQuestion] = useState({
  text: '',
  options: ['', '', '', ''],
  correctOption: -1
});

// Toggle del modale
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

// Passa dal form del titolo a quello delle questions
const handleTitleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const currentQuiz = localQuizState.quizzes[localQuizState.currentQuizId];
  if (currentQuiz?.title.trim()) {
    setCurrentStep('questions');
  }
};

// Aggiorna lo stato locale con il contenuto del titolo mentre l'utente scrive nel form
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
  const isFormFilled = currentQuestion.text && 
    !currentQuestion.options.some(opt => !opt) && 
    currentQuestion.correctOption !== -1;

  if (isFormFilled) {
    addQuestionToLocalState();
  }

  try {
    await dispatch(createCompleteQuiz({
      quizData: localQuizState,
      token,
      userId
    })).unwrap();

    // After successful creation, refresh the quizzes list
    await fetchQuizzesByUserId(userId, token, dispatch);
    
    // Reset form state
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
  }
};

// Funzione per renderizzare il form di creazione del quiz
const renderTitleForm = () => (
  <form onSubmit={handleTitleSubmit} className="quiz-form">
    <h2 id="HeaderNewQuiz">New Quiz</h2>
    <div className="form-group">
      <label htmlFor="quizTitle" id="labelId">Title:</label>
      <input
        type="text"
        id="quizTitle"
        value={localQuizState.quizzes[localQuizState.currentQuizId]?.title || ''}
        onChange={handleTitleChange}
        placeholder="Enter quiz title"
        required
      />
    </div>
    <div className="form-buttons">
      <button type="button" onClick={toggleModal}>Cancel</button>
      <button type="submit">Next</button>
    </div>
  </form>
);

// Funzione per renderizzare il form di creazione delle domande e opzioni
const renderQuestionsForm = () => (
  <div className="questions-form">
    <h2>Add Questions</h2>
    <p>Current Quiz: {localQuizState.quizzes[localQuizState.currentQuizId]?.title}</p>
    
    <div className="form-group">
      <label htmlFor="questionText">Question:</label>
      <input
        type="text"
        id="questionText"
        value={currentQuestion.text}
        onChange={(e) => setCurrentQuestion(prev => ({
          ...prev,
          text: e.target.value
        }))}
        placeholder="Enter your question"
      />
    </div>

    {currentQuestion.options.map((option, index) => (
      <div key={index} className="option-group">
        <label htmlFor={`option${index}`}>Option {index + 1}:</label>
        <div className="option-input-group">
          <input
            type="text"
            id={`option${index}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...currentQuestion.options];
              newOptions[index] = e.target.value;
              setCurrentQuestion(prev => ({
                ...prev,
                options: newOptions
              }));
            }}
            placeholder={`Enter option ${index + 1}`}
          />
          <input
            type="radio"
            name="correctOption"
            id="radioBtn"
            checked={currentQuestion.correctOption === index}
            onChange={() => setCurrentQuestion(prev => ({
              ...prev,
              correctOption: index
            }))}
          />
        </div>
      </div>
    ))}

    <div className="form-buttons">
      <button type="button" className="back-btn" onClick={() => setCurrentStep('title')}>Back</button>
      <button type="button" className="cancel-btn" onClick={toggleModal}>Cancel</button>
      <button 
        type="button" 
        onClick={addQuestionToLocalState}
        className="add-question-btn"
        disabled={!currentQuestion.text || currentQuestion.options.some(opt => !opt) || currentQuestion.correctOption === -1}
      >
        Add Another Question
      </button>
      <button 
        type="button" 
        onClick={handleFinishQuiz}
        className="finish-btn"
        //disabled={!Object.keys(localQuizState.quiz.questions).length} //forse qualche controllo dovrò metterlo qui
        >
        Finish Quiz
      </button>
    </div>
  </div>
);


return (
  <div className="main-div">
    {!showModal ? (
    <>
    <div id="your-quizzes-top-div">
      <h1>Your Quizzes</h1>
      <div className="Line-two"></div>
    </div>
    
    {status === 'loading' && <div>Loading...</div>}
    {error && <div>Error: {error}</div>}
    
    <div id="quizzes-container">
      {quizzesToShow.map((quiz: Quiz) => (
        <div className="single-quiz-container" key={quiz.id}>
          <div className="single-quiz-para">
            <p title={quiz.title}>{truncateTitle(quiz.title)}</p>
          </div>
          <div className="remove-icon" onClick={() => handleDelete(quiz.id)}
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
      <button onClick={previousPage} disabled={currentPage === 0}>
        &lt;
      </button>
      <button onClick={nextPage} disabled={endIndex >= quizzes.length}>
        &gt;
      </button>
    </div>
  
    <div className="create-quiz-btn" onClick={toggleModal}>
      <img src={homeBtnIcon} className="icon" alt="icon inside button"/>
      <p>Create new quiz</p>
    </div>  
   
    </> 

    ) : (  

      <div className="modal-overlay">
        <div className="modal-content">
        {currentStep === 'title' ? renderTitleForm() : renderQuestionsForm()}
      </div>
    </div>
    )}
  </div>
  )
}

export default YourQuizzes;
