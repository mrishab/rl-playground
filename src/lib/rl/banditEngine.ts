import type { BanditArm, BanditRunConfig, BanditStepResult } from "./types";

export function sampleNormal(mean: number = 0, stdDev: number = 1): number {
  // Box-Muller transform
  const u1 = Math.max(1e-15, Math.random());
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * stdDev;
}

export class BanditEngine {
  config: BanditRunConfig;
  arms: BanditArm[] = [];
  stepCount: number = 0;
  cumulativeReward: number = 0;
  optimalActionPicks: number = 0;
  history: BanditStepResult[] = [];

  constructor(config?: Partial<BanditRunConfig>) {
    this.config = {
      numArms: config?.numArms ?? 10,
      algorithm: config?.algorithm ?? "epsilon-greedy",
      epsilon: config?.epsilon ?? 0.1,
      c: config?.c ?? 2.0,
      initialQ: config?.initialQ ?? 0.0,
      isStationary: config?.isStationary ?? true,
      driftStdDev: config?.driftStdDev ?? 0.01,
    };
    this.reset();
  }

  updateConfig(patch: Partial<BanditRunConfig>): void {
    this.config = { ...this.config, ...patch };
  }

  reset(): void {
    this.stepCount = 0;
    this.cumulativeReward = 0;
    this.optimalActionPicks = 0;
    this.history = [];
    this.arms = [];

    // Initialize arms with standard normal distributed true means
    for (let i = 0; i < this.config.numArms; i++) {
      this.arms.push({
        id: i,
        trueMean: sampleNormal(0, 1),
        variance: 1,
        pulls: 0,
        estimatedValue:
          this.config.algorithm === "optimistic-initial"
            ? this.config.initialQ || 5.0
            : 0.0,
        successes: 1,
        failures: 1,
      });
    }
    this.updateArmStats();
  }

  updateArmStats(): void {
    const totalPulls = Math.max(1, this.stepCount);
    const c = this.config.c;
    for (const arm of this.arms) {
      if (arm.pulls === 0) {
        arm.ucbBonus = Infinity;
        arm.ucbScore = Infinity;
        arm.posteriorMean = arm.estimatedValue;
        arm.posteriorStd = 1.0;
      } else {
        const bonus = c * Math.sqrt(Math.log(totalPulls) / arm.pulls);
        arm.ucbBonus = bonus;
        arm.ucbScore = arm.estimatedValue + bonus;
        arm.posteriorMean = arm.estimatedValue;
        arm.posteriorStd = 1.0 / Math.sqrt(arm.pulls);
      }
    }
  }

  getOptimalArmIndex(): number {
    let maxMean = -Infinity;
    let bestArm = 0;
    for (let i = 0; i < this.arms.length; i++) {
      if (this.arms[i].trueMean > maxMean) {
        maxMean = this.arms[i].trueMean;
        bestArm = i;
      }
    }
    return bestArm;
  }

  selectArm(): number {
    const { algorithm, epsilon, c } = this.config;

    if (algorithm === "pure-greedy") {
      let maxQ = -Infinity;
      let candidates: number[] = [];
      for (let i = 0; i < this.arms.length; i++) {
        const val = this.arms[i].estimatedValue;
        if (val > maxQ) {
          maxQ = val;
          candidates = [i];
        } else if (Math.abs(val - maxQ) < 1e-6) {
          candidates.push(i);
        }
      }
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    if (algorithm === "epsilon-greedy" || algorithm === "optimistic-initial") {
      const currentEps = algorithm === "optimistic-initial" ? 0 : epsilon;
      if (Math.random() < currentEps) {
        return Math.floor(Math.random() * this.arms.length);
      }
      let maxQ = -Infinity;
      let candidates: number[] = [];
      for (let i = 0; i < this.arms.length; i++) {
        const val = this.arms[i].estimatedValue;
        if (val > maxQ) {
          maxQ = val;
          candidates = [i];
        } else if (Math.abs(val - maxQ) < 1e-6) {
          candidates.push(i);
        }
      }
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    if (algorithm === "ucb1") {
      // Arms never pulled get infinite priority, broken uniformly at random
      const unpulled = this.arms.filter((a) => a.pulls === 0);
      if (unpulled.length > 0) {
        return unpulled[Math.floor(Math.random() * unpulled.length)].id;
      }
      const totalPulls = Math.max(1, this.stepCount);
      let maxUpper = -Infinity;
      let best = 0;
      for (let i = 0; i < this.arms.length; i++) {
        const arm = this.arms[i];
        const ucbBonus = c * Math.sqrt(Math.log(totalPulls) / arm.pulls);
        const upper = arm.estimatedValue + ucbBonus;
        if (upper > maxUpper) {
          maxUpper = upper;
          best = i;
        }
      }
      return best;
    }

    if (algorithm === "thompson-sampling") {
      // Gaussian Thompson Sampling
      let maxSample = -Infinity;
      let best = 0;
      for (let i = 0; i < this.arms.length; i++) {
        const arm = this.arms[i];
        const std = 1.0 / Math.sqrt(Math.max(1, arm.pulls));
        const sample = sampleNormal(arm.estimatedValue, std);
        if (sample > maxSample) {
          maxSample = sample;
          best = i;
        }
      }
      return best;
    }

    return 0;
  }

  step(): BanditStepResult {
    const chosenArmIdx = this.selectArm();
    return this.pullArm(chosenArmIdx);
  }

  pullArm(chosenArmIdx: number): BanditStepResult {
    this.stepCount++;
    const arm = this.arms[chosenArmIdx];

    // Sample reward from arm distribution
    const reward = sampleNormal(arm.trueMean, 1.0);
    this.cumulativeReward += reward;

    const optimalArmIdx = this.getOptimalArmIndex();
    const isOptimal = chosenArmIdx === optimalArmIdx;
    if (isOptimal) this.optimalActionPicks++;

    // Step size: constant alpha for optimistic-initial & non-stationary; 1/n for sample-average
    arm.pulls++;
    const useConstantAlpha =
      this.config.alpha !== undefined
        ? true
        : this.config.algorithm === "optimistic-initial" ||
          !this.config.isStationary;
    const alpha = this.config.alpha ?? 0.1;
    const stepSize = useConstantAlpha ? alpha : 1.0 / arm.pulls;
    arm.estimatedValue += stepSize * (reward - arm.estimatedValue);

    // Non-stationary drift if configured
    if (!this.config.isStationary) {
      for (const a of this.arms) {
        a.trueMean += sampleNormal(0, this.config.driftStdDev);
      }
    }

    this.updateArmStats();

    const result: BanditStepResult = {
      step: this.stepCount,
      chosenArm: chosenArmIdx,
      reward,
      isOptimal,
      cumulativeReward: this.cumulativeReward,
      averageReward: this.cumulativeReward / this.stepCount,
    };

    this.history.push(result);
    return result;
  }

  stepBatch(count: number): BanditStepResult[] {
    const batch: BanditStepResult[] = [];
    for (let i = 0; i < count; i++) {
      batch.push(this.step());
    }
    return batch;
  }
}
