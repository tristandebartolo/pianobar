import React from 'react';

function Question({ question, selectedAnswer, showFeedback, isCorrect, onAnswerSelect }) {
  if (!question) return null;

  return (
    <div className="quiz-question">
      <h2 className="quiz-question__text">{question.text}</h2>

      <div className="quiz-question__options">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === question.correctAnswer;

          let className = 'quiz-option';

          if (showFeedback) {
            if (isCorrectAnswer) {
              className += ' quiz-option--correct';
            } else if (isSelected && !isCorrect) {
              className += ' quiz-option--incorrect';
            } else {
              className += ' quiz-option--disabled';
            }
          } else if (isSelected) {
            className += ' quiz-option--selected';
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => onAnswerSelect(option)}
              disabled={showFeedback}
              aria-pressed={isSelected}
              aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}${showFeedback && isCorrectAnswer ? ', bonne réponse' : ''}${showFeedback && isSelected && !isCorrect ? ', réponse incorrecte' : ''}`}
            >
              <span className="quiz-option__letter" aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="quiz-option__text">{option}</span>
              {showFeedback && isCorrectAnswer && (
                <span className="quiz-option__icon" aria-hidden="true">✓</span>
              )}
              {showFeedback && isSelected && !isCorrect && (
                <span className="quiz-option__icon" aria-hidden="true">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div
          className={`quiz-feedback ${isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect'}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="quiz-feedback__header">
            {isCorrect ? '🎉 Correct !' : '❌ Incorrect'}
          </div>
          <div className="quiz-feedback__explanation">
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}

export default Question;
