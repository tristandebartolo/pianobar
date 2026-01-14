import React from 'react';
import { useAppContext } from '../../context/AppContext.js';

function Results({ onRestart }) {
  const { state, dispatch } = useAppContext();
  const { quiz } = state;

  const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);

  const getGrade = (percent) => {
    if (percent >= 90) return { label: 'Excellent !', emoji: '🏆', color: '#FFD700' };
    if (percent >= 75) return { label: 'Très bien !', emoji: '🌟', color: '#4CAF50' };
    if (percent >= 60) return { label: 'Bien', emoji: '👍', color: '#2196F3' };
    if (percent >= 50) return { label: 'Passable', emoji: '📚', color: '#FF9800' };
    return { label: 'À améliorer', emoji: '💪', color: '#F44336' };
  };

  const grade = getGrade(percentage);

  const handleBackToExplore = () => {
    dispatch({ type: 'SET_MODE', payload: 'explore' });
  };

  return (
    <div className="quiz-results">
      <div className="quiz-results__header">
        <div className="quiz-results__emoji" style={{ color: grade.color }}>
          {grade.emoji}
        </div>
        <h2 className="quiz-results__title">Quiz terminé !</h2>
        <p className="quiz-results__grade" style={{ color: grade.color }}>
          {grade.label}
        </p>
      </div>

      <div className="quiz-results__score">
        <div className="quiz-results__score-circle">
          <svg viewBox="0 0 100 100" className="quiz-results__score-svg">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#2D2E42"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={grade.color}
              strokeWidth="10"
              strokeDasharray={`${percentage * 2.827} 282.7`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="quiz-results__score-text">
            <div className="quiz-results__percentage">{percentage}%</div>
            <div className="quiz-results__fraction">
              {quiz.score} / {quiz.totalQuestions}
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-results__details">
        <div className="quiz-results__stat">
          <span className="quiz-results__stat-label">Bonnes réponses</span>
          <span className="quiz-results__stat-value" style={{ color: '#4CAF50' }}>
            {quiz.score}
          </span>
        </div>
        <div className="quiz-results__stat">
          <span className="quiz-results__stat-label">Mauvaises réponses</span>
          <span className="quiz-results__stat-value" style={{ color: '#F44336' }}>
            {quiz.totalQuestions - quiz.score}
          </span>
        </div>
        <div className="quiz-results__stat">
          <span className="quiz-results__stat-label">Total questions</span>
          <span className="quiz-results__stat-value">{quiz.totalQuestions}</span>
        </div>
      </div>

      <div className="quiz-results__breakdown">
        <h3>Détails des réponses</h3>
        <div className="quiz-results__answers">
          {quiz.answers.map((answer, index) => (
            <div
              key={index}
              className={`quiz-answer-item ${
                answer.correct ? 'quiz-answer-item--correct' : 'quiz-answer-item--incorrect'
              }`}
            >
              <div className="quiz-answer-item__number">Q{index + 1}</div>
              <div className="quiz-answer-item__icon">
                {answer.correct ? '✓' : '✗'}
              </div>
              <div className="quiz-answer-item__text">
                <div className="quiz-answer-item__question">
                  {answer.question.text}
                </div>
                <div className="quiz-answer-item__answer">
                  Votre réponse: <strong>{answer.userAnswer}</strong>
                  {!answer.correct && (
                    <span className="quiz-answer-item__correct">
                      {' '}(Correct: {answer.question.correctAnswer})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-results__actions">
        <button className="quiz-button quiz-button--primary" onClick={onRestart}>
          🔄 Recommencer le quiz
        </button>
        <button className="quiz-button quiz-button--secondary" onClick={handleBackToExplore}>
          🔍 Retour à l'exploration
        </button>
      </div>
    </div>
  );
}

export default Results;
