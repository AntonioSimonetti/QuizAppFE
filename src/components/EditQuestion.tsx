import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { updateQuestion, updateOption } from '../services/quizzes';
import '../styles/EditQuestion.css';

interface EditQuestionProps {
    questionData: any;
    userId: string;
    token: string;
    onClose: () => void;
    onUpdate: () => void;
}

export const EditQuestion = ({ questionData, userId, token, onClose, onUpdate }: EditQuestionProps) => {
    const [questionText, setQuestionText] = useState(questionData.question.text);
    const [correctIndex, setCorrectIndex] = useState(questionData.question.correctAnswerIndex);
    const [options, setOptions] = useState(questionData.question.options.$values);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingOptionId, setUpdatingOptionId] = useState<number | null>(null);

    const handleUpdateQuestion = async () => {
        setIsUpdating(true);
        try {
            // First update the question
            await updateQuestion(
                questionData.question.id,
                {
                    id: questionData.question.id,
                    text: questionText,
                    correctAnswerIndex: correctIndex,
                    points: questionData.question.points || 1,
                    negativePoints: questionData.question.negativePoints || 0,
                    userId: userId
                },
                token
            );

            // Then update all modified options
            for (const option of options) {
                await updateOption(
                    option.id,
                    {
                        id: option.id,
                        text: option.text,
                        questionId: questionData.question.id
                    },
                    token
                );
            }

            onUpdate();
        } catch (error) {
            console.error('Failed to update question:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOptionTextChange = (index: number, newText: string) => {
        const newOptions = [...options];
        newOptions[index] = {
            ...newOptions[index],
            text: newText
        };
        setOptions(newOptions);
    };

    return (
        <div className="edit-question-modal">
            <div className="edit-question-content">
                <h2>Edit Question</h2>
                
                <div className="form-group">
                    <label>Question Text:</label>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    />
                </div>

                <div className="options-section">
                    <h3>Options</h3>
                    {options.map((option: any, index: number) => (
                        <div key={option.id} className="option-item">
                            <input
                                type="radio"
                                name="correctAnswer"
                                checked={index === correctIndex}
                                onChange={() => setCorrectIndex(index)}
                            />
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                className={updatingOptionId === option.id ? 'updating' : ''}
                            />
                        </div>
                    ))}
                </div>

                <div className="button-group">
                    <button onClick={onClose} className="cancel-btn">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateQuestion}
                        disabled={isUpdating}
                        className="save-btn"
                    >
                        {isUpdating ? 'Saving Changes...' : 'Save All Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
