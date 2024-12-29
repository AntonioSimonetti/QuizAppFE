import { useState } from 'react';
import QuestionFormProps from "../interfaces/quiz"; 
import { validateQuestionForm } from "../utils/helpers";
import '../styles/QuestionForm.css';

export const QuestionForm = ({
    currentQuestion,
    onQuestionChange,
    onAddQuestion,
    onFinishQuiz,
    onCancel
}: QuestionFormProps) => {
    const [errorMessage, setErrorMessage] = useState<string>('');

    const validateAndSubmit = (action: 'add' | 'finish') => {
        if (action === 'finish' && 
            !currentQuestion.text && 
            currentQuestion.options.every(opt => !opt) && 
            currentQuestion.correctOption === -1) {
            onFinishQuiz();
            return;
        }

        const validation = validateQuestionForm(
            currentQuestion.text,
            currentQuestion.options,
            currentQuestion.correctOption
        );

        if (!validation.isValid) {
            const firstError = Object.values(validation.errors)[0];
            setErrorMessage(firstError);
            return;
        }

        setErrorMessage('');
        if (action === 'add') {
            onAddQuestion();
        } else {
            onFinishQuiz();
        }
    };

    const handleQuestionChange = (newQuestion: typeof currentQuestion) => {
        setErrorMessage('');
        onQuestionChange(newQuestion);
    };

    return (
        <div className="questions-form">
            <h2>Add a Question:</h2>
            
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            
            <div className="form-group">
                <input
                    type="text"
                    id="questionText"
                    value={currentQuestion.text}
                    onChange={(e) => handleQuestionChange({
                        ...currentQuestion,
                        text: e.target.value
                    })}
                    placeholder="Enter your question"
                    autoComplete="off"
                />
            </div>

            <div className="options-container">
                <div className="column">
                    {currentQuestion.options.slice(0, 2).map((option, index) => (
                        <div key={index} className="option-group">
                            <label htmlFor={`option${index}`} className="label-option">Option {index + 1}:</label>
                            <div className="option-input-group">
                                <input
                                    type="text"
                                    id={`option${index}`}
                                    value={option}
                                    onChange={(e) => {
                                        const newOptions = [...currentQuestion.options];
                                        newOptions[index] = e.target.value;
                                        handleQuestionChange({
                                            ...currentQuestion,
                                            options: newOptions
                                        });
                                    }}
                                    placeholder={`Enter option ${index + 1}`}
                                    autoComplete="off"
                                    className="option-input"
                                />
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={currentQuestion.correctOption === index}
                                    onChange={() => handleQuestionChange({
                                        ...currentQuestion,
                                        correctOption: index
                                    })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="column">
                    {currentQuestion.options.slice(2).map((option, index) => (
                        <div key={index + 2} className="option-group">
                            <label htmlFor={`option${index + 2}`} className="label-option">Option {index + 3}:</label>
                            <div className="option-input-group">
                                <input
                                    type="text"
                                    id={`option${index + 2}`}
                                    value={option}
                                    onChange={(e) => {
                                        const newOptions = [...currentQuestion.options];
                                        newOptions[index + 2] = e.target.value;
                                        handleQuestionChange({
                                            ...currentQuestion,
                                            options: newOptions
                                        });
                                    }}
                                    placeholder={`Enter option ${index + 3}`}
                                    autoComplete="off"
                                    className="option-input"
                                />
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={currentQuestion.correctOption === index + 2}
                                    onChange={() => handleQuestionChange({
                                        ...currentQuestion,
                                        correctOption: index + 2
                                    })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-buttons">
                <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
                <button 
                    type="button" 
                    onClick={() => validateAndSubmit('add')}
                    className="add-question-btn"
                >
                    Add Another Question
                </button>
                <button 
                    type="button" 
                    onClick={() => validateAndSubmit('finish')}
                    className="finish-btn"
                >
                    Finish Quiz
                </button>
            </div>
        </div>
    );
};
