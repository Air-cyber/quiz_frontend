"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { fetchQuizQuestions } from "../utils/fetchQuestions";
import axios, { AxiosError } from "axios";

const subjects = {
  Mathematics: {
    "Arithmetic": ["Basic Operations", "Fractions", "Decimals", "Percentages"],
    "Geometry": ["Lines & Angles", "Triangles", "Circles", "Polygons"],
    "Calculus": ["Limits", "Derivatives", "Integrals", "Applications"]
  },
  Science: {
    "Physics": ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics"],
    "Chemistry": ["Atomic Structure", "Chemical Bonding", "Organic Chemistry", "Acids & Bases"],
    "Biology": ["Cell Biology", "Genetics", "Ecology", "Human Physiology"]
  },
  History: {
    "Ancient": ["Mesopotamia", "Egypt", "Greece", "Rome"],
    "Medieval": ["Byzantine Empire", "Islamic World", "European Feudalism", "Crusades"],
    "Modern": ["Renaissance", "Industrial Revolution", "World Wars", "Cold War"]
  },
  "General Knowledge": {
    "Sports": ["Olympics", "Football", "Cricket", "Basketball"],
    "Politics": ["Governance", "Elections", "International Relations", "Political Ideologies"],
    "Culture": ["Art", "Music", "Literature", "Festivals"]
  },
  "Machine Learning": {
    "Supervised Learning": ["Regression", "Classification", "Decision Trees", "Support Vector Machines"],
    "Unsupervised Learning": ["Clustering", "Dimensionality Reduction", "Anomaly Detection", "Association Rules"],
    "Deep Learning": ["Neural Networks", "CNNs", "RNNs", "Transformers"]
  }
} as const;

type Subject = keyof typeof subjects;
type SubjectTopics<T extends Subject> = keyof (typeof subjects)[T];
type Chapter = string;

const levels = ["Easy", "Medium", "Hard"] as const;
type Level = typeof levels[number];

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface TestInfo {
  subject: Subject;
  topic: string;
  chapter: string;
  difficulty: Level;
}

interface TestInfoResponse {
  testInfo?: TestInfo;
}

