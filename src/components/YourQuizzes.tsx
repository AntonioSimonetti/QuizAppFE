import React, { useState, useEffect } from "react";
import "../styles/YourQuizzes.css";
import removeIcon from "../assets/remove-icon.svg";
import editIcon from "../assets/edit-icon.svg";
import homeBtnIcon from "../assets/house-btn-icon.svg";
import { Quiz } from '../interfaces/quiz';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { fetchQuizzesByUserId, createQuiz, deleteQuizById, CreateQuizPayload } from "../services/quizzes";


const YourQuizzes = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const quizzesPerPage = 5;

  // Selettori per Redux
  const token = useSelector((state: RootState) => {console.log('Auth State:', state.authenticationSlice); return state.authenticationSlice.token;});
  const userId = useSelector((state: RootState) => state.authenticationSlice.userId);
  const quizzes = useSelector((state: RootState) => {console.log('Quizzes from state:', state.quizzesSlice.data.quizzes); return state.quizzesSlice.data.quizzes;}); 
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

const handleCreateQuiz = async () => {
  try {
    if (!token) {
      console.error('No token available');
      return;
    }

    const newQuiz: CreateQuizPayload = {
      id: 0, //viene poi sovrascritto assegnado all'entità un id univoco
      title: "New Quiz" + Math.random(), //placeholder di test
      isPublic: true,
      timelimit: 0,
      userId: userId
    };

    await createQuiz(userId, newQuiz, token, dispatch);
  } catch (error) {
    console.error('Failed to create quiz:', error);
  }
};

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

//Animazione durante la cancellazione
const blinkAnimation = {
  animation: 'blink 0.5s linear infinite',
  WebkitAnimation: 'blink 0.5s linear infinite'
};


return (
  <div className="main-div">
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
    
    <div className="create-quiz-btn" onClick={handleCreateQuiz}>
      <img src={homeBtnIcon} className="icon" alt="icon inside button"/>
      <p>Create new quiz</p>
    </div>  
  </div>
)
}

export default YourQuizzes;
