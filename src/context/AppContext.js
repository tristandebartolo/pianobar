import React, { createContext, useReducer, useContext } from 'react';

const AppContext = createContext();

const initialState = {
  mode: 'explore',
  selectedKey: null,
  highlightedKeys: [],
  quiz: {
    active: false,
    currentQuestion: null,
    score: 0,
    questionCount: 0,
    totalQuestions: 10,
    answers: []
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SELECT_KEY':
      return { ...state, selectedKey: action.payload };

    case 'HIGHLIGHT_KEYS':
      return { ...state, highlightedKeys: action.payload };

    case 'CLEAR_HIGHLIGHTS':
      return { ...state, highlightedKeys: [] };

    case 'TOGGLE_MODE':
      return {
        ...state,
        mode: state.mode === 'explore' ? 'quiz' : 'explore',
        quiz: state.mode === 'explore' ? { ...state.quiz, active: true } : initialState.quiz
      };

    case 'START_QUIZ':
      return {
        ...state,
        mode: 'quiz',
        quiz: {
          active: true,
          currentQuestion: null,
          score: 0,
          questionCount: 0,
          totalQuestions: action.payload || 10,
          answers: []
        }
      };

    case 'SET_QUIZ_QUESTION':
      return {
        ...state,
        quiz: {
          ...state.quiz,
          currentQuestion: action.payload
        }
      };

    case 'ANSWER_QUESTION':
      return {
        ...state,
        quiz: {
          ...state.quiz,
          score: action.payload.correct ? state.quiz.score + 1 : state.quiz.score,
          questionCount: state.quiz.questionCount + 1,
          answers: [...state.quiz.answers, action.payload]
        }
      };

    case 'END_QUIZ':
      return {
        ...state,
        quiz: {
          ...state.quiz,
          active: false
        }
      };

    case 'RESTART_QUIZ':
      return {
        ...state,
        quiz: {
          active: true,
          currentQuestion: null,
          score: 0,
          questionCount: 0,
          totalQuestions: state.quiz.totalQuestions,
          answers: []
        }
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
