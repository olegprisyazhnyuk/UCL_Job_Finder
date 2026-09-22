import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { INDUSTRIES, moduleById, jobById } from "@/data/selectorData";

export default function IndustryExplorer() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("industry");
  const [activeId, setActiveId] = useState(
    initial && INDUSTRIES.some((i) => i.id === initial) ? initial : INDUSTRIES[0].id
  );
  const [openJobId, setOpenJobId] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    const i = params.get("industry");
    if (i && INDUSTRIES.some((ind) => ind.id === i)) setActiveId(i);
  }, [params]);

  const active = INDUSTRIES.find((i) => i.id === activeId) || INDUSTRIES[0];
  const openJob = openJobId ? jobById(openJobId) : null;

  const select = (id) => {
    setActiveId(id);
    setParams({ industry: id }, { replace: true });
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">Industries</h3>
          <div className="flex-1 ghost-line h-px" />
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {INDUSTRIES.map((i) => (
            <li key={i.id}>
              <button
                onClick={() => select(i.id)}
                className={`w-full text-left py-4 flex items-center gap-3 transition-colors ${
                  i.id === activeId ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-base font-medium">{i.name}</span>
                <span className={`ml-auto text-accent transition-opacity ${i.id === activeId ? "opacity-100" : "opacity-0"}`}>→</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-7" ref={detailRef}>
        <div className="lg:sticky lg:top-10">
          <h2 className="font-display text-3xl md:text-4xl leading-[1.1] mb-6">{active.name}</h2>

          <section className="mb-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">What you do</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{active.whatYouDo}</p>
          </section>

          <section className="mb-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Skills needed</p>
            <div className="flex flex-wrap gap-2">
              {active.skillsNeeded.map((s) => (
                <span key={s} className="text-sm px-3 py-1.5 border border-border text-foreground/80">{s}</span>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Job listings</p>
            <div className="flex flex-col gap-2">
              {active.jobListings.map((jobId, idx) => {
                const job = jobById(jobId);
                if (!job) return null;
                return (
                  <button
                    key={`${jobId}-${idx}`}
                    onClick={() => setOpenJobId(jobId)}
                    className="text-left text-sm px-4 py-3 bg-foreground text-background border border-foreground hover:bg-accent-deep hover:border-accent-deep transition-colors flex items-center justify-between group"
                  >
                    <span>{job.label}</span>
                    <span className="opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Relevant modules</p>
            <div className="flex flex-wrap gap-2">
              {active.modules.map((modId) => {
                const mod = moduleById(modId);
                if (!mod) return null;
                return (
                  <a
                    key={modId}
                    href={`/module-information?module=${mod.id}`}
                    className="text-sm px-3 py-1.5 border border-border text-foreground/80 hover:border-accent hover:text-accent-deep transition-colors"
                  >
                    {mod.name} →
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <Dialog open={!!openJob} onOpenChange={(o) => !o && setOpenJobId(null)}>
        <DialogContent className="max-w-lg p-8 max-h-[85vh] overflow-y-auto">
          {openJob && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="font-display text-2xl leading-snug">{openJob.label}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Job description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{openJob.description}</p>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Responsibilities</p>
                  <ul className="space-y-2">
                    {openJob.responsibilities.map((r) => (
                      <li key={r} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-accent shrink-0">—</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Requirements</p>
                  <ul className="space-y-2">
                    {openJob.requirements.map((r) => (
                      <li key={r} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-accent shrink-0">—</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={openJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-foreground text-background px-5 py-2.5 text-sm font-medium tracking-wide hover:bg-accent-deep transition-colors"
                >
                  Apply / View listing →
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}