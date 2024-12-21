import { useEffect, useState } from 'react';
import { QuizViewProps, QuizDetails } from '../interfaces/quiz';
import '../styles/QuizView.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchQuizDetails } from '../services/quizzes';
import QuizResults from './QuizResults';

const QuizView = ({ quiz, onBack }: QuizViewProps) => {
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const token = useSelector((state: RootState) => state.authenticationSlice.token);

  useEffect(() => {
    const loadQuizDetails = async () => {
      const details = await fetchQuizDetails(quiz.id, token);
      setQuizDetails(details);
    };

    loadQuizDetails();
  }, [quiz.id, token]);

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

    setTimeout(() => {
      if (unansweredIndex !== -1) {
        setCurrentQuestionIndex(unansweredIndex);
      } else {
        setIsQuizComplete(true);
      }
    }, 2000);
  };

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

  const truncateText = (text: string, maxLength: number = 17): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  if (!quizDetails) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

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

  if (isQuizComplete) {
    return (
      <QuizResults 
        userAnswers={userAnswers}
        quizDetails={quizDetails}
        onBack={onBack}
      />
    );
  }

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

