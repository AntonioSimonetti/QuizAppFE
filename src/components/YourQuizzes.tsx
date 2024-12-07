import React, { useState } from "react";
import "../styles/YourQuizzes.css";
import removeIcon from "../assets/remove-icon.svg";
import editIcon from "../assets/edit-icon.svg";
import homeBtnIcon from "../assets/house-btn-icon.svg";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { fetchQuizzesByUserId } from "../services/quizzes";


const YourQuizzes = () => {
  // Lista finta di quiz
  const fakeQuizzes = Array.from({ length: 20 }, (_, i) => `Quiz ${i + 1}`);

  

  const [currentPage, setCurrentPage] = useState(0);
  //const [quizzes, setQuizzes] = useState<any[]>([]); // Usa un tipo generico per i quiz per ora
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState();
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.authenticationSlice.token); // Recupera il token dallo stato di autenticazione
  const userId = useSelector((state: RootState) => state.authenticationSlice.userId);

  const quizzesPerPage = 5;

  const startIndex = currentPage * quizzesPerPage;
  const endIndex = startIndex + quizzesPerPage;
  const quizzesToShow = fakeQuizzes.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < fakeQuizzes.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (startIndex > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFetchQuizzes = async () => {
    if (!token) {
      setError("No token available");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      console.log("Token being sent: ", token);
      console.log("userId being sent: ", userId);

      const response = await fetchQuizzesByUserId(userId, token);
      setQuizzes(response);
    } catch (err) {
      setError("Failed to fetch quizzes: ");
    } finally {
      setLoading(false);
    }
  };

 
  

  return (
    <div className="main-div">
      <div id="your-quizzes-top-div">
        <h1>Your Quizzes</h1>
        <div className="Line-two"></div>
      </div>
      <div id="quizzes-container">
        {quizzesToShow.map((quiz, index) => (
          <div className="single-quiz-container" key={index}>
            <div className="single-quiz-para"><p>{quiz}</p></div>
            <div className="remove-icon">
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
        <button onClick={nextPage} disabled={endIndex >= fakeQuizzes.length}>
            &gt;
        </button>
        <button onClick={handleFetchQuizzes} disabled={loading}>
        "logga"
        </button>
      </div>
      <div className="create-quiz-btn">
          <img src={homeBtnIcon} className="icon" alt="icon inside button"/>
          <p>Create new quiz</p>
      </div>  
    </div>
  );
};

export default YourQuizzes;
