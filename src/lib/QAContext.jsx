import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { QUESTIONS, selectableById } from "@/data/selectorData";

const QAContext = createContext(null);

const STORAGE_KEY = "ucl-job-finder-state";

export function QAProvider({ children }) {
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore saved progress when the app starts
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.answers) {
          setAnswers(parsed.answers);
        }

        if (Array.isArray(parsed.selected)) {
          setSelected(parsed.selected);
        }
      }
    } catch (error) {
      console.error("Failed to restore saved job finder state:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          answers,
          selected,
        })
      );
    } catch (error) {
      console.error("Failed to save job finder state:", error);
    }
  }, [answers, selected, isLoaded]);

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const toggleCapability = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  const restart = () => {
    setAnswers({});
    setSelected([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const selectedItems = selected
    .map((id) => selectableById(id))
    .filter(Boolean);

  const complete =
    Object.keys(answers).length >= QUESTIONS.length;

  return (
    <QAContext.Provider
      value={{
        answers,
        handleSelect,
        restart,
        selected,
        toggleCapability,
        selectedItems,
        complete,
      }}
    >
      {children}
    </QAContext.Provider>
  );
}

export function useQA() {
  return useContext(QAContext);
}