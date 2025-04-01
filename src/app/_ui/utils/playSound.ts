'use client';

import { isBrowser } from './browser';

/**
 * Play a sound file from the public/sounds directory
 */
const playSound = (sound: string) => {
  if (!isBrowser()) return; // Skip on server

  const audio = new Audio(`/sounds/${sound}`);
  audio.play();

  isBrowser() && window.addEventListener("beforeunload", () => {
    audio.pause();
  });
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
