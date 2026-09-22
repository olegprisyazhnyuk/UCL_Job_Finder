import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AppHeader from "@/components/AppHeader";
import { CAREERS, QUESTIONS, moduleById, selectableById } from "@/data/selectorData";
import { useQA } from "@/lib/QAContext";

export default function Results() {
  const { answers, selectedItems, restart } = useQA();
  const navigate = useNavigate();
  const [openCareer, setOpenCareer] = useState(null);

  const answerLines = Object.entries(answers).map(([qid, val]) => {
    const q = QUESTIONS.find((q) => q.id === qid);
    const opt = q?.options.find((o) => o.value === val);
    return { question: q?.prompt, label: opt?.label };
  });

  const handleRestart = () => {
    restart();
    navigate("/");
  };

  const selectedIds = selectedItems.map((m) => m.id);

  const matchColor = (pct) => `hsl(${pct * 1.2}, 65%, 38%)`;
  const matchLevel = (pct) => (pct > 75 ? "High" : pct >= 50 ? "Medium" : "Low");

  const ranked = CAREERS
    .map((c) => {
      const overlap = selectedIds.filter((id) => {
        const item = selectableById(id);
        return item && item.industries && item.industries.includes(c.id);
      }).length;
      return { ...c, overlap, pct: selectedIds.length ? Math.round((overlap / selectedIds.length) * 100) : 0 };
    })
    .filter((c) => c.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);

  return (
    <div className="relative min-h-screen bg-background">
      <main className="pt-16 px-6 md:px-16 lg:px-24 py-12 max-w-6xl mx-auto">
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mb-4">Your results.</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-12 leading-relaxed">
          These directions overlap most with the modules you selected. Tap any career to see why it was suggested and what it asks of you.
        </p>

        {/* Career options ranked by overlap */}
        {selectedIds.length === 0 ? (
          <div className="border border-dashed border-border p-10 text-center mb-16">
            <p className="text-muted-foreground text-sm leading-relaxed">
              You haven't selected any modules yet. Head to Job Finder to choose the modules you enjoy.
            </p>
            <Link to="/job-finder" className="inline-block mt-4 text-sm text-accent-deep underline underline-offset-4">Go to Job Finder</Link>
          </div>
        ) : ranked.length === 0 ? (
          <div className="border border-dashed border-border p-10 text-center mb-16">
            <p className="text-muted-foreground text-sm leading-relaxed">
              No careers strongly match your current selection — try adding more modules in Job Finder.
            </p>
          </div>
        ) : (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">Career Options</h2>
              <div className="flex-1 ghost-line h-px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {ranked.map((career, i) => (
                <button
                  key={career.id}
                  onClick={() => setOpenCareer(career)}
                  className="group text-left bg-background p-8 pulse-hover border-0 flex flex-col h-full"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-medium group-hover:text-accent-deep transition-colors">{career.title}</h3>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-accent-deep font-medium">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{career.why}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs">
                      <span className="font-semibold" style={{ color: matchColor(career.pct) }}>
                        {matchLevel(career.pct)}
                      </span>{" "}
                      <span className="text-muted-foreground">match</span>
                    </span>
                    <span className="text-sm text-foreground group-hover:text-accent-deep transition-colors">Find out more →</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Chosen modules summary */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">Your Chosen Modules</h2>
            <div className="flex-1 ghost-line h-px" />
          </div>
          {selectedItems.length === 0 ? (
            <div className="border border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground text-sm leading-relaxed">You haven't selected any modules yet.</p>
              <Link to="/job-finder" className="inline-block mt-4 text-sm text-accent-deep underline underline-offset-4">Go to Job Finder</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {selectedItems.map((m, i) => (
                <li key={m.id} className="py-4">
                  <Link to={`/module-information?module=${m.id}`} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-accent-deep font-medium">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-base font-medium group-hover:text-accent-deep transition-colors">{m.id} — {m.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-accent-deep transition-colors">View module →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Answers recap */}
        {answerLines.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">Your Answers</h2>
              <div className="flex-1 ghost-line h-px" />
            </div>
            <ul className="space-y-4">
              {answerLines.map((a) => (
                <li key={a.question} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                  <span className="text-sm text-muted-foreground sm:w-1/2">{a.question}</span>
                  <span className="text-base font-medium sm:w-1/2">{a.label}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
          <button onClick={handleRestart} className="bg-foreground text-background px-6 py-3 text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors">Start Over</button>
          <Link to="/job-finder" className="border border-border px-6 py-3 text-sm font-medium tracking-wide hover:border-foreground transition-colors text-center">Back to Job Finder</Link>
        </div>
      </main>

      {/* Career detail popup */}
      <Dialog open={!!openCareer} onOpenChange={(o) => !o && setOpenCareer(null)}>
        <DialogContent className="max-w-lg p-8">
          {openCareer && (
            <>
              <DialogHeader className="space-y-4">
                <DialogTitle className="font-display text-3xl leading-snug">{openCareer.title}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  {openCareer.why}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Specific skills you need</p>
                  <div className="flex flex-wrap gap-2">
                    {openCareer.skills.map((s) => (
                      <span key={s} className="text-sm px-3 py-1.5 border border-border text-foreground/80">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Relevant modules</p>
                  <div className="flex flex-wrap gap-2">
                    {openCareer.modules.map((modId) => {
                      const mod = moduleById(modId);
                      if (!mod) return null;
                      const matched = selectedIds.includes(modId);
                      return (
                        <Link
                          key={modId}
                          to={`/module-information?module=${mod.id}`}
                          onClick={() => setOpenCareer(null)}
                          className={`text-sm px-3 py-1.5 border transition-colors ${
                            matched
                              ? "border-accent text-accent-deep bg-secondary"
                              : "border-border text-foreground/80 hover:border-accent hover:text-accent-deep"
                          }`}
                        >
                          {mod.name} →
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}