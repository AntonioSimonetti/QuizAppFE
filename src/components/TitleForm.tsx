interface TitleFormProps {
    title: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isPublic: boolean; 
    onTogglePublic: (isPublic: boolean) => void;
  }
  
  export const TitleForm = ({ title, onTitleChange, onSubmit, onCancel, isPublic, onTogglePublic }: TitleFormProps) => (
    <form onSubmit={onSubmit} className="quiz-form">
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
          onChange={onTitleChange}
          placeholder="Enter quiz title"
          required
        />
         <label>
          <input 
            type="checkbox" 
            checked={isPublic} 
            onChange={(e) => onTogglePublic(e.target.checked)} 
            />
            Public Quiz
        </label>
      </div>
      <div className="form-buttons">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
  