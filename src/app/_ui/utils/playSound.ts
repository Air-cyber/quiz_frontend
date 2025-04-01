'use client';

// Utility to check if code is running in browser environment
const isBrowser = () => typeof window !== 'undefined';

const playSound = (sound: string) => {
  const audio = new Audio(`/sounds/${sound}`);
  audio.play();

  // If page changes, stop playing sound
  if (isBrowser()) {
    window.addEventListener("beforeunload", () => {
      audio.pause();
    });
  }
};

export const playCorrectAnswer = () => {
  playSound("correct-answer.mp3");
};

export const playWrongAnswer = () => {
  playSound("wrong-answer.mp3");
};

export const playQuizStart = () => {
  playSound("quiz-start.mp3");
};

export const playQuizEnd = () => {
  playSound("quiz-end.mp3");
};