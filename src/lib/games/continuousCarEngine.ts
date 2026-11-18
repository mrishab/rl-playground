import type {
  ContinuousCarState,
  ControllerMode,
  GameHyperparameters,
  NeuralNetworkApproximator,
  VillainCar,
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
  villainErrorRate = 0.1; // Default 10% configurable
  isTraining = false;
  agentLapMidpoint = false;

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

  setVillainErrorRate(rate: number): void {
    this.villainErrorRate = Math.max(0, Math.min(1, rate));
    this.state.villainErrorRate = this.villainErrorRate;
  }

  triggerBoost(): void {
    if (this.state.boostMeter >= 12 && !this.state.isCollided) {
      this.state.isBoosting = true;
      this.state.speed = Math.min(3.2, this.state.speed + 0.4);
    }
  }

  createInitialNeuralNetwork(): NeuralNetworkApproximator {
    // 4 inputs: [normLeft, normRight, normForward, balanceDiff]
    // 8 hidden neurons
    // Naive initialization: car starts not knowing how to drive
    const weightsIn: number[][] = [];
    const biasHidden: number[] = [];
    for (let h = 0; h < 8; h++) {
      biasHidden.push(0.0);
      const row: number[] = [];
      for (let i = 0; i < 4; i++) {
        row.push((Math.random() * 2 - 1) * 0.25);
      }
      weightsIn.push(row);
    }

    // Output steering weights - naive initialization
    const weightsOut: number[] = [];
    // Output throttle weights - naive initialization
    const weightsThrottle: number[] = [];
    for (let h = 0; h < 8; h++) {
      weightsOut.push((Math.random() * 2 - 1) * 0.1);
      weightsThrottle.push((Math.random() * 2 - 1) * 0.1);
    }

    return {
      weightsIn,
      biasHidden,
      weightsOut,
      biasOut: -0.025,
      weightsThrottle,
      biasThrottle: 0.25,
      hiddenActivations: new Array(8).fill(0),
    };
  }

  createInitialVillains(): VillainCar[] {
    const vConfigs = [
      {
        id: "villain-1",
        name: "Red Phantom",
        color: "#ef4444",
        targetRadius: 78,
        baseSpeed: 3.5,
        startProgress: 0.97,
        lapCount: -1,
      },
      {
        id: "villain-2",
        name: "Purple Viper",
        color: "#a855f7",
        targetRadius: 57,
        baseSpeed: 3.3,
        startProgress: 0.94,
        lapCount: -1,
      },
    ];

    return vConfigs.map((cfg) => {
      const theta = -Math.PI / 2 + cfg.startProgress * 2 * Math.PI;
      const x = this.centerX + Math.cos(theta) * cfg.targetRadius;
      const y = this.centerY + Math.sin(theta) * cfg.targetRadius;
      const angle = theta + Math.PI / 2;

      return {
        id: cfg.id,
        name: cfg.name,
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
        angle: Number(angle.toFixed(2)),
        speed: cfg.baseSpeed,
        baseSpeed: cfg.baseSpeed,
        color: cfg.color,
        targetRadius: cfg.targetRadius,
        lapProgress: cfg.startProgress,
        lapCount: cfg.lapCount,
        totalProgress: Number((cfg.lapCount + cfg.startProgress).toFixed(3)),
        isSkidding: false,
        isError: false,
        errorTimer: 0,
      };
    });
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
      speed: 2.6,
      sensorLeft: 22.5,
      sensorRight: 22.5,
      sensorForward: 60,
      steering: 0,
      throttle: 0.2,
      isBoosting: false,
      boostMeter: 100,
      isSkidding: false,
      lossOfControl: 0,
      racePosition: 1,
      villains: this.createInitialVillains(),
      villainErrorRate: this.villainErrorRate,
      lastBump: null,
      skidMarks: [],
      lapCount: 0,
      lapProgress: 0,
      isCollided: false,
      isOver: false,
      lastReward: 0,
      controller: "rl",
      neuralNetwork: this.createInitialNeuralNetwork(),
      trackPath: [[startX, startY]],
    };

    this.state = s;
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
    this.agentLapMidpoint = false;
    const trackMidRadius = (this.innerRadius + this.outerRadius) / 2;
    const startX = this.centerX;
    const startY = this.centerY - trackMidRadius;
    const startAngle = 0;

    const controller = this.state.controller;
    const nn = this.state.neuralNetwork;
    const errRate = this.villainErrorRate;

    this.state = {
      ...this.createInitialState(),
      x: startX,
      y: startY,
      angle: startAngle,
      controller,
      neuralNetwork: nn,
      villainErrorRate: errRate,
      lapCount: 0,
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
    this.agentLapMidpoint = false;
    const controller = this.state.controller;
    this.state = this.createInitialState();
    this.state.controller = controller;
  }

  raycastToWalls(x: number, y: number, rayAngle: number, maxDist = 80): number {
    const dx = Math.cos(rayAngle);
    const dy = Math.sin(rayAngle);
    const stepSize = 1.5;

    for (let dist = 1.0; dist < maxDist; dist += stepSize) {
      const px = x + dx * dist;
      const py = y + dy * dist;
      const dCenter = Math.hypot(px - this.centerX, py - this.centerY);

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
    const leftAngle = heading - Math.PI / 4;
    const rightAngle = heading + Math.PI / 4;
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
    throttle: number;
    activations: number[];
  } {
    const nn = this.state.neuralNetwork;
    const activations: number[] = [];

    // Hidden layer
    for (let h = 0; h < 8; h++) {
      let sum = nn.biasHidden[h];
      for (let i = 0; i < 4; i++) {
        sum += (inputs[i] ?? 0) * nn.weightsIn[h][i];
      }
      activations.push(Math.tanh(sum));
    }
    nn.hiddenActivations = activations;

    // Steering output [-0.25, 0.25]
    let steerSum = nn.biasOut;
    for (let h = 0; h < 8; h++) {
      steerSum += activations[h] * nn.weightsOut[h];
    }
    const steering = Math.tanh(steerSum) * 0.25;

    // Throttle output [-1.0, 1.0]
    let throttleSum = nn.biasThrottle ?? 0.2;
    if (nn.weightsThrottle) {
      for (let h = 0; h < 8; h++) {
        throttleSum += activations[h] * nn.weightsThrottle[h];
      }
    }
    const throttle = Math.tanh(throttleSum);

    return { steering, throttle, activations };
  }

  selectActionRL(explore = true): {
    steering: number;
    throttle: number;
    shouldBoost: boolean;
  } {
    const s = this.state;
    const normL = s.sensorLeft / 40.0;
    const normR = s.sensorRight / 40.0;
    const normF = s.sensorForward / 60.0;
    const diff = (s.sensorLeft - s.sensorRight) / 40.0;
    const inputs = [normL, normR, normF, diff];

    const { steering, throttle } = this.forwardNeuralNetwork(inputs);

    let finalSteer = steering;
    let finalThrottle = throttle;
    let shouldBoost = false;

    if (explore && Math.random() < this.hyperparams.explorationRate) {
      const steerNoise = (Math.random() * 2 - 1) * 0.12;
      finalSteer = Math.max(-0.25, Math.min(0.25, steering + steerNoise));
      const throttleNoise = (Math.random() * 2 - 1) * 0.2;
      finalThrottle = Math.max(-1, Math.min(1, throttle + throttleNoise));
      if (Math.random() < 0.15 && s.boostMeter > 30) {
        shouldBoost = true;
      }
    }

    return {
      steering: finalSteer,
      throttle: finalThrottle,
      shouldBoost,
    };
  }

  selectSteeringSearch(): number {
    const s = this.state;
    if (this.searchStepCounter % 6 === 0) {
      this.searchDiscreteSteer = s.sensorLeft < s.sensorRight ? 0.32 : -0.32;
    }
    this.searchStepCounter++;
    return this.searchDiscreteSteer;
  }

  stepVillains(): void {
    const s = this.state;
    for (const v of s.villains) {
      // Check for villain error (10% default configurable)
      if (!v.isError && Math.random() < this.villainErrorRate * 0.04) {
        v.isError = true;
        v.errorTimer = 6;
        v.isSkidding = true;
        if (Math.random() < 0.5) {
          v.angle += Math.random() > 0.5 ? 0.2 : -0.2;
        } else {
          v.speed = Math.max(2.8, v.speed * 0.85);
        }
      }

      if (v.errorTimer > 0) {
        v.errorTimer--;
        if (v.errorTimer === 0) {
          v.isError = false;
          v.isSkidding = false;
        }
      }

      // Feedforward curvature steering around track center
      const theta = Math.atan2(v.y - this.centerY, v.x - this.centerX);
      const tangent = theta + Math.PI / 2;
      let diff = tangent - v.angle;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;

      const currentR = Math.hypot(v.x - this.centerX, v.y - this.centerY);
      const rDiff = currentR - v.targetRadius;
      const curvatureFeedforward = v.speed / v.targetRadius;
      const steer = curvatureFeedforward + diff * 0.5 + (rDiff / 8.0) * 0.15;

      v.angle += Math.max(-0.25, Math.min(0.25, steer));
      // Normalize angle
      while (v.angle > Math.PI) v.angle -= 2 * Math.PI;
      while (v.angle < -Math.PI) v.angle += 2 * Math.PI;

      // Recover toward base speed
      if (!v.isError) {
        v.speed = v.speed * 0.95 + v.baseSpeed * 0.05;
      }

      v.x += Math.cos(v.angle) * v.speed;
      v.y += Math.sin(v.angle) * v.speed;

      // Keep within track limits
      const updatedR = Math.hypot(v.x - this.centerX, v.y - this.centerY);
      if (updatedR < this.innerRadius + 6 || updatedR > this.outerRadius - 6) {
        const clampedR = Math.max(
          this.innerRadius + 8,
          Math.min(this.outerRadius - 8, updatedR),
        );
        const curAngle = Math.atan2(v.y - this.centerY, v.x - this.centerX);
        v.x = this.centerX + Math.cos(curAngle) * clampedR;
        v.y = this.centerY + Math.sin(curAngle) * clampedR;
      }

      // Lap tracking
      const newTheta = Math.atan2(v.y - this.centerY, v.x - this.centerX);
      let progress = (newTheta + Math.PI / 2) / (2 * Math.PI);
      if (progress < 0) progress += 1;
      if (v.lapProgress > 0.85 && progress < 0.15) {
        v.lapCount += 1;
      }
      v.lapProgress = progress;
      v.totalProgress = Number((v.lapCount + v.lapProgress).toFixed(3));
    }
  }

  handleCarBumps(): number {
    const s = this.state;
    let bumpReward = 0;
    const bumpRadius = 8.5;

    for (const v of s.villains) {
      const dx = v.x - s.x;
      const dy = v.y - s.y;
      const dist = Math.hypot(dx, dy);

      if (dist < bumpRadius && dist > 0.1) {
        const nx = dx / dist;
        const ny = dy / dist;

        const uxA = Math.cos(s.angle);
        const uyA = Math.sin(s.angle);
        const rxA = -uyA;
        const ryA = uxA;

        const uxV = Math.cos(v.angle);
        const uyV = Math.sin(v.angle);

        // Directed velocity towards the other vehicle
        const dotA = uxA * nx + uyA * ny;
        const dotV = uxV * -nx + uyV * -ny;

        const impactA = s.isBoosting
          ? s.speed * 1.5
          : s.speed * Math.max(0, dotA);
        const impactV = v.speed * Math.max(0, dotV);

        if (impactV > impactA && !s.isBoosting) {
          // Villain bumps agent: agent takes hit in direction and speed
          const deflSign = rxA * nx + ryA * ny >= 0 ? -1 : 1;
          s.angle += deflSign * 0.08;
          s.speed = Math.max(1.2, s.speed * 0.82);
          v.speed = Math.max(2.8, v.speed * 0.88);
          const currentR = Math.hypot(v.x - this.centerX, v.y - this.centerY);
          v.angle += v.targetRadius < currentR ? -0.1 : 0.1;
          s.lossOfControl = 0.35;
          s.isSkidding = true;
          bumpReward -= 3.5;

          s.lastBump = {
            type: "hit_by_villain",
            villainId: v.id,
            villainName: v.name,
            description: `Hit by ${v.name}! Lost direction & speed (-3.5)`,
            timestamp: Date.now(),
          };
        } else {
          // Agent bumps villain:
          // Check if wrong bump from directly behind or tactical side bump
          const forwardDotV = nx * uxV + ny * uyV;
          const rxV = -uyV;
          const ryV = uxV;
          const sideOffsetV = Math.abs(rxV * nx + ryV * ny);
          const headingDot = uxA * uxV + uyA * uyV;
          const isRearBump =
            forwardDotV > 0.7 && sideOffsetV < 0.45 && headingDot > 0.6;

          if (isRearBump) {
            // Wrong bump from directly behind: pushes villain forward and speeds them up
            v.speed = Math.min(v.baseSpeed * 1.35, v.speed + 0.85);
            v.x += uxV * 4;
            v.y += uyV * 4;
            v.isError = false;
            v.isSkidding = false;

            if (s.isBoosting) {
              s.isBoosting = false;
              s.speed = Math.max(1.4, s.speed * 0.7);
            } else {
              s.speed = Math.max(1.2, s.speed * 0.7);
            }

            bumpReward -= 3.5;

            s.lastBump = {
              type: "bumped_villain",
              villainId: v.id,
              villainName: v.name,
              description: `Wrong rear bump pushed ${v.name} ahead! (+Villain speed, -momentum)`,
              timestamp: Date.now(),
            };
          } else {
            // Tactical side bump: destabilize villain or force off racing line into spin/deceleration
            v.speed = Math.max(0.9, v.speed * 0.45);
            const spinSign = rxA * nx + ryA * ny >= 0 ? 1 : -1;
            v.angle += spinSign * 0.55;
            v.isError = true;
            v.errorTimer = 18;
            v.isSkidding = true;
            v.x += nx * 5;
            v.y += ny * 5;

            if (s.isBoosting) {
              s.isBoosting = false;
              s.speed = Math.max(1.6, s.speed * 0.75);
            } else {
              s.speed = Math.max(1.4, s.speed * 0.78);
            }
            s.lossOfControl = Math.max(s.lossOfControl, 0.2);

            bumpReward += s.racePosition > 1 ? 6.0 : 3.5;

            s.lastBump = {
              type: "bumped_villain",
              villainId: v.id,
              villainName: v.name,
              description: `Tactical side bump spun out ${v.name}! Destabilized opponent (-momentum)`,
              timestamp: Date.now(),
            };
          }
        }

        // Separate cars
        const overlap = bumpRadius - dist;
        s.x -= nx * overlap * 0.5;
        s.y -= ny * overlap * 0.5;
        v.x += nx * overlap * 0.5;
        v.y += ny * overlap * 0.5;
      }
    }

    return bumpReward;
  }

  computeRaceStandings(): void {
    const s = this.state;
    const agentTotal = s.lapCount + s.lapProgress;
    let rank = 1;

    for (const v of s.villains) {
      if (v.totalProgress > agentTotal) {
        rank++;
      }
    }
    s.racePosition = rank;
  }

  step(
    steeringOverride?: number,
    explore = false,
    throttleOverride?: number,
  ): { reward: number; done: boolean } {
    const s = this.state;
    if (s.lastBump && Date.now() - s.lastBump.timestamp > 2500) {
      s.lastBump = null;
    }
    if (s.isOver) {
      this.resetEpisode();
      return { reward: 0, done: true };
    }

    let steering = 0;
    let throttle = 0.2;

    if (s.controller === "search") {
      steering = this.selectSteeringSearch();
      s.speed = 3.3; // Discrete search runs fixed speed without traction control
      throttle = 1.0;
    } else if (steeringOverride !== undefined) {
      steering = steeringOverride;
      throttle = throttleOverride !== undefined ? throttleOverride : 0.2;
    } else {
      const action = this.selectActionRL(explore);
      steering = action.steering;
      throttle =
        throttleOverride !== undefined ? throttleOverride : action.throttle;
      if (action.shouldBoost) {
        this.triggerBoost();
      }
    }

    if (s.controller !== "search") {
      // Throttle & Speed modulation: baseline max speed 2.85 (lower than villains 3.5 & 3.3)
      if (throttle > 0) {
        s.speed = Math.min(2.85, s.speed + throttle * 0.14);
      } else {
        s.speed = Math.max(1.2, s.speed + throttle * 0.25);
      }

      // Boost mechanics (burst boost capped at 3.2, drains boost meter)
      if (s.isBoosting) {
        s.speed = Math.min(3.2, s.speed + 0.3);
        s.boostMeter = Math.max(0, s.boostMeter - 2.5);
        if (s.boostMeter <= 0) {
          s.isBoosting = false;
        }
      } else {
        s.boostMeter = Math.min(100, s.boostMeter + 0.25);
      }
    }

    s.throttle = Number(throttle.toFixed(2));
    s.steering = Number(steering.toFixed(3));
    s.speed = Number(s.speed.toFixed(2));

    // Cornering Grip / Loss of Control Mechanics
    // Lateral stress = speed * (|steering| + 0.03)
    const lateralStress = s.speed * (Math.abs(steering) + 0.03);
    const gripLimit = 0.54;

    if (lateralStress > gripLimit) {
      s.lossOfControl = Math.min(1.0, (lateralStress - gripLimit) / 0.4);
      s.isSkidding = true;
      // Oversteer fishtail under continuous RL driving
      if (s.controller !== "search") {
        s.angle += (Math.random() - 0.5) * 0.22 * s.lossOfControl;
        s.speed = Math.max(1.4, s.speed - 0.16 * s.lossOfControl);
      }

      if (s.skidMarks.length > 25) s.skidMarks.shift();
      s.skidMarks.push([s.x, s.y]);
    } else {
      s.lossOfControl = 0;
      s.isSkidding = false;
    }

    // Update heading and position
    s.angle += steering;
    while (s.angle > Math.PI) s.angle -= 2 * Math.PI;
    while (s.angle < -Math.PI) s.angle += 2 * Math.PI;

    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;

    // Centrifugal outward slide if losing control
    if (s.lossOfControl > 0) {
      const theta = Math.atan2(s.y - this.centerY, s.x - this.centerX);
      s.x += Math.cos(theta) * (s.speed * 0.35 * s.lossOfControl);
      s.y += Math.sin(theta) * (s.speed * 0.35 * s.lossOfControl);
    }

    if (s.trackPath.length > 50) s.trackPath.shift();
    s.trackPath.push([s.x, s.y]);

    // Distance sensors
    const sensors = this.computeSensors(s.x, s.y, s.angle);
    s.sensorLeft = sensors.left;
    s.sensorRight = sensors.right;
    s.sensorForward = sensors.forward;

    // Advance villains and handle bumper collisions
    this.stepVillains();
    const bumpReward = this.handleCarBumps();
    this.computeRaceStandings();

    // Barrier collision detection
    const dCenter = Math.hypot(s.x - this.centerX, s.y - this.centerY);
    let reward = 0;
    let done = false;

    if (dCenter <= this.innerRadius + 4 || dCenter >= this.outerRadius - 4) {
      s.isCollided = true;
      s.isOver = true;
      reward = -50.0;
      done = true;
    } else {
      // Centering and tangent heading alignment rewards
      const trackMidRadius = (this.innerRadius + this.outerRadius) / 2;
      const centeringDeviation = Math.abs(dCenter - trackMidRadius) / 22.5;
      const centeringReward = Math.max(0, 1.0 - centeringDeviation);

      const angleFromCenter = Math.atan2(
        s.y - this.centerY,
        s.x - this.centerX,
      );
      const idealHeading = angleFromCenter + Math.PI / 2;
      const headingAlignment = Math.cos(s.angle - idealHeading);

      const baseReward = 0.5 + 1.5 * centeringReward + 2.0 * headingAlignment;
      const speedReward = (s.speed / 4.0) * 1.0;
      const gripPenalty = s.lossOfControl * 2.5;
      const rankReward =
        s.racePosition === 1 ? 2.5 : s.racePosition === 2 ? 0.2 : -1.0;

      reward = baseReward + speedReward - gripPenalty + rankReward + bumpReward;

      // Lap tracking
      let currentProgress = (angleFromCenter + Math.PI / 2) / (2 * Math.PI);
      if (currentProgress < 0) currentProgress += 1;
      if (currentProgress > 0.35 && currentProgress < 0.65) {
        this.agentLapMidpoint = true;
      }
      if (
        s.lapProgress > 0.85 &&
        currentProgress < 0.15 &&
        this.agentLapMidpoint
      ) {
        s.lapCount += 1;
        this.agentLapMidpoint = false;
        reward += s.racePosition === 1 ? 50.0 : 15.0;
        s.isOver = true;
        done = true;
      }
      s.lapProgress = currentProgress;

      if (
        s.villains.some((v) => v.lapCount >= 1 && v.lapProgress < 0.05) &&
        s.racePosition > 1
      ) {
        reward -= 25.0;
      }
    }

    s.lastReward = Number(reward.toFixed(2));

    // Neural Network Policy Gradient Update (active during training or exploration)
    if (s.controller === "rl" && (explore || this.isTraining)) {
      const lr = this.hyperparams.learningRate * 0.1;
      const nn = s.neuralNetwork;
      const delta = (s.sensorLeft - s.sensorRight) / 40.0;

      if (s.isCollided) {
        // Crash penalty update: strongly steer away from collided barrier & reduce throttle
        for (let h = 0; h < 8; h++) {
          nn.weightsOut[h] += lr * 20.0 * nn.hiddenActivations[h] * -delta;
          if (nn.weightsThrottle) {
            nn.weightsThrottle[h] -= lr * 5.0 * nn.hiddenActivations[h];
          }
        }
      } else {
        // Active balance: accelerate when grip is intact, brake/ease off when skidding
        const gripBalance = 1.0 - 2.5 * s.lossOfControl;
        for (let h = 0; h < 8; h++) {
          nn.weightsOut[h] +=
            lr * Math.max(0.5, reward) * nn.hiddenActivations[h] * -delta;
          if (nn.weightsThrottle) {
            nn.weightsThrottle[h] +=
              lr * reward * nn.hiddenActivations[h] * gripBalance;
          }
        }
      }
    }

    return { reward, done };
  }

  trainBatch(episodes: number): {
    episodes: number;
    wins: number;
    avgReward: number;
  } {
    let lapsWon = 0;
    let totalReward = 0;
    const prevController = this.state.controller;
    this.state.controller = "rl";
    this.isTraining = true;

    for (let e = 0; e < episodes; e++) {
      this.resetEpisode();
      let steps = 0;
      let epReward = 0;
      const startLaps = this.state.lapCount;

      while (!this.state.isOver && steps < 200) {
        const { reward, done } = this.step(undefined, true);
        epReward += reward;
        steps++;
        if (done) break;
      }

      if (this.state.lapCount > startLaps && this.state.racePosition === 1) {
        lapsWon++;
      }
      totalReward += epReward;

      this.hyperparams.explorationRate = Math.max(
        0.02,
        this.hyperparams.explorationRate * this.hyperparams.epsilonDecay,
      );
    }

    this.isTraining = false;
    this.state.controller = prevController;
    return {
      episodes,
      wins: lapsWon,
      avgReward: episodes > 0 ? totalReward / episodes : 0,
    };
  }
}
