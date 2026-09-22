import React from "react";
import AppHeader from "@/components/AppHeader";
import IndustryExplorer from "@/components/info/IndustryExplorer";

export default function IndustryInformation() {
  return (
    <div className="relative min-h-screen bg-background">
      <AppHeader />
      <main className="pt-16">
        <div className="px-6 md:px-16 lg:px-24 py-10 max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-2xl">
              Industry Information
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              Choose an industry to see what the work involves, the skills you'll need, live job listings, and the modules that are most relevant.
            </p>
          </div>
          <IndustryExplorer />
        </div>
      </main>
    </div>
  );
}