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