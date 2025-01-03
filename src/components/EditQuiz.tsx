import { useEffect, useState } from 'react';
import { Quiz } from '../interfaces/quiz';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateQuizBasicInfo, fetchQuizDetails, removeQuestionFromQuiz } from '../services/quizzes';
import { EditQuestion } from './EditQuestion';
import { setActiveSubComponent } from '../store/navigationSlice';
import '../styles/EditQuiz.css';

interface EditQuizProps {
    quiz: Quiz;
    onBack: () => void;
}

type EditStep = 'basic' | 'questions';

export const EditQuiz = ({ quiz, onBack }: EditQuizProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector((state: RootState) => state.authenticationSlice.token);
    const questions = useSelector((state: RootState) => state.quizzesSlice.data.questions);
    const options = useSelector((state: RootState) => state.quizzesSlice.data.options);
    
    const [currentStep, setCurrentStep] = useState<EditStep>('basic');
    const [title, setTitle] = useState(quiz.title);
    const [isPublic, setIsPublic] = useState(quiz.isPublic);
    const [isUpdating, setIsUpdating] = useState(false);
    const [quizDetails, setQuizDetails] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);
    const questionsPerPage = 5;
    
    useEffect(() => {
        const loadQuizDetails = async () => {
            if (currentStep === 'questions' && token) {
                try {
                    const details = await fetchQuizDetails(quiz.id, token);
                    setQuizDetails(details);
                } catch (error) {
                    console.error('Failed to fetch quiz details:', error);
                }
            }
        };

        loadQuizDetails();
    }, [currentStep, token, quiz.id]);
    
    // Mock data per test

    /*
    useEffect(() => {
        const mockQuizDetails = {
          id: quiz.id,
          title: quiz.title,
          isPublic: quiz.isPublic,
          quizQuestions: {
            $values: [
              {
                question: {
                  id: 1,
                  text: "What is JavaScript?",
                  correctAnswerIndex: 0,
                  points: 1,
                  negativePoints: 0,
                  userId: quiz.userId,
                  options: {
                    $values: [
                      { id: 1, text: "A programming language" },
                      { id: 2, text: "A markup language" },
                      { id: 3, text: "A database system" },
                      { id: 4, text: "An operating system" }
                    ]
                  }
                }
              },
              {
                question: {
                  id: 2,
                  text: "What is the typeof operator used for?",
                  correctAnswerIndex: 1,
                  points: 1,
                  negativePoints: 0,
                  userId: quiz.userId,
                  options: {
                    $values: [
                      { id: 5, text: "To check file type" },
                      { id: 6, text: "To determine variable type" },
                      { id: 7, text: "To create new types" },
                      { id: 8, text: "To convert types" }
                    ]
                  }
                }
              },
              {
                question: {
                  id: 3,
                  text: "What is closure in JavaScript?",
                  correctAnswerIndex: 2,
                  points: 1,
                  negativePoints: 0,
                  userId: quiz.userId,
                  options: {
                    $values: [
                      { id: 9, text: "A way to close browser" },
                      { id: 10, text: "A database connection" },
                      { id: 11, text: "A function with access to outer scope" },
                      { id: 12, text: "A way to end loops" }
                    ]
                  }
                }
              },
              {
                question: {
                  id: 4,
                  text: "What is the DOM?",
                  correctAnswerIndex: 1,
                  points: 1,
                  negativePoints: 0,
                  userId: quiz.userId,
                  options: {
                    $values: [
                      { id: 13, text: "Data Object Model" },
                      { id: 14, text: "Document Object Model" },
                      { id: 15, text: "Digital Ordinance Model" },
                      { id: 16, text: "Document Order Model" }
                    ]
                  }
                }
              },
              {
                question: {
                  id: 5,
                  text: "What is event bubbling?",
                  correctAnswerIndex: 1,
                  points: 1,
                  negativePoints: 0,
                  userId: quiz.userId,
                  options: {
                    $values: [
                      { id: 17, text: "A way to create events" },
                      { id: 18, text: "Event propagation from child to parent" },
                      { id: 19, text: "Creating multiple events" },
                      { id: 20, text: "Deleting events" }
                    ]
                  }
                }
              },
              {
                question: {
                  id: 6,
                  text: "What is a Promise?",
                  correctAnswerIndex: 2,
                  points: 1,
                  negativePoints: 0,
                  userId: quiz.userId,
                  options: {
                    $values: [
                      { id: 21, text: "A guarantee in code" },
                      { id: 22, text: "A type of function" },
                      { id: 23, text: "An object representing future completion" },
                      { id: 24, text: "A way to promise variables" }
                    ]
                  }
                }
              },
              {
                question: {
                  id: 7,
                  text: "What is async/await?",
                  correctAnswerIndex: 0,
                  points: 1,
                  negativePoints: 0,
                  userId: quiz.userId,
                  options: {
                    $values: [
                      { id: 25, text: "A way to handle promises" },
                      { id: 26, text: "A type of loop" },
                      { id: 27, text: "A variable declaration" },
                      { id: 28, text: "A math operation" }
                    ]
                  }
                }
              }
            ]
          }
        };
      
        setQuizDetails(mockQuizDetails);
      }, [quiz]);
    */
      
    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            await updateQuizBasicInfo(
                quiz.id,
                {
                    id: quiz.id,
                    title,
                    isPublic,
                    timelimit: 0,
                    userId: quiz.userId
                },
                token,
                dispatch
            );
            onBack();
        } catch (error) {
            console.error('Failed to update quiz:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleNext = () => {
        setCurrentStep('questions');
        dispatch(setActiveSubComponent('QuestionsList'));
    };

    const handleRemoveQuestion = async (questionId: number) => {
        try {
            await removeQuestionFromQuiz(quiz.id, questionId, token);
            const updatedDetails = await fetchQuizDetails(quiz.id, token);
            setQuizDetails(updatedDetails);
        } catch (error) {
            console.error('Failed to remove question:', error);
        }
    };

    const renderBasicInfo = () => (
        <div className="quiz-details">
            <h3>Quiz Information</h3>
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="isPublic">Public:</label>
                <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                />
            </div>
            <div className="form-buttons">
                <button onClick={onBack} className="back-btn">
                    Cancel
                </button>
                <button 
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="update-btn"
                >
                    {isUpdating ? 'Updating...' : 'Update Info'}
                </button>
                <button 
                    onClick={handleNext}
                    className="next-btn"
                >
                    Next
                </button>
            </div>
        </div>
    );

    const renderQuestionsList = () => {
        if (!quizDetails) {
            return <div>Loading questions...</div>;
        }

        const questions = quizDetails.quizQuestions.$values;
        const totalPages = Math.ceil(questions.length / questionsPerPage);
        const startIndex = (currentPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        const currentQuestions = questions.slice(startIndex, endIndex);

        return (
            <div className="questions-list">
                <h3>Select a Question to Edit</h3>
                {currentQuestions.map((questionData: any, index: number) => (
                    <div key={questionData.question.id} className="question-item">
                        <div className="question-preview">
                            <span className="question-number">Q{startIndex + index + 1}.</span>
                            <p className="question-text">{questionData.question.text}</p>
                        </div>
                        <div className="question-actions">
                            <button 
                                className="edit-btn"
                                onClick={() => {
                                    setEditingQuestion(questionData);
                                }}
                            >
                                Edit
                            </button>
                            <button 
                                className="remove-btn"
                                onClick={() => handleRemoveQuestion(questionData.question.id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                
                <div className="pagination-controls">
                    <button 
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
                <button onClick={() => {
                    setCurrentStep('basic');
                    dispatch(setActiveSubComponent(null));
                }} className="back-btn">
                    Back to Basic Info
                </button>
            </div>
        );
    };

    return (
        <>
            {editingQuestion ? (
                <EditQuestion
                    questionData={editingQuestion}
                    userId={quiz.userId}
                    token={token}
                    onClose={() => {
                        setEditingQuestion(null);
                    }}                    
                    onUpdate={async () => {
                        const updatedDetails = await fetchQuizDetails(quiz.id, token);
                        setQuizDetails(updatedDetails);
                        setEditingQuestion(null);
                    }}
                />
            ) : (
                <div className="edit-quiz-container">
                    <div className="edit-quiz-header">
                        <h2>Edit Quiz</h2>
                    </div>
                    {currentStep === 'basic' ? renderBasicInfo() : renderQuestionsList()}
                </div>
            )}
        </>
    );
};

export default EditQuiz;
