import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// Renders items grouped by year (or a labelled group such as IEP Minors).
// When only one group is present, lists flat; otherwise each group is a
// collapsible dropdown.
export default function YearSections({ groups, renderItem }) {
  if (groups.length <= 1) {
    return <div className="flex flex-col gap-2">{groups[0].items.map(renderItem)}</div>;
  }
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <YearSection
          key={g.label || g.year}
          label={g.label || `Year ${g.year}`}
          unit={g.unit || "modules"}
          items={g.items}
          renderItem={renderItem}
        />
      ))}
    </div>
  );
}

function YearSection({ label, unit, items, renderItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-secondary/40 hover:bg-secondary/70 transition-colors"
      >
        <span className="text-sm font-medium">{label}</span>
        <span className="flex items-center gap-3 text-xs text-muted-foreground">
          {items.length} {unit}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && <div className="p-3 flex flex-col gap-2">{items.map(renderItem)}</div>}
    </div>
  );
}