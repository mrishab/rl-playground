import type {
  ControllerMode,
  GameHyperparameters,
  LemonadeState,
  WeatherType,
} from "./types";

export const PREP_ACTIONS = [10, 20, 30, 40, 50, 60, 70];

const WEATHER_CONFIG: Record<
  WeatherType,
  { mean: number; std: number; min: number; max: number; icon: string }
> = {
  Rainy: { mean: 12, std: 4, min: 5, max: 20, icon: "🌧️" },
  Cloudy: { mean: 26, std: 5, min: 15, max: 36, icon: "⛅" },
  Sunny: { mean: 44, std: 6, min: 30, max: 55, icon: "☀️" },
  Heatwave: { mean: 62, std: 7, min: 46, max: 75, icon: "🔥" },
};

const WEATHER_TRANSITIONS: Record<
  WeatherType,
  { next: WeatherType; prob: number }[]
> = {
  Rainy: [
    { next: "Rainy", prob: 0.4 },
    { next: "Cloudy", prob: 0.45 },
    { next: "Sunny", prob: 0.15 },
  ],
  Cloudy: [
    { next: "Rainy", prob: 0.2 },
    { next: "Cloudy", prob: 0.4 },
    { next: "Sunny", prob: 0.4 },
  ],
  Sunny: [
    { next: "Sunny", prob: 0.55 },
    { next: "Heatwave", prob: 0.25 },
    { next: "Cloudy", prob: 0.2 },
  ],
  Heatwave: [
    { next: "Heatwave", prob: 0.35 },
    { next: "Sunny", prob: 0.45 },
    { next: "Cloudy", prob: 0.2 },
  ],
};

export class LemonadeEngine {
  state: LemonadeState;
  hyperparams: GameHyperparameters;
  // Q-Table: Map<WeatherType, number[]> for each prep action
  qTable: Map<WeatherType, number[]> = new Map();

  constructor(hyperparams?: Partial<GameHyperparameters>) {
    this.hyperparams = {
      learningRate: 0.2,
      discountFactor: 0.9,
      explorationRate: 0.2,
      epsilonDecay: 0.995,
      algorithm: "q-learning",
      ...hyperparams,
    };
    this.state = this.createInitialState();
  }

  createInitialState(): LemonadeState {
    const weather: WeatherType = "Sunny";
    const forecast = this.sampleNextWeather(weather);
    return {
      day: 1,
      weather,
      forecastTomorrow: forecast,
      cupsPrepped: 30,
      customerDemand: 0,
      cupsSold: 0,
      cupsSpoiled: 0,
      customersLost: 0,
      dailyProfit: 0,
      cashBalance: 150,
      totalRevenue: 0,
      totalSpoilageCost: 0,
      totalStockoutLost: 0,
      lastReward: 0,
      isOver: false,
      controller: "rl",
      learnedPolicy: {
        Rainy: 10,
        Cloudy: 30,
        Sunny: 40,
        Heatwave: 60,
      },
    };
  }

  setController(controller: ControllerMode): void {
    this.state.controller = controller;
  }

  resetEpisode(): void {
    const controller = this.state.controller;
    this.state = {
      ...this.createInitialState(),
      controller,
      learnedPolicy: this.deriveLearnedPolicy(),
    };
  }

  resetAll(): void {
    this.qTable.clear();
    const controller = this.state.controller;
    this.state = this.createInitialState();
    this.state.controller = controller;
  }

  sampleNextWeather(current: WeatherType): WeatherType {
    const transitions = WEATHER_TRANSITIONS[current];
    const rand = Math.random();
    let cumulative = 0;
    for (const t of transitions) {
      cumulative += t.prob;
      if (rand <= cumulative) return t.next;
    }
    return transitions[transitions.length - 1].next;
  }

  sampleDemand(weather: WeatherType): number {
    const cfg = WEATHER_CONFIG[weather];
    // Box-Muller gaussian
    const u1 = Math.max(1e-6, Math.random());
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const sampled = Math.round(cfg.mean + z * cfg.std);
    return Math.max(cfg.min, Math.min(cfg.max, sampled));
  }

  getQValues(weather: WeatherType): number[] {
    let q = this.qTable.get(weather);
    if (!q) {
      q = PREP_ACTIONS.map(() => 0);
      this.qTable.set(weather, q);
    }
    return q;
  }

