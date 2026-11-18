import { LogoNeuralNet } from "./LogoNeuralNet";

const PLAY_PATH = [
  "M13.5 11.7C13.5 10.9 14.4 10.4 15.1 10.8L21.2 14.7",
  "C21.8 15.1 21.8 16.0 21.2 16.4L15.1 20.3C14.4 20.7 13.5 20.2 13.5 19.4V11.7Z",
].join("");

export function LogoGraphic() {
  return (
    <>
      <rect width="32" height="32" rx="8" fill="url(#mlp-bg-grad)" />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="7.25"
        fill="none"
        stroke="hsl(var(--primary-foreground))"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <LogoNeuralNet />
      <path d={PLAY_PATH} fill="url(#mlp-play-grad)" />
      <circle cx="8" cy="9.5" r="2" fill="hsl(var(--primary-foreground))" />
      <circle cx="8" cy="22.5" r="2" fill="hsl(var(--primary-foreground))" />
      <circle cx="23" cy="9.5" r="2" fill="hsl(var(--primary-foreground))" />
      <circle cx="23" cy="22.5" r="2" fill="hsl(var(--primary-foreground))" />
      <circle
        cx="14"
        cy="16"
        r="1.5"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="0.8"
      />
    </>
  );
}
