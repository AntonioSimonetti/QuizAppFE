import { createSlice } from "@reduxjs/toolkit";

// Interface le spostiamo dopo

interface Quiz {
  id: number; // ID unico del quiz
  title: string; // Titolo del quiz
  isPublic: boolean; // Flag per quiz pubblico/privato
  userId: string; // ID dell'utente che ha creato il quiz
  questions: number[]; // Lista di ID delle domande associate
}

interface Question {
  id: number; // ID unico della domanda
  text: string; // Testo della domanda
  options: number[]; // Lista di ID delle opzioni associate
  correctAnswerIndex: number; // Indice della risposta corretta
  points: number; // Punteggio assegnato per questa domanda
  negativePoints?: number; // Punti sottratti per una risposta sbagliata (opzionale)
}

interface Option {
  id: number; // ID unico dell'opzione
  text: string; // Testo dell'opzione
  questionId: number; // ID della domanda associata
}

export interface QuizzesState {
  data: {
    quizzes: Quiz[]; // Lista di quiz
    questions: Record<number, Question>; // Dizionario con le domande, indicizzato per ID
    options: Record<number, Option>; // Dizionario con le opzioni, indicizzato per ID
  };
  status: "idle" | "loading" | "success" | "error"; // Stato della richiesta
  error: string | null; // Errore della richiesta, se presente
}

const initialStateQuiz: QuizzesState = {
  data: {
    quizzes: [], // Nessun quiz all'inizio
    questions: {}, // Nessuna domanda caricata inizialmente
    options: {}, // Nessuna opzione caricata inizialmente
  },
  status: "idle", // Stato iniziale (nessuna richiesta attiva)
  error: null, // Nessun errore all'inizio
};

export const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: initialStateQuiz, // Cambia a initialStateQuiz
  reducers: {
    setQuizzes(state, action) {
      state.data.quizzes = action.payload;
    },
    setQuestions(state, action) {
      action.payload.forEach((question: Question) => {
        state.data.questions[question.id] = question;
      });
    },
    setOptions(state, action) {
      action.payload.forEach((option: Option) => {
        state.data.options[option.id] = option;
      });
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetState(state) {
      Object.assign(state, initialStateQuiz); 
    },
  },
});

export const {
  setQuizzes,
  setQuestions,
  setOptions,
  setStatus,
  setError,
  resetState,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