export const SubjectSelect = ({
  onStartQuiz,
  activeTestCode
}: {
  onStartQuiz: (subject: Subject, level: Level, topic: string, chapter: string) => void;
  activeTestCode?: string;
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | "">("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<Level | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidTestInfo = (info: any): info is TestInfo => {
    if (!info || typeof info !== 'object') return false;

    const isSubjectValid = info.subject in subjects;
    const isTopicValid = selectedSubject
      ? info.topic in subjects[info.subject as Subject]
      : false;
    const isChapterValid = selectedSubject && info.topic
      ? (subjects[info.subject as Subject][info.topic as keyof (typeof subjects)[Subject]] as readonly string[]).includes(info.chapter)
      : false;
    const isLevelValid = levels.includes(info.difficulty as Level);

    return isSubjectValid && isTopicValid && isChapterValid && isLevelValid;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchTestInfoAndStartQuiz = // eslint-disable-next-line react-hooks/exhaustive-deps
 useCallback(async () => {
    if (!activeTestCode) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post<TestInfoResponse>(
        "https://quiz-backend-4x8z.onrender.com/api/quiz/generate",
        { testCode: activeTestCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.testInfo && isValidTestInfo(response.data.testInfo)) {
        const { subject, topic, chapter, difficulty } = response.data.testInfo;
        const quizQuestions = await fetchQuizQuestions(subject, difficulty, topic, chapter);

        if (!quizQuestions || quizQuestions.length === 0) {
          throw new Error("No questions received from the server");
        }

        localStorage.setItem("quizQuestions", JSON.stringify(quizQuestions));
        onStartQuiz(subject, difficulty, topic, chapter);
      }
    } catch (error) {
      console.error("Error fetching test info:", error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  }, [activeTestCode, onStartQuiz]);

  // eslint-disable-next-line react-hooks/exhaustive-deps


  useEffect(() => {
    fetchTestInfoAndStartQuiz();
  }, [fetchTestInfoAndStartQuiz]);

  // eslint-disable-next-line react-hooks/exhaustive-deps


  useEffect(() => {
    setSelectedTopic("");
    setSelectedChapter("");
  }, [selectedSubject]);

  // eslint-disable-next-line react-hooks/exhaustive-deps


  useEffect(() => {
    setSelectedChapter("");
  }, [selectedTopic]);

  const handleContinue = async () => {
    if (!selectedSubject || !selectedLevel || !selectedTopic || !selectedChapter) return;
    setLoading(true);

    try {
      const quizQuestions = await fetchQuizQuestions(
        selectedSubject,
        selectedLevel,
        selectedTopic,
        selectedChapter
      );

      if (!quizQuestions || quizQuestions.length === 0) {
        throw new Error("No questions received from the server");
      }

      localStorage.setItem("quizQuestions", JSON.stringify(quizQuestions));
      onStartQuiz(selectedSubject, selectedLevel, selectedTopic, selectedChapter);
    } catch (error) {
      console.error("Error fetching questions:", error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && activeTestCode) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-brand-neutral-dark">Preparing Your Quiz...</h2>
          <p className="text-brand-neutral">Please wait while we load your test</p>
        </div>
      </div>
    );
  }

  if (!activeTestCode) {
    return (
      <motion.div
        key="subject-select"
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        }}
        className="w-full h-full flex flex-col p-6 overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-soft"
        initial="initial"
        animate="animate"
        exit="initial"
      >
        <div className="flex-1 flex flex-col mb-6">
          <div className="text-center mb-12">
            <h1 className="text-brand-primary font-bold text-4xl mb-3">
              Customize Your Quiz
            </h1>
            <p className="text-brand-neutral-dark text-lg">
              Select your preferences to start your learning journey
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject-select" className="block text-xl font-semibold text-brand-neutral-dark mb-3">
                  Subject
                </label>
                <div className="relative">
                  <select
                    id="subject-select"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                    className="w-full p-4 rounded-xl border-2 border-brand-background-dark bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light focus:outline-none appearance-none pr-12 transition-all duration-200 text-lg"
                  >
                    <option value="">Select a subject</option>
                    {Object.keys(subjects).map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-neutral">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {selectedSubject && (
                <div>
                  <label htmlFor="topic-select" className="block text-xl font-semibold text-brand-neutral-dark mb-3">
                    Topic
                  </label>
                  <div className="relative">
                    <select
                      id="topic-select"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-brand-background-dark bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light focus:outline-none appearance-none pr-12 transition-all duration-200 text-lg"
                    >
                      <option value="">Select a topic</option>
                      {Object.keys(subjects[selectedSubject]).map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-neutral">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedSubject && selectedTopic && (
                <div>
                  <label htmlFor="chapter-select" className="block text-xl font-semibold text-brand-neutral-dark mb-3">
                    Chapter
                  </label>
                  <div className="relative">
                    <select
                      id="chapter-select"
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-brand-background-dark bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light focus:outline-none appearance-none pr-12 transition-all duration-200 text-lg"
                    >
                      <option value="">Select a chapter</option>
                      {(selectedSubject && selectedTopic ?
                        (subjects[selectedSubject][selectedTopic as keyof (typeof subjects)[Subject]] as readonly string[]).map((chapter) => (
                          <option key={chapter} value={chapter}>
                            {chapter}
                          </option>
                        ))
                        : []
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-neutral">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold text-brand-neutral-dark mb-4">Difficulty</h2>
                <div className="flex space-x-4">
                  {levels.map((level) => {
                    const isActive = selectedLevel === level;
                    const colorClass = isActive
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'border-brand-background-dark hover:border-brand-primary';

                    return (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`p-4 rounded-xl border-2 font-medium text-lg transition-all duration-200 ${colorClass} transform hover:-translate-y-1`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 pt-6 pb-4 bg-gradient-to-t from-white to-transparent">
          <div className="max-w-4xl mx-auto w-full">
            <button
              disabled={!selectedSubject || !selectedLevel || !selectedTopic || !selectedChapter || loading}
              onClick={handleContinue}
              className={`w-full py-4 px-8 rounded-xl font-bold text-white shadow-lg transition-all duration-200 ${!selectedSubject || !selectedLevel || !selectedTopic || !selectedChapter || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-brand-primary hover:bg-brand-primary-dark transform hover:-translate-y-1'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg">Preparing Your Quiz...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-lg">Start Quiz</span>
                  <svg className="ml-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};