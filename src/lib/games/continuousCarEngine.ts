import type {
  ContinuousCarState,
  ControllerMode,
  GameHyperparameters,
  NeuralNetworkApproximator,
} from "./types";

export class ContinuousCarEngine {
  width = 320;
  height = 200;
  centerX = 160;
  centerY = 100;
  innerRadius = 45;
  outerRadius = 90;

  state: ContinuousCarState;
  hyperparams: GameHyperparameters;
  searchStepCounter = 0;
  searchDiscreteSteer = 0;

  constructor(hyperparams?: Partial<GameHyperparameters>) {
    this.hyperparams = {
      learningRate: 0.05,
      discountFactor: 0.95,
      explorationRate: 0.1,
      epsilonDecay: 0.998,
      algorithm: "q-learning",
      ...hyperparams,
    };
    this.state = this.createInitialState();
  }

  createInitialNeuralNetwork(): NeuralNetworkApproximator {
    // 4 inputs: [normLeft, normRight, normForward, balanceDiff]
    // 8 hidden neurons
    // Heuristic/learned initialization that biases car away from nearby walls
    const weightsIn: number[][] = [];
    const biasHidden: number[] = [];
    for (let h = 0; h < 8; h++) {
      biasHidden.push(0.0);
      const row: number[] = [];
      for (let i = 0; i < 4; i++) {
        // Small random initial weights
        row.push((Math.random() * 2 - 1) * 0.4);
      }
      weightsIn.push(row);
    }

    // Output steering weights
    const weightsOut: number[] = [];
    for (let h = 0; h < 8; h++) {
      weightsOut.push((Math.random() * 2 - 1) * 0.5);
    }

    // Helpful sensory bias: if left wall is close, steer right (+); if right wall is close, steer left (-)
    weightsIn[0][0] = -1.2; // close left -> negative
    weightsIn[0][1] = 1.2; // close right -> positive
    weightsIn[0][3] = -1.5; // balance diff
    weightsOut[0] = 0.8;

    return {
      weightsIn,
      biasHidden,
      weightsOut,
      biasOut: 0.0,
      hiddenActivations: new Array(8).fill(0),
    };
  }

  createInitialState(): ContinuousCarState {
    const trackMidRadius = (this.innerRadius + this.outerRadius) / 2;
    const startX = this.centerX;
    const startY = this.centerY - trackMidRadius;
    const startAngle = 0; // heading east

    const s: ContinuousCarState = {
      x: startX,
      y: startY,
      angle: startAngle,
      speed: 3.2,
      sensorLeft: 22.5,
      sensorRight: 22.5,
      sensorForward: 60,
      steering: 0,
      lapCount: 0,
      lapProgress: 0,
      isCollided: false,
      isOver: false,
      lastReward: 0,
      controller: "rl",
      neuralNetwork: this.createInitialNeuralNetwork(),
      trackPath: [[startX, startY]],
    };

    const sensors = this.computeSensors(s.x, s.y, s.angle);
    s.sensorLeft = sensors.left;
    s.sensorRight = sensors.right;
    s.sensorForward = sensors.forward;
    return s;
  }

  setController(controller: ControllerMode): void {
    this.state.controller = controller;
  }

  resetEpisode(): void {
    this.searchStepCounter = 0;
    this.searchDiscreteSteer = 0;
    const trackMidRadius = (this.innerRadius + this.outerRadius) / 2;
    const startX = this.centerX;
    const startY = this.centerY - trackMidRadius;
    const startAngle = 0;

    const controller = this.state.controller;
    const nn = this.state.neuralNetwork;
    const laps = this.state.lapCount;

    this.state = {
      ...this.createInitialState(),
      x: startX,
      y: startY,
      angle: startAngle,
      controller,
      neuralNetwork: nn,
      lapCount: laps,
      trackPath: [[startX, startY]],
    };
    const sensors = this.computeSensors(startX, startY, startAngle);
    this.state.sensorLeft = sensors.left;
    this.state.sensorRight = sensors.right;
    this.state.sensorForward = sensors.forward;
  }

  resetAll(): void {
    this.searchStepCounter = 0;
    this.searchDiscreteSteer = 0;
    const controller = this.state.controller;
    this.state = this.createInitialState();
    this.state.controller = controller;
  }

  // Raycast distance from (x, y) along angle until hitting inner or outer track circle
  raycastToWalls(x: number, y: number, rayAngle: number, maxDist = 80): number {
    const dx = Math.cos(rayAngle);
    const dy = Math.sin(rayAngle);
    const stepSize = 1.5;

    for (let dist = 1.0; dist < maxDist; dist += stepSize) {
      const px = x + dx * dist;
      const py = y + dy * dist;
      const dCenter = Math.hypot(px - this.centerX, py - this.centerY);

      // Hit inner track barrier or outer track barrier
      if (dCenter <= this.innerRadius || dCenter >= this.outerRadius) {
        return dist;
      }
    }
    return maxDist;
  }

  computeSensors(
    x: number,
    y: number,
    heading: number,
  ): { left: number; right: number; forward: number } {
    const leftAngle = heading - Math.PI / 4; // -45 deg
    const rightAngle = heading + Math.PI / 4; // +45 deg
    const forwardAngle = heading;

    const left = this.raycastToWalls(x, y, leftAngle);
    const right = this.raycastToWalls(x, y, rightAngle);
    const forward = this.raycastToWalls(x, y, forwardAngle);

    return {
      left: Number(left.toFixed(1)),
      right: Number(right.toFixed(1)),
      forward: Number(forward.toFixed(1)),
    };
  }