  selectPrepActionRL(weather: WeatherType, explore = true): number {
    const q = this.getQValues(weather);
    if (explore && Math.random() < this.hyperparams.explorationRate) {
      return Math.floor(Math.random() * PREP_ACTIONS.length);
    }
    let maxVal = -Infinity;
    const best: number[] = [];
    for (let a = 0; a < PREP_ACTIONS.length; a++) {
      if (q[a] > maxVal) {
        maxVal = q[a];
        best.length = 0;
        best.push(a);
      } else if (q[a] === maxVal) {
        best.push(a);
      }
    }
    return best[Math.floor(Math.random() * best.length)];
  }

  selectPrepActionSearch(): number {
    // Search / Static CSP Planner selects a fixed static schedule
    // based on average historical demand across all weathers (~35 cups).
    // PREP_ACTIONS[2] is 30 or PREP_ACTIONS[3] is 40.
    return 2; // Fixed 30 cups static plan
  }

  deriveLearnedPolicy(): Record<WeatherType, number> {
    const weathers: WeatherType[] = ["Rainy", "Cloudy", "Sunny", "Heatwave"];
    const policy: Partial<Record<WeatherType, number>> = {};
    for (const w of weathers) {
      const q = this.getQValues(w);
      let bestIdx = 0;
      let maxVal = -Infinity;
      for (let i = 0; i < q.length; i++) {
        if (q[i] > maxVal) {
          maxVal = q[i];
          bestIdx = i;
        }
      }
      policy[w] = PREP_ACTIONS[bestIdx];
    }
    return policy as Record<WeatherType, number>;
  }

  step(actionOverride?: number): { reward: number; done: boolean } {
    const s = this.state;
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    const weather = s.weather;

    let actionIdx: number;
    if (actionOverride !== undefined) {
      actionIdx = actionOverride;
    } else if (s.controller === "search") {
      actionIdx = this.selectPrepActionSearch();
    } else {
      actionIdx = this.selectPrepActionRL(weather, true);
    }

    const prepped = PREP_ACTIONS[actionIdx];
    const demand = this.sampleDemand(weather);

    const sold = Math.min(prepped, demand);
    const spoiled = Math.max(0, prepped - demand);
    const lostCustomers = Math.max(0, demand - prepped);

    const prepCost = prepped * 0.5;
    const revenue = sold * 1.5;
    const profit = revenue - prepCost;
    // Lost customers penalty (dissatisfaction and lost profit)
    const stockoutPenalty = lostCustomers * 0.3;
    const reward = profit - stockoutPenalty;

    s.cupsPrepped = prepped;
    s.customerDemand = demand;
    s.cupsSold = sold;
    s.cupsSpoiled = spoiled;
    s.customersLost = lostCustomers;
    s.dailyProfit = Number(profit.toFixed(2));
    s.cashBalance = Math.max(0, Number((s.cashBalance + profit).toFixed(2)));
    s.totalRevenue += revenue;
    s.totalSpoilageCost += spoiled * 0.5;
    s.totalStockoutLost += lostCustomers * 1.0;
    s.lastReward = Number(reward.toFixed(2));

    // Transition to next day & weather
    const nextWeather = s.forecastTomorrow;
    s.weather = nextWeather;
    s.forecastTomorrow = this.sampleNextWeather(nextWeather);
    s.day += 1;

    // 30 days per season episode
    const done = s.day > 30 || s.cashBalance <= 0;
    s.isOver = done;

    // RL Q-update
    const currentQ = this.getQValues(weather);
    const nextQ = this.getQValues(nextWeather);
    const target = done
      ? reward
      : reward +
        this.hyperparams.discountFactor *
          (this.hyperparams.algorithm === "sarsa"
            ? nextQ[this.selectPrepActionRL(nextWeather, true)]
            : Math.max(...nextQ));

    currentQ[actionIdx] +=
      this.hyperparams.learningRate * (target - currentQ[actionIdx]);

    s.learnedPolicy = this.deriveLearnedPolicy();

    return { reward, done };
  }

  trainBatch(episodes: number): {
    episodes: number;
    wins: number;
    avgReward: number;
  } {
    let profitableSeasons = 0;
    let totalReward = 0;
    let totalDays = 0;
    const prevController = this.state.controller;
    this.state.controller = "rl";

    for (let e = 0; e < episodes; e++) {
      this.resetEpisode();
      while (!this.state.isOver && this.state.day <= 30) {
        const { reward, done } = this.step();
        totalReward += reward;
        totalDays++;
        if (done) break;
      }

      if (this.state.cashBalance > 150) {
        profitableSeasons++;
      }

      this.hyperparams.explorationRate = Math.max(
        0.02,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    this.state.controller = prevController;
    return {
      episodes,
      wins: profitableSeasons,
      avgReward: totalDays > 0 ? totalReward / totalDays : 0,
    };
  }
}
