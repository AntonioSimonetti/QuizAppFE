import "../styles/PublicQuizzes.css";

const PublicQuizzes = ({ goBack }: { goBack: () => void }) => {
    return (
      <div className="main-div">
        <h1>Public Quizzes</h1>
        <button onClick={goBack}>Back to Homepage</button>
      </div>
    );
  };
  
  export default PublicQuizzes;
  