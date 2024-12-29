import "../styles/TitleForm.css";
import { useState } from 'react';
import { validateQuizTitle } from "../utils/helpers";


interface TitleFormProps {
    title: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isPublic: boolean; 
    onTogglePublic: (isPublic: boolean) => void;
  }
  
  export const TitleForm = ({ title, onTitleChange, onSubmit, onCancel, isPublic, onTogglePublic }: TitleFormProps) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const validation = validateQuizTitle(title);
      
      if (!validation.isValid) {
          setErrorMessage(validation.error);
          return;
      }
      
      setErrorMessage('');
      onSubmit(e);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    onTitleChange(e);
};
  
  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      <div id="header-new-quiz-div">
        <h1 id="HeaderNewQuiz">Create Quiz</h1>
        <div className="Line-two"></div>
      </div>
      <div className="form-group">
        <label htmlFor="quizTitle" id="labelId">Title:</label>
        <input
          type="text"
          id="quizTitle"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter quiz title"
          required
        />
        {errorMessage && <span className="error-message-title-form">{errorMessage}</span>}
        <div className="checkbox-container">
          <label htmlFor="publicQuiz">Public Quiz</label>
          <input 
            id="publicQuiz"
            type="checkbox" 
            className="custom-checkbox"
            checked={isPublic} 
            onChange={(e) => onTogglePublic(e.target.checked)} 
          />
        </div>
      </div>
      <div className="form-buttons">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}
  