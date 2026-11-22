export function computeChartPath(data: number[]) {
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = Math.max(1e-4, maxVal - minVal);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 92 - ((v - minVal) / range) * 84;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return { minVal, maxVal, pathD: `M ${points.join(" L ")}` };
}
