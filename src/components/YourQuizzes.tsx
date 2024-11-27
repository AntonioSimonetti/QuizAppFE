import "../styles/YourQuizzes.css";


const YourQuizzes = ({ goBack }: { goBack: () => void }) => {
    return (
      <div className="main-div">
        <h1>Your Quizzes</h1>
        <button onClick={goBack}>Back to Homepage</button>
      </div>
    );
  };
  
  export default YourQuizzes;