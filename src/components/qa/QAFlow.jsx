import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS } from "@/data/selectorData";

export default function QAFlow({ answers, onSelect, onComplete }) {
  const currentIndex = Object.keys(answers).length;
  const isComplete = currentIndex >= QUESTIONS.length;

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 md:px-16 lg:px-24 py-10">
      {/* Progress breadcrumb */}
      <div className="flex items-center gap-3">
        {QUESTIONS.map((q, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={q.id} className="flex items-center gap-3">
              <div
                className={`h-[2px] transition-all duration-700 ${
                  done ? "w-12 bg-accent" : active ? "w-16 bg-foreground" : "w-8 bg-border"
                }`}
              />
            </div>
          );
        })}
        <span className="ml-3 text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
          {Math.min(currentIndex + (isComplete ? 0 : 1), QUESTIONS.length)} / {QUESTIONS.length}
        </span>
      </div>

      {/* Question stage */}
      <div className="flex-1 flex items-center py-16">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {!isComplete && (
              <motion.div
                key={QUESTIONS[currentIndex].id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                  Step {currentIndex + 1}
                </p>
                <h1 className="font-display text-5xl md:text-7xl lg:text-[5vw] leading-[1.05] mb-12 max-w-3xl">
                  {QUESTIONS[currentIndex].prompt}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
                  {QUESTIONS[currentIndex].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onSelect(QUESTIONS[currentIndex].id, opt.value)}
                      className="group bg-background p-8 md:p-10 pulse-hover border-0 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <h3 className="text-xl md:text-2xl font-medium group-hover:text-accent-deep transition-colors">
                          {opt.label}
                        </h3>
                        {opt.hint && (
                          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            {opt.hint}
                          </p>
                        )}
                        <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quiet footer hint */}
      <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-muted-foreground">
        <span>Select an answer to continue</span>
        <span>Q&A</span>
      </div>
    </div>
  );
}