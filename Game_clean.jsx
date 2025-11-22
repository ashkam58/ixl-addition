import React, { useEffect, useMemo, useState } from "react";
import FractionEngine from "../engines/FractionEngine.jsx";
import CubesEngine from "../engines/CubesEngine.jsx";
import NumberLineEngine from "../engines/NumberLineEngine.jsx";
import VerticalAdditionEngine from "../engines/VerticalAdditionEngine.jsx";
import EquationEngine from "../engines/EquationEngine.jsx";
import TenFrameEngine from "../engines/TenFrameEngine.jsx";
import ArrayEngine from "../engines/ArrayEngine.jsx";
import MoneyEngine from "../engines/MoneyEngine.jsx";
import PropertiesEngine from "../engines/PropertiesEngine.jsx";
import PictureAdditionEngine from "../engines/PictureAdditionEngine.jsx";
import SelectionEngine from "../engines/SelectionEngine.jsx";
import Confetti from "../Confetti.jsx";

// Static imports for data files
import grade4Fractions from "../../data/grade4_fractions_addition.json";
import grade1Cubes from "../../data/grade1_addition_cubes.json";
import grade6Integers from "../../data/grade6_integers_addition.json";
import grade4MultiDigit from "../../data/grade4_multidigit_addition.json";
import gradeK from "../../data/grade_k_addition.json";
import grade1 from "../../data/grade_1_addition.json";
import grade2 from "../../data/grade_2_addition.json";
import grade3 from "../../data/grade_3_addition.json";
import grade3Est from "../../data/grade_3_estimation.json";
import grade3NumberLine from "../../data/grade_3_numberline.json";
import grade3Vert3 from "../../data/grade_3_vertical_3digit.json";
import grade3Vert4 from "../../data/grade_3_vertical_4digit.json";
import grade3Three from "../../data/grade_3_three_numbers.json";
import grade3Props from "../../data/grade_3_properties.json";
import grade3Money from "../../data/grade_3_money.json";
import grade5 from "../../data/grade_5_decimals.json";
import grade7 from "../../data/grade_7_integers.json";
import algebra1 from "../../data/algebra_1_rational.json";
import gradePK from "../../data/grade_pk_addition.json";
import grade2Money from "../../data/grade2_money.json";
import grade3Arrays from "../../data/grade_3_arrays.json";
import grade4Props from "../../data/grade4_properties.json";
import grade8Integers from "../../data/grade_8_integers.json";
import algebra2 from "../../data/algebra_2_rational.json";
import pkCubes from "../../data/grade_pk_cubes.json";
import pkPics from "../../data/grade_pk_pictures.json";
import pkSent from "../../data/grade_pk_sentences.json";
import g1Pics from "../../data/grade1_addition_pictures.json";
import g1Word from "../../data/grade1_word_problems.json";
import g1Make10 from "../../data/grade1_making_ten.json";
import g1Doubles from "../../data/grade1_doubles.json";

const DATA_FILES = {
  "grade4_fractions_addition.json": grade4Fractions,
  "grade1_addition_cubes.json": grade1Cubes,
  "grade6_integers_addition.json": grade6Integers,
  "grade4_multidigit_addition.json": grade4MultiDigit,
  "grade_k_addition.json": gradeK,
  "grade_1_addition.json": grade1,
  "grade_2_addition.json": grade2,
  "grade_3_addition.json": grade3,
  "grade_3_estimation.json": grade3Est,
  "grade_3_numberline.json": grade3NumberLine,
  "grade_3_vertical_3digit.json": grade3Vert3,
  "grade_3_vertical_4digit.json": grade3Vert4,
  "grade_3_three_numbers.json": grade3Three,
  "grade_3_properties.json": grade3Props,
  "grade_3_money.json": grade3Money,
  "grade_5_decimals.json": grade5,
  "grade_7_integers.json": grade7,
  "algebra_1_rational.json": algebra1,
  "grade_pk_addition.json": gradePK,
  "grade2_money.json": grade2Money,
  "grade_3_arrays.json": grade3Arrays,
  "grade4_properties.json": grade4Props,
  "grade_8_integers.json": grade8Integers,
  "algebra_2_rational.json": algebra2,
  "grade_pk_cubes.json": pkCubes,
  "grade_pk_pictures.json": pkPics,
  "grade_pk_sentences.json": pkSent,
  "grade1_addition_pictures.json": g1Pics,
  "grade1_word_problems.json": g1Word,
  "grade1_making_ten.json": g1Make10,
  "grade1_doubles.json": g1Doubles,
};

const ENGINE_COMPONENTS = {
  fractionsArea: FractionEngine,
  cubes: CubesEngine,
  numberLine: NumberLineEngine,
  vertical: VerticalAdditionEngine,
  equation: EquationEngine,
  tenFrame: TenFrameEngine,
  array: ArrayEngine,
  money: MoneyEngine,
  properties: PropertiesEngine,
  picture: PictureAdditionEngine,
  selection: SelectionEngine,
};

