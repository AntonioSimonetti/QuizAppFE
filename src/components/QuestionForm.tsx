import QuestionFormProps from "../interfaces/quiz"; 

export const QuestionForm = ({
    currentQuestion,
    onQuestionChange,
    onAddQuestion,
    onFinishQuiz,
    onCancel
}: QuestionFormProps) => {
    return (
        <div className="questions-form">
            <h2>Add a Question:</h2>
            
            <div className="form-group">
                <input
                    type="text"
                    id="questionText"
                    value={currentQuestion.text}
                    onChange={(e) => onQuestionChange({
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
                                        onQuestionChange({
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
                                    onChange={() => onQuestionChange({
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
                                        onQuestionChange({
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
                                    onChange={() => onQuestionChange({
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
                    onClick={onAddQuestion}
                    className="add-question-btn"
                    disabled={!currentQuestion.text || currentQuestion.options.some(opt => !opt) || currentQuestion.correctOption === -1}
                >
                    Add Another Question
                </button>
                <button 
                    type="button" 
                    onClick={onFinishQuiz}
                    className="finish-btn"
                >
                    Finish Quiz
                </button>
            </div>
        </div>
    );
};
