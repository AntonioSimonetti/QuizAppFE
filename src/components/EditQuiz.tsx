import { useEffect, useState } from 'react';
import { Quiz } from '../interfaces/quiz';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateQuizBasicInfo, fetchQuizDetails, removeQuestionFromQuiz } from '../services/quizzes';
import { EditQuestion } from './EditQuestion';
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
        } catch (error) {
            console.error('Failed to update quiz:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleNext = () => {
        setCurrentStep('questions');
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
                                onClick={() => setEditingQuestion(questionData)}
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

                <button onClick={() => setCurrentStep('basic')} className="back-btn">
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
                    onClose={() => setEditingQuestion(null)}
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
