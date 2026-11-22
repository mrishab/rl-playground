export function BellmanEquationsDisplay() {
  return (
    <div className="space-y-2">
      <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground space-y-1">
        <div className="text-[10px] font-sans font-semibold text-primary">
          Bellman Expectation Equations:
        </div>
        <div>
          V<sup>π</sup>(s) = Σ<sub>a</sub> π(a|s) Σ<sub>s&apos;</sub>{" "}
          P(s&apos;|s, a) [R(s, a, s&apos;) + γ V<sup>π</sup>(s&apos;)]
        </div>
        <div>
          Q<sup>π</sup>(s, a) = Σ<sub>s&apos;</sub> P(s&apos;|s, a) [R(s, a,
          s&apos;) + γ Σ<sub>a&apos;</sub> π(a&apos;|s&apos;) Q<sup>π</sup>
          (s&apos;, a&apos;)]
        </div>
      </div>
      <div className="p-2 bg-muted/40 rounded font-mono text-[11px] text-foreground space-y-1">
        <div className="text-[10px] font-sans font-semibold text-primary">
          Bellman Optimality Equations:
        </div>
        <div>
          V*(s) = max<sub>a</sub> Σ<sub>s&apos;</sub> P(s&apos;|s, a) [R(s, a,
          s&apos;) + γ V*(s&apos;)]
        </div>
        <div>
          Q*(s, a) = Σ<sub>s&apos;</sub> P(s&apos;|s, a) [R(s, a, s&apos;) + γ
          max<sub>a&apos;</sub> Q*(s&apos;, a&apos;)]
        </div>
      </div>
    </div>
  );
}
