import React, { useState } from "react";
import "../styles/YourQuizzes.css";
import removeIcon from "../assets/remove-icon.svg";
import editIcon from "../assets/edit-icon.svg";
import homeBtnIcon from "../assets/house-btn-icon.svg";

const YourQuizzes = ({ goBack }: { goBack: () => void }) => {
  // Lista finta di quiz
  const fakeQuizzes = Array.from({ length: 20 }, (_, i) => `Quiz ${i + 1}`);

  // Stato per la pagina corrente
  const [currentPage, setCurrentPage] = useState(0);

  // Numero di quiz per pagina
  const quizzesPerPage = 5;

  // Calcola i quiz da mostrare nella pagina corrente
  const startIndex = currentPage * quizzesPerPage;
  const endIndex = startIndex + quizzesPerPage;
  const quizzesToShow = fakeQuizzes.slice(startIndex, endIndex);

  // Funzioni per navigare tra le pagine
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

  return (
    <div className="main-div">
      <div id="your-quizzes-top-div">
        <h1>Your Quizzes</h1>
        <div className="Line-two"></div>
      </div>
      <div id="quizzes-container">
        {/* Mostra i quiz correnti */}
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
      </div>
      <div className="create-quiz-btn">
          <img src={homeBtnIcon} className="icon" alt="icon inside button"/>
          <p>Create new quiz</p>
      </div>
     {/* <button onClick={goBack}>Back to Homepage</button>*/}
  
    </div>
  );
};

export default YourQuizzes;