function updateSmartScore(currentScore, difficulty, correct, streak) {
  if (correct) {
    const baseGain = 3 + difficulty;
    const bonus = streak >= 3 ? 2 : 0;
    return Math.min(100, currentScore + baseGain + bonus);
  } else {
    const penalty = 5 + 2 * difficulty;
    return Math.max(0, currentScore - penalty);
  }
}

export default function Game({ selectedSkill, userId }) {
  const allQuestions = useMemo(
    () => DATA_FILES[selectedSkill.file] || [],
    [selectedSkill]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = allQuestions[currentIndex] || allQuestions[0];
  const promptText = currentQuestion?.prompt || currentQuestion?.question;

  useEffect(() => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setAnsweredCount(0);
    setTimeLeft(300);
    setUserAnswer("");
    setFeedback(null);
  }, [selectedSkill]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  if (!currentQuestion) {
    return <div>No questions found for this grade yet.</div>;
  }

  const Engine = ENGINE_COMPONENTS[currentQuestion.engine];

  async function saveProgress(currentScore, totalAnswered) {
    try {
      await fetch("http://localhost:4000/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          grade: currentQuestion.grade,
          skillId: selectedSkill.id,
          score: currentScore,
          answeredCount: totalAnswered,
        }),
      });
    } catch (err) {
      console.warn("Failed to save progress:", err);
    }
  }

  function handleCheck() {
    if (feedback) return; // Already checked

    const isCorrect =
      String(userAnswer).trim().toLowerCase() ===
      String(currentQuestion.answer).trim().toLowerCase();

    let newScore;
    let newStreak;

    if (isCorrect) {
      setFeedback("correct");
      newStreak = streak + 1;
      setStreak(newStreak);
      newScore = updateSmartScore(score, currentQuestion.difficulty, true, newStreak);
      setScore(newScore);
    } else {
      setFeedback("wrong");
      newStreak = 0;
      setStreak(newStreak);
      newScore = updateSmartScore(score, currentQuestion.difficulty, false, newStreak);
      setScore(newScore);
    }

    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);

    saveProgress(newScore, newAnsweredCount);

    if (isCorrect && newScore >= 90) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer("");
      setCurrentIndex((prev) => (prev + 1) % allQuestions.length);
    }, 800);
  }

  // New handler for click-to-answer engines
  const handleAnswerClick = (val) => {
    if (feedback) return; // Prevent multiple clicks
    setUserAnswer(val);
    // We need to wait for state update or pass val directly to check
    // To keep it simple, we'll just set it and call a modified check immediately

    const isCorrect =
      String(val).trim().toLowerCase() ===
      String(currentQuestion.answer).trim().toLowerCase();

    let newScore;
    let newStreak;

    if (isCorrect) {
      setFeedback("correct");
      newStreak = streak + 1;
      setStreak(newStreak);
      newScore = updateSmartScore(score, currentQuestion.difficulty, true, newStreak);
      setScore(newScore);
    } else {
      setFeedback("wrong");
      newStreak = 0;
      setStreak(newStreak);
      newScore = updateSmartScore(score, currentQuestion.difficulty, false, newStreak);
      setScore(newScore);
    }

    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);
    saveProgress(newScore, newAnsweredCount);

    if (isCorrect && newScore >= 90) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer("");
      setCurrentIndex((prev) => (prev + 1) % allQuestions.length);
    }, 800);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="game-shell">
      <div className="game-topbar">
        <div className="score-box">
          <span className="label">SmartScore</span>
          <span className="value">{score}</span>
        </div>
        <div className="timer-box">
          <span className="label">Time left</span>
          <span className="value">
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      <div className="prompt-card">
        <div className="prompt-emoji">+</div>
      <div className="prompt-card">
        <div className="prompt-emoji">+</div>
        <div className="prompt-text">
          <h2>{promptText}</h2>
          <p>Grade {currentQuestion.grade} � Skill {currentQuestion.skillCode}</p>
        </div>
      </div>

      <div className={`engine-card ${feedback === "correct" ? "correct-anim" : ""}`}>
        {Engine && <Engine data={currentQuestion.data} onAnswer={handleAnswerClick} />}
      </div>

      <div className="answer-row">
        <span className="label">Your answer:</span>
        <input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCheck();
            }
          }}
          placeholder="e.g. 3/4"
          className="answer-input"
        />
        <button onClick={handleCheck} className="check-btn">
          Check
        </button>
      </div>

      {feedback && (
        <div className="feedback-overlay">
          {feedback === "correct" && (
            <div className="feedback feedback-correct">
              <div>🎉</div>
              Nice! You solved it.
            </div>
          )}
          {feedback === "wrong" && (
            <div className="feedback feedback-wrong">
              <div>🤔</div>
              Not quite. Try the next one.
            </div>
          )}
        </div>
      )}

      {showConfetti && <Confetti />}
    </div>
  );
}
