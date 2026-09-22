import React from "react";
import AppHeader from "@/components/AppHeader";
import ModuleExplorer from "@/components/info/ModuleExplorer";

export default function ModuleInformation() {
  return (
    <div className="relative min-h-screen bg-background">
      <AppHeader />
      <main className="pt-16">
        <div className="px-6 md:px-16 lg:px-24 py-10 max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-2xl">
              Module Information
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              Pick a module to see what you learn, the skills you gain, and the industries it can take you into.
            </p>
          </div>
          <ModuleExplorer />
        </div>
      </main>
    </div>
  );
}