  forwardNeuralNetwork(inputs: number[]): {
    steering: number;
    activations: number[];
  } {
    const nn = this.state.neuralNetwork;
    const activations: number[] = [];

    // Hidden layer with tanh activation
    for (let h = 0; h < 8; h++) {
      let sum = nn.biasHidden[h];
      for (let i = 0; i < 4; i++) {
        sum += inputs[i] * nn.weightsIn[h][i];
      }
      activations.push(Math.tanh(sum));
    }
    nn.hiddenActivations = activations;

    // Output layer with tanh scaled to max steering angle [-0.25, +0.25] radians (~14.3 deg)
    let outSum = nn.biasOut;
    for (let h = 0; h < 8; h++) {
      outSum += activations[h] * nn.weightsOut[h];
    }
    const steering = Math.tanh(outSum) * 0.25;
    return { steering, activations };
  }

  selectSteeringRL(explore = true): number {
    const s = this.state;
    const normL = s.sensorLeft / 40.0;
    const normR = s.sensorRight / 40.0;
    const normF = s.sensorForward / 60.0;
    const diff = (s.sensorLeft - s.sensorRight) / 40.0;
    const inputs = [normL, normR, normF, diff];

    const { steering } = this.forwardNeuralNetwork(inputs);

    if (explore && Math.random() < this.hyperparams.explorationRate) {
      // Gaussian steering exploration noise
      const noise = (Math.random() * 2 - 1) * 0.12;
      return Math.max(-0.25, Math.min(0.25, steering + noise));
    }
    return steering;
  }

  selectSteeringSearch(): number {
    const s = this.state;
    // Discrete planner operates on coarse planning intervals (cannot adapt instantaneously to continuous curve)
    if (this.searchStepCounter % 6 === 0) {
      this.searchDiscreteSteer = s.sensorLeft < s.sensorRight ? 0.28 : -0.28;
    }
    this.searchStepCounter++;
    return this.searchDiscreteSteer;
  }

  step(steeringOverride?: number): { reward: number; done: boolean } {
    const s = this.state;
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    let steering = 0;
    if (steeringOverride !== undefined) {
      steering = steeringOverride;
    } else if (s.controller === "search") {
      steering = this.selectSteeringSearch();
    } else {
      steering = this.selectSteeringRL(true);
    }

    s.steering = Number(steering.toFixed(3));

    // Update car heading and position
    s.angle += steering;
    // Normalize angle to [-PI, PI]
    while (s.angle > Math.PI) s.angle -= 2 * Math.PI;
    while (s.angle < -Math.PI) s.angle += 2 * Math.PI;

    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;

    if (s.trackPath.length > 50) s.trackPath.shift();
    s.trackPath.push([s.x, s.y]);

    // Compute updated continuous distance sensors
    const sensors = this.computeSensors(s.x, s.y, s.angle);
    s.sensorLeft = sensors.left;
    s.sensorRight = sensors.right;
    s.sensorForward = sensors.forward;

    // Check collision with track walls
    const dCenter = Math.hypot(s.x - this.centerX, s.y - this.centerY);
    let reward = 0;
    let done = false;

    if (dCenter <= this.innerRadius + 4 || dCenter >= this.outerRadius - 4) {
      // Crash into wall!
      s.isCollided = true;
      s.isOver = true;
      reward = -50.0;
      done = true;
    } else {
      // Reward staying centered and advancing clockwise around the track
      const trackMidRadius = (this.innerRadius + this.outerRadius) / 2;
      const centeringDeviation = Math.abs(dCenter - trackMidRadius) / 22.5;
      const centeringReward = Math.max(0, 1.0 - centeringDeviation);

      // Tangent direction for clockwise motion around center
      const angleFromCenter = Math.atan2(
        s.y - this.centerY,
        s.x - this.centerX,
      );
      const idealHeading = angleFromCenter + Math.PI / 2;
      const headingAlignment = Math.cos(s.angle - idealHeading);

      reward = 0.5 + 1.5 * centeringReward + 2.0 * headingAlignment;

      // Track lap progress
      let currentProgress = (angleFromCenter + Math.PI) / (2 * Math.PI);
      if (currentProgress < 0) currentProgress += 1;
      if (s.lapProgress > 0.85 && currentProgress < 0.15) {
        // Completed full lap!
        s.lapCount += 1;
        reward += 50.0;
      }
      s.lapProgress = currentProgress;
    }

    s.lastReward = Number(reward.toFixed(2));

    // Neural Network weight update (Policy Gradient approximation)
    if (s.controller === "rl" && !s.isCollided) {
      const lr = this.hyperparams.learningRate * 0.1;
      const nn = s.neuralNetwork;
      const delta = (s.sensorLeft - s.sensorRight) / 40.0;
      // Reinforce steering that balances sensor distances
      for (let h = 0; h < 8; h++) {
        nn.weightsOut[h] += lr * reward * nn.hiddenActivations[h] * -delta;
      }
    }

    return { reward, done };
  }

  trainBatch(episodes: number): {
    episodes: number;
    wins: number;
    avgReward: number;
  } {
    let lapsCompleted = 0;
    let totalReward = 0;
    const prevController = this.state.controller;
    this.state.controller = "rl";

    for (let e = 0; e < episodes; e++) {
      this.resetEpisode();
      let steps = 0;
      let epReward = 0;
      const startLaps = this.state.lapCount;

      while (!this.state.isOver && steps < 200) {
        const { reward, done } = this.step();
        epReward += reward;
        steps++;
        if (done) break;
      }

      if (this.state.lapCount > startLaps) {
        lapsCompleted++;
      }
      totalReward += epReward;

      this.hyperparams.explorationRate = Math.max(
        0.02,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    this.state.controller = prevController;
    return {
      episodes,
      wins: lapsCompleted,
      avgReward: episodes > 0 ? totalReward / episodes : 0,
    };
  }
}
