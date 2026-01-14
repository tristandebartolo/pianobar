import React, { useState, useEffect, useRef } from 'react';
import { useQuiz } from '../../hooks/useQuiz.js';
import { playClickSound } from '../../utils/audioSystem.js';
import Question from './Question.jsx';
import Results from './Results.jsx';

function QuizMode() {
  const { quiz, generateQuestion, submitAnswer, startQuiz, restartQuiz, endQuiz } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const initialized = useRef(false);

  // Démarrer le quiz au montage
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      startQuiz(10);
    }
  }, [startQuiz]);

  // Générer la première question une fois le quiz actif
  useEffect(() => {
    if (quiz.active && !quiz.currentQuestion && quiz.questionCount === 0) {
      generateQuestion();
    }
  }, [quiz.active, quiz.currentQuestion, quiz.questionCount, generateQuestion]);

  // Vérifier si le quiz est terminé
  const isQuizComplete = quiz.questionCount >= quiz.totalQuestions;

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return; // Empêcher de changer la réponse après validation

    playClickSound();
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    playClickSound();
    const correct = submitAnswer(selectedAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    playClickSound();
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);

    if (quiz.questionCount >= quiz.totalQuestions) {
      endQuiz();
    } else {
      generateQuestion();
    }
  };

  const handleRestart = () => {
    playClickSound();
    restartQuiz();
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    // La génération de question sera déclenchée par le useEffect
  };

  if (isQuizComplete) {
    return <Results onRestart={handleRestart} />;
  }

  if (!quiz.currentQuestion) {
    return (
      <div className="quiz-mode">
        <div className="quiz-loading">
          <div className="quiz-loading__spinner"></div>
          <p>Préparation du quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-mode" role="region" aria-label="Mode Quiz">
      <div className="quiz-header">
        <div className="quiz-progress" role="progressbar" aria-valuenow={quiz.questionCount + 1} aria-valuemin={1} aria-valuemax={quiz.totalQuestions}>
          <div className="quiz-progress__bar">
            <div
              className="quiz-progress__fill"
              style={{ width: `${(quiz.questionCount / quiz.totalQuestions) * 100}%` }}
            ></div>
          </div>
          <span className="quiz-progress__text">
            Question {quiz.questionCount + 1} / {quiz.totalQuestions}
          </span>
        </div>
        <div className="quiz-score" aria-live="polite">
          Score: <span className="quiz-score__value">{quiz.score}</span> / {quiz.questionCount}
        </div>
      </div>

      <Question
        question={quiz.currentQuestion}
        selectedAnswer={selectedAnswer}
        showFeedback={showFeedback}
        isCorrect={isCorrect}
        onAnswerSelect={handleAnswerSelect}
      />

      <div className="quiz-actions">
        {!showFeedback ? (
          <button
            className="quiz-button quiz-button--primary"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            Valider
          </button>
        ) : (
          <button
            className="quiz-button quiz-button--next"
            onClick={handleNext}
          >
            {quiz.questionCount >= quiz.totalQuestions - 1 ? 'Voir les résultats' : 'Question suivante'}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizMode;
