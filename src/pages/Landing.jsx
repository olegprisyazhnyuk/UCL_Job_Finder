import React from "react";
import { Link } from "react-router-dom";
import QAFlow from "@/components/qa/QAFlow";
import { useQA } from "@/lib/QAContext";
import { QUESTIONS } from "@/data/selectorData";

const PAGES = [
  {
    name: "Job Finder",
    to: "/job-finder",
    description: "Answer a couple of questions, pick the modules you enjoy, and get matched to careers that fit.",
  },
  {
    name: "Module Information",
    to: "/module-information",
    description: "Browse every module on offer. Click one to see what you learn, the skills you gain, and the module's relevant industries.",
  },
  {
    name: "Industry Information",
    to: "/industry-information",
    description: "Explore engineering industries. See what the work involves, the skills you'll need, links to live job listings, and which modules are most relevant.",
  },
];

export default function Landing() {
  const { answers, handleSelect, complete, restart } = useQA();

  return (
    <div className="relative min-h-screen bg-background">
      <main className="pt-16">
        {/* Hero */}
        <section className="px-6 md:px-16 lg:px-24 py-16 md:py-24 max-w-6xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-8 max-w-3xl">
            UCL Careers Helper
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            This tool helps to narrow down decisions over careers based on the modules you enjoy! We hope to eliminate decision fatigue and show what industries might fit you well.
          </p>
        </section>

        {/* Three pages */}
        <section className="px-6 md:px-16 lg:px-24 pb-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs tracking-[0.25em] uppercase text-accent-deep font-medium">Explanation of the three pages</h2>
            <div className="flex-1 ghost-line h-px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {PAGES.map((p, i) => (
              <Link key={p.to} to={p.to} className="group bg-background p-8 pulse-hover flex flex-col h-full">
                <span className="text-[10px] tracking-[0.2em] uppercase text-accent-deep font-medium block mb-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-medium mb-3 md:min-h-[4rem] group-hover:text-accent-deep transition-colors">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
                <span className="inline-block mt-6 text-sm text-foreground group-hover:text-accent-deep transition-colors">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Q&A */}
        <section className="px-6 md:px-16 lg:px-24 pb-24 max-w-6xl mx-auto">
          <div className="ghost-line h-px mb-8" />

          {!complete ? (
            <QAFlow answers={answers} onSelect={handleSelect} />
          ) : (
            <div className="border border-border bg-card p-10 text-center">
              <h3 className="font-display text-3xl md:text-4xl mb-4">Thanks, that's everything we need.</h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                Head to Job Finder to choose the modules you enjoy and see the careers that match.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  to="/job-finder"
                  className="bg-accent text-accent-foreground px-6 py-3 text-sm font-medium tracking-wide hover:bg-accent-deep transition-colors"
                >
                  Go to Job Finder →
                </Link>
                <button
                  onClick={restart}
                  className="border border-border px-6 py-3 text-sm font-medium tracking-wide hover:border-foreground transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}