export interface Quiz {
    id: number; 
    title: string; 
    isPublic: boolean;
    userId: string; 
    quizQuestions: {
      $id: string;
      $values: any[];
    };
  }
  
export interface Question {
    id: number;
    text: string; 
    options: number[]; 
    correctAnswerIndex: number; 
    points: number; 
    negativePoints?: number; 
  }
  
export interface Option {
    id: number; 
    text: string; 
    questionId: number; 
  }
  
export interface QuizzesState {
    data: {
      quizzes: Quiz[]; 
      questions: Record<number, Question>; 
      options: Record<number, Option>; 
    };
    status: "idle" | "loading" | "success" | "error"; 
    error: string | null; 
  }
  
export const initialStateQuiz: QuizzesState = {
    data: {
      quizzes: [], 
      questions: {}, 
      options: {}, 
    },
    status: "idle", 
    error: null, 
  };

export interface LocalQuizState {
    quizzes: Record<number, {
      title: string;
      questions: Record<number, {
        text: string;
        options: Record<number, {
          text: string;
          isCorrect: boolean;
        }>;
      }>;
    }>;
    currentQuizId: number;
  }
  
export const initialQuizState: LocalQuizState = {
    quizzes: {},
    currentQuizId: 0
  };

export default  interface QuestionFormProps {
    currentQuestion: {
        text: string;
        options: string[];
        correctOption: number;
    };
    onQuestionChange: (question: {
        text: string;
        options: string[];
        correctOption: number;
    }) => void;
    onAddQuestion: () => void;
    onFinishQuiz: () => void;
    onCancel: () => void;
}

export interface CurrentQuestion {
  text: string;
  options: string[];
  correctOption: number;
}