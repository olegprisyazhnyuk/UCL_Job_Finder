import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SelectorCanvas from "@/components/selector/SelectorCanvas";
import AppHeader from "@/components/AppHeader";
import { useQA } from "@/lib/QAContext";

export default function JobFinder() {
  const { selected, toggleCapability, selectedItems, restart } = useQA();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const selectedLabels = selectedItems.map((m) => m.name);

  return (
    <div className="relative min-h-screen bg-background">
      <AppHeader
        showSearch
        searchValue={query}
        onSearchChange={setQuery}
        showRestart={selected.length > 0}
        onRestart={restart}
      />

      <main className="pt-16">
        <SelectorCanvas selected={selected} onToggle={toggleCapability} query={query} />
      </main>

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-foreground text-background border-t border-foreground"
          >
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-6 md:px-16 lg:px-24 py-5">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-background/50 block">Modules Chosen</span>
                  <span className="text-2xl font-display">{selected.length}</span>
                </div>
                <div className="hidden md:block h-10 w-px bg-background/20" />
                <div className="hidden md:flex flex-wrap gap-2 max-w-md">
                  {selectedLabels.map((l) => (
                    <span key={l} className="text-xs px-3 py-1 border border-background/30 text-background/80">{l}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate("/results")}
                className="bg-accent text-accent-foreground px-6 py-3 text-sm font-medium tracking-wide hover:bg-accent-deep transition-colors"
              >
                View Results
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selected.length > 0 && <div className="h-32" />}
    </div>
  );
}