import { useEffect, useState } from 'react';
import { Quiz, Question, Option } from '../interfaces/quiz';
import '../styles/QuizView.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchQuizDetails } from '../services/quizzes';
import Navbar from '../components/Navbar';


interface QuizViewProps {
  quiz: Quiz;
  onBack: () => void;
}

const QuizView = ({ quiz, onBack }: QuizViewProps) => {
    const [quizDetails, setQuizDetails] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const token = useSelector((state: RootState) => state.authenticationSlice.token);
  
    useEffect(() => {
      const loadQuizDetails = async () => {
        try {
          const details = await fetchQuizDetails(quiz.id, token);
          setQuizDetails(details);
        } catch (error) {
          console.error('Error loading quiz details:', error);
        }
      };
  
      loadQuizDetails();
    }, [quiz.id, token]);

    const handleAnswerSelect = (optionIndex: number) => {
        if (userAnswers[currentQuestionIndex] !== undefined) {
            return;
        }
    
        const updatedAnswers = {
            ...userAnswers,
            [currentQuestionIndex]: optionIndex
        };
        setUserAnswers(updatedAnswers);
    
        const totalQuestions = quizDetails.quizQuestions.$values.length;
    
        const unansweredIndex = Object.keys(updatedAnswers).length < totalQuestions
            ? quizDetails.quizQuestions.$values.findIndex((_: unknown, i: number) => updatedAnswers[i] === undefined)
            : -1;
    
        setTimeout(() => {
            if (unansweredIndex !== -1) {
                setCurrentQuestionIndex(unansweredIndex);
            } else {
                setIsQuizComplete(true);
            }
        }, 2000);
    };
    

    const getOptionClassName = (questionIndex: number, optionIndex: number) => {
        if (userAnswers[questionIndex] === undefined) return "option-div";
        
        const correctAnswer = quizDetails.quizQuestions.$values[questionIndex].question.correctAnswerIndex;
        
        if (userAnswers[questionIndex] === optionIndex) {
            return optionIndex === correctAnswer ? "option-div correct" : "option-div incorrect";
        }
        
        return "option-div";
    };
  
      if (!quizDetails) return <div>Loading quiz...</div>;

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
          <div className="quiz-complete">
            <h2>Quiz Complete!</h2>
            <button onClick={onBack} className="back-button">
              Return to Your Quizzes
            </button>
          </div>
        );
      }
      
    const currentQuestion = quizDetails.quizQuestions.$values[currentQuestionIndex];

    const truncateText = (text: string, maxLength: number = 17) => {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };  
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
                        {currentQuestion.question.options.$values.map((option: any, optionIndex: number) => (
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

