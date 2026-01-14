import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext.js';
import { CIRCLE_DATA } from '../data/circleData.js';
import {
  getRelativeMinor,
  getDominant,
  getSubdominant,
  getDiatonicChords
} from '../utils/musicTheory.js';

export function useQuiz() {
  const { state, dispatch } = useAppContext();
  const { quiz } = state;

  // Types de questions
  const questionTypes = [
    'relative-minor',
    'accidentals',
    'dominant',
    'subdominant',
    'chord-degree'
  ];

  // Générer une question aléatoire
  const generateQuestion = useCallback(() => {
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const keyData = CIRCLE_DATA[Math.floor(Math.random() * CIRCLE_DATA.length)];

    let question = {};

    switch (type) {
      case 'relative-minor': {
        const correctAnswer = getRelativeMinor(keyData.majorKey);
        const wrongAnswers = CIRCLE_DATA
          .filter(k => k.minorKey !== correctAnswer)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(k => k.minorKey);

        question = {
          type: 'relative-minor',
          text: `Quel est le relatif mineur de ${keyData.majorKey} majeur ?`,
          correctAnswer,
          options: shuffleArray([correctAnswer, ...wrongAnswers]),
          keyData,
          explanation: `Le relatif mineur de ${keyData.majorKey} est ${correctAnswer}. Ils partagent la même armure (${keyData.accidentals.count} ${keyData.accidentals.type === 'sharp' ? 'dièses' : 'bémols'}).`
        };
        break;
      }

      case 'accidentals': {
        const correctAnswer = keyData.accidentals.count.toString();
        const wrongAnswers = [
          (keyData.accidentals.count + 1).toString(),
          (keyData.accidentals.count + 2).toString(),
          Math.max(0, keyData.accidentals.count - 1).toString()
        ].filter(a => a !== correctAnswer).slice(0, 3);

        question = {
          type: 'accidentals',
          text: `Combien de ${keyData.accidentals.type === 'sharp' ? 'dièses' : 'bémols'} dans la tonalité de ${keyData.majorKey} majeur ?`,
          correctAnswer,
          options: shuffleArray([correctAnswer, ...wrongAnswers]),
          keyData,
          explanation: `${keyData.majorKey} majeur a ${keyData.accidentals.count} ${keyData.accidentals.type === 'sharp' ? 'dièses' : 'bémols'} à l'armure.`
        };
        break;
      }

      case 'dominant': {
        const correctAnswer = getDominant(keyData.id);
        const wrongAnswers = CIRCLE_DATA
          .filter(k => k.majorKey !== correctAnswer)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(k => k.majorKey);

        question = {
          type: 'dominant',
          text: `Quelle est la dominante (V) de ${keyData.majorKey} majeur ?`,
          correctAnswer,
          options: shuffleArray([correctAnswer, ...wrongAnswers]),
          keyData,
          explanation: `La dominante de ${keyData.majorKey} est ${correctAnswer}, une quinte au-dessus.`
        };
        break;
      }

      case 'subdominant': {
        const correctAnswer = getSubdominant(keyData.id);
        const wrongAnswers = CIRCLE_DATA
          .filter(k => k.majorKey !== correctAnswer)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(k => k.majorKey);

        question = {
          type: 'subdominant',
          text: `Quelle est la sous-dominante (IV) de ${keyData.majorKey} majeur ?`,
          correctAnswer,
          options: shuffleArray([correctAnswer, ...wrongAnswers]),
          keyData,
          explanation: `La sous-dominante de ${keyData.majorKey} est ${correctAnswer}, une quinte en-dessous.`
        };
        break;
      }

      case 'chord-degree': {
        const chords = getDiatonicChords(keyData.id, false);
        const degree = Math.floor(Math.random() * 7);
        const degreeNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
        const correctAnswer = chords[degree];

        const wrongAnswers = chords
          .filter((c, i) => i !== degree)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        question = {
          type: 'chord-degree',
          text: `Quel est l'accord ${degreeNumerals[degree]} dans la tonalité de ${keyData.majorKey} majeur ?`,
          correctAnswer,
          options: shuffleArray([correctAnswer, ...wrongAnswers]),
          keyData,
          explanation: `L'accord ${degreeNumerals[degree]} dans ${keyData.majorKey} majeur est ${correctAnswer}.`
        };
        break;
      }

      default:
        break;
    }

    dispatch({ type: 'SET_QUIZ_QUESTION', payload: question });
    return question;
  }, [dispatch]);

  // Soumettre une réponse
  const submitAnswer = useCallback((answer) => {
    const isCorrect = answer === quiz.currentQuestion.correctAnswer;

    const answerData = {
      question: quiz.currentQuestion,
      userAnswer: answer,
      correct: isCorrect,
      timestamp: Date.now()
    };

    dispatch({ type: 'ANSWER_QUESTION', payload: answerData });

    return isCorrect;
  }, [quiz.currentQuestion, dispatch]);

  // Démarrer le quiz
  const startQuiz = useCallback((totalQuestions = 10) => {
    dispatch({ type: 'START_QUIZ', payload: totalQuestions });
  }, [dispatch]);

  // Recommencer le quiz
  const restartQuiz = useCallback(() => {
    dispatch({ type: 'RESTART_QUIZ' });
  }, [dispatch]);

  // Terminer le quiz
  const endQuiz = useCallback(() => {
    dispatch({ type: 'END_QUIZ' });
  }, [dispatch]);

  return {
    quiz,
    generateQuestion,
    submitAnswer,
    startQuiz,
    restartQuiz,
    endQuiz
  };
}

// Fonction helper pour mélanger un tableau
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
