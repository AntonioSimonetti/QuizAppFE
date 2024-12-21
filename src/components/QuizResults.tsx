import { useEffect, useState } from 'react';
import { QuizResultsProps } from '../interfaces/quiz';
import '../styles/QuizResults.css';

const QuizResults = ({ userAnswers, quizDetails, onBack }: QuizResultsProps) => {
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const wrong: number[] = [];
    let correctCount = 0;

    Object.entries(userAnswers).forEach(([questionIndex, userAnswer]) => {
      const correctAnswer = quizDetails.quizQuestions.$values[Number(questionIndex)].question.correctAnswerIndex;
      
      if (userAnswer !== correctAnswer) {
        wrong.push(Number(questionIndex) + 1);
      } else {
        correctCount++;
      }
    });

    setIncorrectAnswers(wrong);
    setScore(correctCount);
  }, [userAnswers, quizDetails]);

  return (
    <div className="quiz-results">      
      <div className="results-summary">
        <div className="score-card">
          <h3>Your Score</h3>
          <p className="score">
            {score} / {quizDetails.quizQuestions.$values.length}
          </p>
          <p className="percentage">
            ({Math.round((score / quizDetails.quizQuestions.$values.length) * 100)}%)
          </p>
        </div>

        <div className="errors-summary">
          <h3>Errors: {incorrectAnswers.length}</h3>
          {incorrectAnswers.length > 0 ? (
            <p>Wrong answers in questions: {incorrectAnswers.join(', ')}</p>
          ) : (
            <p className="perfect-score">Perfect Score! 🎉</p>
          )}
        </div>
      </div>

      <button onClick={onBack} className="back-button">
        Return to Your Quizzes
      </button>
    </div>
  );
};

export default QuizResults;
