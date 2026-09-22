import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MODULES, IEP_MINORS, industryById } from "@/data/selectorData";
import YearSections from "@/components/info/YearSections";

const MINOR_IDS = new Set(IEP_MINORS.map((m) => m.id));
const ALL_ITEMS = [...MODULES, ...IEP_MINORS];
const itemById = (id) => ALL_ITEMS.find((m) => m.id === id);

export default function ModuleExplorer() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("module");
  const [activeId, setActiveId] = useState(
    initial && itemById(initial) ? initial : MODULES[0].id
  );
  const detailRef = useRef(null);

  useEffect(() => {
    const m = params.get("module");
    if (m && itemById(m)) setActiveId(m);
  }, [params]);

  const active = itemById(activeId) || MODULES[0];
  const isMinor = MINOR_IDS.has(activeId);

  const select = (id) => {
    setActiveId(id);
    setParams({ module: id }, { replace: true });
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const groups = [
    ...[1, 2, 3, 4]
      .map((year) => ({ year, items: MODULES.filter((m) => m.year === year) }))
      .filter((g) => g.items.length > 0),
    { label: "IEP Minors", unit: "minors", items: IEP_MINORS },
  ];

  const renderItem = (m) => (
    <button
      key={m.id}
      onClick={() => select(m.id)}
      className={`w-full text-left py-3 flex items-center gap-3 transition-colors ${
        m.id === activeId ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {!MINOR_IDS.has(m.id) && (
        <span className="text-xs tracking-[0.15em] text-accent-deep font-medium shrink-0">{m.id}</span>
      )}
      <span className="text-base font-medium truncate">{m.name}</span>
      <span className={`ml-auto text-accent transition-opacity ${m.id === activeId ? "opacity-100" : "opacity-0"}`}>→</span>
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">Modules</h3>
          <div className="flex-1 ghost-line h-px" />
        </div>
        <YearSections groups={groups} renderItem={renderItem} />
      </div>

      <div className="lg:col-span-7" ref={detailRef}>
        <div className="lg:sticky lg:top-10">
          {active.lead && (
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Module lead: {active.lead}
            </p>
          )}

          {isMinor ? (
            <p className="text-xs tracking-[0.2em] uppercase text-accent-deep font-medium mb-2">IEP Minor</p>
          ) : (
            <p className="text-xs tracking-[0.2em] uppercase text-accent-deep font-medium mb-2">{active.id}</p>
          )}
          <h2 className="font-display text-3xl md:text-4xl leading-[1.1] mb-6">{active.name}</h2>

          <section className="mb-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">What you learn</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{active.learn.join(", ")}.</p>
          </section>

          <section className="mb-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Skills you get</p>
            <div className="flex flex-wrap gap-2">
              {active.skills.map((s) => (
                <span key={s} className="text-sm px-3 py-1.5 border border-border text-foreground/80">{s}</span>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Industries this applies to</p>
            {active.industries.length === 0 ? (
              <p className="text-sm text-muted-foreground leading-relaxed">Project dependent.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {active.industries.map((indId) => {
                  const ind = industryById(indId);
                  if (!ind) return null;
                  return (
                    <a
                      key={indId}
                      href={`/industry-information?industry=${ind.id}`}
                      className="text-sm px-3 py-1.5 border border-border text-foreground/80 hover:border-accent hover:text-accent-deep transition-colors"
                    >
                      {ind.name} →
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}