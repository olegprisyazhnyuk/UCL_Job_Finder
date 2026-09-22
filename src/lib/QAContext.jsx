import React, { createContext, useContext, useState } from "react";
import { QUESTIONS, selectableById } from "@/data/selectorData";

const QAContext = createContext(null);

export function QAProvider({ children }) {
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState([]);

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleCapability = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const restart = () => {
    setAnswers({});
    setSelected([]);
  };

  const selectedItems = selected
    .map((id) => selectableById(id))
    .filter(Boolean);

  const complete = Object.keys(answers).length >= QUESTIONS.length;

  return (
    <QAContext.Provider
      value={{ answers, handleSelect, restart, selected, toggleCapability, selectedItems, complete }}
    >
      {children}
    </QAContext.Provider>
  );
}

export function useQA() {
  return useContext(QAContext);
}