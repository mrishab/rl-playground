export function LogoGradients() {
  return (
    <defs>
      <linearGradient
        id="mlp-bg-grad"
        x1="2"
        y1="2"
        x2="30"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--primary))" />
        <stop offset="0.5" stopColor="hsl(var(--info))" />
        <stop offset="1" stopColor="hsl(var(--success))" />
      </linearGradient>
      <linearGradient
        id="mlp-play-grad"
        x1="13"
        y1="11"
        x2="22"
        y2="21"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--primary-foreground))" />
        <stop offset="1" stopColor="hsl(var(--primary) / 0.8)" />
      </linearGradient>
    </defs>
  );
}
