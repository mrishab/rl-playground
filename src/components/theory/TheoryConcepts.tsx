import { TheoryConceptMDP } from "./TheoryConceptMDP";
import { TheoryConceptBellman } from "./TheoryConceptBellman";
import { TheoryConceptTD } from "./TheoryConceptTD";
import { TheoryConceptBandits } from "./TheoryConceptBandits";

export function TheoryConcepts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TheoryConceptMDP />
      <TheoryConceptBellman />
      <TheoryConceptTD />
      <TheoryConceptBandits />
    </div>
  );
}
