import { BookOpen } from "lucide-react";
import { PageLayout } from "@/components/shared/PageLayout";
import { TheoryConcepts } from "./TheoryConcepts";
import { TheoryQuiz } from "./TheoryQuiz";

export function TheoryPage() {
  return (
    <PageLayout
      icon={BookOpen}
      title="Undergraduate RL Theory & Interactive Self-Check"
      hideActionGate
    >
      <div className="space-y-4 max-w-5xl mx-auto w-full">
        <TheoryConcepts />
        <TheoryQuiz />
      </div>
    </PageLayout>
  );
}
