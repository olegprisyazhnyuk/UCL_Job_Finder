import React from "react";
import { motion } from "framer-motion";
import { MODULES, IEP_MINORS, industryById } from "@/data/selectorData";
import { useQA } from "@/lib/QAContext";
import YearSections from "@/components/info/YearSections";

const YEAR_MAP = { year1: 1, year2: 2, year3: 3, year4: 4 };
const MINOR_IDS = new Set(IEP_MINORS.map((m) => m.id));
const ALL_ITEMS = [...MODULES, ...IEP_MINORS];

const searchText = (m) =>
  [m.name, ...(Array.isArray(m.learn) ? m.learn : [m.learn])].join(" ").toLowerCase();

export default function SelectorCanvas({ selected, onToggle, query = "" }) {
  const { answers } = useQA();
  const maxYear = YEAR_MAP[answers?.year];

  const yearFiltered = maxYear ? MODULES.filter((m) => m.year <= maxYear) : MODULES;

  const q = (query || "").toLowerCase().trim();
  const visibleModules = q
    ? yearFiltered.filter((m) => searchText(m).includes(q))
    : yearFiltered;
  const visibleMinors = q
    ? IEP_MINORS.filter((m) => searchText(m).includes(q))
    : IEP_MINORS;

  const activePanels = ALL_ITEMS.filter((m) => selected.includes(m.id));

  const groups = [
    ...[...new Set(visibleModules.map((m) => m.year))]
      .sort((a, b) => a - b)
      .map((year) => ({ year, items: visibleModules.filter((m) => m.year === year) })),
    ...(visibleMinors.length > 0
      ? [{ label: "IEP Minors", unit: "minors", items: visibleMinors }]
      : []),
  ];

  const renderItem = (mod) => {
    const active = selected.includes(mod.id);
    return (
      <button
        key={mod.id}
        onClick={() => onToggle(mod.id)}
        className={`text-left px-5 py-3 rounded-none border text-sm transition-all duration-300 flex items-center gap-3 ${
          active
            ? "bg-foreground text-background border-foreground"
            : "bg-background text-foreground border-border hover:border-foreground"
        }`}
      >
        <span className="font-medium truncate flex-1">
          {MINOR_IDS.has(mod.id) ? mod.name : `${mod.id} — ${mod.name}`}
        </span>
        {active && <span className="text-accent shrink-0">✓</span>}
      </button>
    );
  };

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-24 py-10">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Job Finder</p>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-2xl">
          Select your 4 favourite modules.
        </h1>
        {maxYear && (
          <p className="text-xs text-accent-deep mt-3 tracking-wide">
            Showing modules up to Year {maxYear}.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7">
          {visibleModules.length === 0 && visibleMinors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No modules match "{query}".</p>
          ) : (
            <YearSections groups={groups} renderItem={renderItem} />
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-10">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
                Module Details
              </h3>
              <div className="flex-1 ghost-line h-px" />
            </div>

            {activePanels.length === 0 ? (
              <div className="border border-dashed border-border p-10 text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Select a module on the left.
                  <br />
                  The information that matters will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activePanels.map((panel, i) => (
                  <motion.div
                    key={panel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: i * 0.05 }}
                    className="border border-border bg-card overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-5 border-b border-border">
                      <h4 className="text-base font-medium">
                        {MINOR_IDS.has(panel.id) ? panel.name : `${panel.id} — ${panel.name}`}
                      </h4>
                    </div>
                    <div className="px-5 pb-6 pt-4">
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        {(Array.isArray(panel.learn) ? panel.learn : [panel.learn]).join(", ")}.
                      </p>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Skills you get</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {panel.skills.map((s) => (
                          <span key={s} className="text-xs px-3 py-1 border border-border text-foreground/80">{s}</span>
                        ))}
                      </div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Applies to industries</p>
                      {panel.industries.length === 0 ? (
                        <p className="text-xs text-muted-foreground leading-relaxed">Project dependent.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {panel.industries.map((indId) => {
                            const ind = industryById(indId);
                            return ind ? (
                              <span key={indId} className="text-xs px-3 py-1 border border-border text-foreground/80">{ind.name}</span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}