"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Intro } from "@/ui/components/Intro";
import { Quiz } from "@/ui/components/Quiz";
import { SubjectSelect } from "@/ui/components/SubjectSelect";
import { authAPI } from "./_ui/utils/apiUtils";
import { Results } from "./_ui/components/Results";

type QuizStep = "intro" | "subject-select" | "quiz" | "results";

interface IntroProps {
  onGetStartedClick: () => void;
  onTestCodeSubmit: (code: string) => Promise<void>;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<QuizStep>("intro");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [testCode, setTestCode] = useState<string>("");
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await authAPI.getProfile();
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const handleGetStarted = useCallback(() => {
    setCurrentStep("subject-select");
  }, []);

  const handleTestCodeSubmit = useCallback(async (code: string) => {
    setTestCode(code);
    setCurrentStep("subject-select");
  }, []);

  const handleStartQuiz = useCallback((
    subject: string,
    level: string,
    topic: string,
    chapter: string
  ) => {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setSelectedChapter(chapter);
    setSelectedLevel(level);
    setCurrentStep("quiz");
  }, []);

  const handleQuizComplete = useCallback((finalScore: number) => {
    setScore(finalScore);
    setCurrentStep("results");
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentStep("intro");
    setSelectedSubject("");
    setSelectedTopic("");
    setSelectedChapter("");
    setSelectedLevel("");
    setTestCode("");
    setScore(0);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-brand-background p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)]">
        <AnimatePresence mode="wait">
          {currentStep === "intro" && (
            <Intro
              onGetStartedClick={handleGetStarted}
              onTestCodeSubmit={handleTestCodeSubmit}
            />
          )}

          {currentStep === "subject-select" && (
            <SubjectSelect
              onStartQuiz={handleStartQuiz}
              activeTestCode={testCode}
            />
          )}

          {currentStep === "quiz" && (
            <Quiz
              selectedSubject={selectedSubject}
              selectedTopic={selectedTopic}
              selectedLevel={selectedLevel}
              chapter={selectedChapter}
              testCode={testCode}
              onComplete={handleQuizComplete}
            />
          )}

          {currentStep === "results" && (
            <Results
              score={score}
              totalQuestions={10}
              onRestart={handleRestart}
              subject={selectedSubject}
              topic={selectedTopic}
              chapter={selectedChapter}
              level={selectedLevel}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}