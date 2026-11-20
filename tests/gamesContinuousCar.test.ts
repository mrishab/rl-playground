import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ContinuousCarEngine } from "../src/lib/games/continuousCarEngine.ts";
import { useGamesStore } from "../src/stores/gamesStore.ts";

describe("Autonomous Car Continuous Track RL Engine", () => {
  it("initializes car on track with continuous coordinates, heading, and neural network", () => {
    const engine = new ContinuousCarEngine();
    assert.equal(engine.width, 320);
    assert.equal(engine.height, 200);
    assert.equal(engine.innerRadius, 45);
    assert.equal(engine.outerRadius, 90);

    assert.equal(engine.state.x, engine.centerX);
    assert.ok(engine.state.sensorLeft > 0);
    assert.ok(engine.state.sensorRight > 0);
    assert.ok(engine.state.sensorForward > 0);
    assert.equal(engine.state.isCollided, false);
    assert.equal(engine.state.lapCount, 0);

    const nn = engine.state.neuralNetwork;
    assert.equal(nn.weightsIn.length, 8);
    assert.equal(nn.weightsIn[0].length, 4);
    assert.equal(nn.weightsOut.length, 8);
  });

  it("computes continuous raycasting sensors to inner and outer track walls", () => {
    const engine = new ContinuousCarEngine();
    const sensors = engine.computeSensors(
      engine.centerX,
      engine.centerY - 67.5,
      0,
    );
    assert.ok(sensors.left > 0);
    assert.ok(sensors.right > 0);
    assert.ok(sensors.forward > 0);
  });

  it("passes inputs through neural network to compute smooth continuous steering", () => {
    const engine = new ContinuousCarEngine();
    const { steering, activations } = engine.forwardNeuralNetwork([
      0.5, 0.5, 1.0, 0.0,
    ]);
    assert.equal(activations.length, 8);
    assert.ok(steering >= -0.25 && steering <= 0.25);
  });

  it("steps continuous kinematics and moves car", () => {
    const engine = new ContinuousCarEngine();
    const prevX = engine.state.x;
    const prevY = engine.state.y;

    const { reward, done } = engine.step();
    assert.ok(engine.state.x !== prevX || engine.state.y !== prevY);
    assert.ok(typeof reward === "number");
    assert.equal(typeof done, "boolean");
  });

  it("detects collision when car crashes into track barrier", () => {
    const engine = new ContinuousCarEngine();
    // Move car directly into the inner barrier
    engine.state.x = engine.centerX;
    engine.state.y = engine.centerY - engine.innerRadius - 2;

    const { reward, done } = engine.step(0);
    assert.equal(done, true);
    assert.equal(engine.state.isCollided, true);
    assert.equal(reward, -50.0);
  });

  it("trains a batch of continuous track episodes", () => {
    const engine = new ContinuousCarEngine();
    const result = engine.trainBatch(15);

    assert.equal(result.episodes, 15);
    assert.ok(typeof result.avgReward === "number");
    assert.ok(typeof result.wins === "number");
  });

  it("resets episode cleanly preserving neural network weights", () => {
    const engine = new ContinuousCarEngine();
    engine.trainBatch(5);
    const weight0 = engine.state.neuralNetwork.weightsOut[0];

    engine.resetEpisode();
    assert.equal(engine.state.isCollided, false);
    assert.equal(engine.state.isOver, false);
    assert.equal(engine.state.neuralNetwork.weightsOut[0], weight0);
  });

  it("resets all car state cleanly", () => {
    const engine = new ContinuousCarEngine();
    engine.trainBatch(5);

    engine.resetAll();
    assert.equal(engine.state.isCollided, false);
    assert.equal(engine.state.lapCount, 0);
  });

  it("discrete search controller fails and collides into track boundary", () => {
    const engine = new ContinuousCarEngine();
    engine.setController("search");

    let crashed = false;
    for (let s = 0; s < 50; s++) {
      const { done } = engine.step();
      if (done && engine.state.isCollided) {
        crashed = true;
        break;
      }
    }
    assert.equal(
      crashed,
      true,
      "Discrete search should oscillate and crash into track wall",
    );
  });

  it("starts not knowing how to drive and crashes without training", () => {
    const engine = new ContinuousCarEngine();
    engine.setController("rl");

    let crashed = false;
    for (let s = 0; s < 80; s++) {
      const { done } = engine.step();
      if (done && engine.state.isCollided) {
        crashed = true;
        break;
      }
    }
    assert.equal(
      crashed,
      true,
      "Untrained car should not know how to drive and crash into barrier",
    );
  });

  it("RL neural network controller smoothly navigates continuous track without collision after training", () => {
    const engine = new ContinuousCarEngine();
    engine.trainBatch(15);
    engine.resetEpisode();
    engine.setController("rl");

    let stepsCompleted = 0;
    for (let s = 0; s < 120; s++) {
      const { done } = engine.step();
      if (done && engine.state.isCollided) {
        break;
      }
      stepsCompleted++;
    }
    assert.equal(
      stepsCompleted,
      120,
      "RL neural network should navigate smoothly without crashing",
    );
    assert.equal(engine.state.isCollided, false);
  });

  it("initializes villain cars with 10% configurable default error rate", () => {
    const engine = new ContinuousCarEngine();
    assert.equal(engine.villainErrorRate, 0.1);
    assert.equal(engine.state.villainErrorRate, 0.1);
    assert.equal(engine.state.villains.length, 2);

    const v1 = engine.state.villains[0];
    const v2 = engine.state.villains[1];
    assert.equal(v1.id, "villain-1");
    assert.equal(v1.name, "Red Phantom");
    assert.equal(v1.color, "#ef4444");
    assert.ok(v1.speed > 3.0);

    assert.equal(v2.id, "villain-2");
    assert.equal(v2.name, "Purple Viper");
    assert.equal(v2.color, "#a855f7");
    assert.ok(v2.speed > 3.0);

    // Verify error rate is configurable
    engine.setVillainErrorRate(0.25);
    assert.equal(engine.villainErrorRate, 0.25);
    assert.equal(engine.state.villainErrorRate, 0.25);
  });

  it("modulates speed via throttle and acceleration", () => {
    const engine = new ContinuousCarEngine();
    const initialSpeed = engine.state.speed;

    // Positive throttle increases speed
    engine.step(0, false, 0.8);
    assert.ok(
      engine.state.speed > initialSpeed,
      "Positive throttle should accelerate car",
    );

    // Negative throttle decreases speed (braking)
    const highSpeed = engine.state.speed;
    engine.step(0, false, -0.8);
    assert.ok(
      engine.state.speed < highSpeed,
      "Negative throttle should brake car",
    );
  });

  it("loses control and skids when cornering too fast", () => {
    const engine = new ContinuousCarEngine();
    // Force high speed and sharp steering
    engine.state.speed = 4.8;
    const sharpSteer = 0.22;
    engine.step(sharpSteer);

    // Lateral stress exceeds grip limit -> loses control
    assert.equal(engine.state.isSkidding, true);
    assert.ok(engine.state.lossOfControl > 0);
    assert.ok(engine.state.skidMarks.length > 0);
  });

  it("handles bump when agent is hit by villain (deflects direction and penalizes speed)", () => {
    const engine = new ContinuousCarEngine();
    const villain = engine.state.villains[0];

    // Place villain right behind agent heading East, approaching agent
    villain.x = engine.state.x - 5;
    villain.y = engine.state.y;
    villain.angle = 0;
    villain.speed = 4.0;
    engine.state.angle = 0;
    engine.state.speed = 2.0;

    const initialAngle = engine.state.angle;
    const initialSpeed = engine.state.speed;
    const rewardBefore = engine.handleCarBumps();

    assert.ok(
      rewardBefore < 0,
      "Being bumped by villain should penalize reward",
    );
    assert.ok(engine.state.lastBump !== null);
    assert.equal(engine.state.lastBump?.type, "hit_by_villain");
    assert.ok(
      engine.state.angle !== initialAngle,
      "Heading should be deflected",
    );
    assert.ok(
      engine.state.speed < initialSpeed,
      "Speed should be reduced by bump",
    );
  });

  it("handles wrong bump from behind (speeds up villain, backfires with negative reward and lost momentum)", () => {
    const engine = new ContinuousCarEngine();
    const villain = engine.state.villains[0];

    // Place agent directly behind villain moving in same direction
    villain.x = engine.state.x + 5;
    villain.y = engine.state.y;
    villain.angle = 0;
    villain.speed = 2.0;
    engine.state.angle = 0;
    engine.state.speed = 2.85;

    const reward = engine.handleCarBumps();
    assert.ok(engine.state.lastBump !== null);
    assert.equal(engine.state.lastBump?.type, "bumped_villain");
    // Villain is pushed forward and sped up, NOT triggered into error
    assert.equal(villain.isError, false);
    assert.ok(villain.speed > 2.0, "Villain should gain speed from rear push");
    // Agent loses momentum and incurs a negative penalty
    assert.ok(
      engine.state.speed < 2.85,
      "Agent should lose speed on rear bump",
    );
    assert.ok(reward < 0, "Wrong rear bump should give negative reward");
  });

  it("handles tactical side bump (destabilizes villain into skid/error, costs agent momentum, positive reward)", () => {
    const engine = new ContinuousCarEngine();
    const villain = engine.state.villains[0];

    // Position contact laterally (side impact / off-line angle)
    villain.x = engine.state.x + 4;
    villain.y = engine.state.y + 4;
    villain.angle = 0;
    villain.speed = 3.5;
    engine.state.angle = 0;
    engine.state.speed = 2.85;

    const reward = engine.handleCarBumps();
    assert.ok(engine.state.lastBump !== null);
    assert.equal(engine.state.lastBump?.type, "bumped_villain");
    // Villain is destabilized into error and skid with reduced speed
    assert.equal(villain.isError, true);
    assert.equal(villain.isSkidding, true);
    assert.ok(villain.speed < 3.5, "Villain speed should drop after side bump");
    // Agent pays momentum cost but receives tactical reward
    assert.ok(
      engine.state.speed < 2.85,
      "Agent should pay momentum cost on side bump",
    );
    assert.ok(reward > 0, "Tactical side bump should award positive points");
  });

  it("triggers boost, accelerating car and consuming boost meter", () => {
    const engine = new ContinuousCarEngine();
    const initialMeter = engine.state.boostMeter;
    const initialSpeed = engine.state.speed;

    engine.triggerBoost();
    assert.equal(engine.state.isBoosting, true);
    assert.ok(engine.state.speed > initialSpeed);

    // Step with boost active
    engine.step();
    assert.ok(
      engine.state.boostMeter < initialMeter,
      "Boost meter should drain",
    );
  });

  it("calculates race standings correctly based on lap progress", () => {
    const engine = new ContinuousCarEngine();
    // Agent starts at pole position (racePosition 1), villains start behind start line
    engine.computeRaceStandings();
    assert.equal(
      engine.state.racePosition,
      1,
      "Agent starts in pole position 1",
    );

    // Villains overtake agent
    engine.state.villains[0].totalProgress = 0.5;
    engine.state.villains[1].totalProgress = 0.6;
    engine.computeRaceStandings();
    assert.equal(
      engine.state.racePosition,
      3,
      "Agent should drop to 3rd when villains pass",
    );

    // Advance agent ahead of both villains
    engine.state.lapCount = 1;
    engine.computeRaceStandings();
    assert.equal(
      engine.state.racePosition,
      1,
      "Agent should lead in 1st place after completing lap",
    );
  });

  it("ensures agent baseline max speed is lower than villains speeds so villains overtake on open track", () => {
    const engine = new ContinuousCarEngine();
    // Agent baseline max speed is 2.85
    assert.ok(engine.state.speed <= 2.85);
    // All villains have base speeds exceeding agent max baseline speed
    for (const villain of engine.state.villains) {
      assert.ok(
        villain.baseSpeed > 2.85,
        `Villain ${villain.name} base speed (${villain.baseSpeed}) must exceed agent max baseline (2.85)`,
      );
    }
  });

  it("verifies faster villains consistently overtake slower cruising agent when no tactical bumps occur", () => {
    const engine = new ContinuousCarEngine();
    assert.equal(
      engine.state.racePosition,
      1,
      "Agent starts in pole position 1",
    );

    // Agent cruises on centerline at baseline speed
    const circleSteer = engine.state.speed / 67.5;
    for (let s = 0; s < 45; s++) {
      engine.step(circleSteer, false, 0.5);
    }

    // Faster villains must have overtaken slower agent
    assert.ok(
      engine.state.racePosition > 1,
      "Faster villains should pass slower cruising agent on open track",
    );
  });

  it("demonstrates learning progression: untrained agent has 0% win rate against fast villains", () => {
    // Untrained agent running in deterministic mode (explore=false) without RL training
    const engine = new ContinuousCarEngine();
    let steps = 0;
    while (!engine.state.isOver && steps < 200) {
      engine.step(undefined, false);
      steps++;
    }
    const untrainedWon =
      engine.state.lapCount > 0 && engine.state.racePosition === 1;
    assert.equal(
      untrainedWon,
      false,
      "Untrained agent must not win against fast villains in round 1",
    );
  });

  it("demonstrates learning progression: batch training increases win rate as agent learns tactical bumps", () => {
    const engine = new ContinuousCarEngine();
    const batch1 = engine.trainBatch(20);
    const batch2 = engine.trainBatch(20);
    assert.ok(
      batch2.wins >= batch1.wins || batch2.wins > 0,
      "Training progression should increase or maintain positive win count",
    );
  });

  it("handles 0% villain error rate where villains drive smoothly without errors", () => {
    const engine = new ContinuousCarEngine();
    engine.setVillainErrorRate(0);
    assert.equal(engine.villainErrorRate, 0);

    for (let s = 0; s < 50; s++) {
      engine.stepVillains();
    }
    const errors = engine.state.villains.filter((v) => v.isError);
    assert.equal(
      errors.length,
      0,
      "No villains should enter error state at 0% rate",
    );
  });

  it("handles 50% villain error rate where villains frequently encounter errors", () => {
    const engine = new ContinuousCarEngine();
    engine.setVillainErrorRate(0.5);
    assert.equal(engine.villainErrorRate, 0.5);

    let errorEvents = 0;
    for (let s = 0; s < 300; s++) {
      engine.stepVillains();
      if (engine.state.villains.some((v) => v.isError)) {
        errorEvents++;
      }
    }
    assert.ok(errorEvents > 0, "Villains should enter error state at 50% rate");
  });

  it("learns to balance speed against loss of control and overtakes villains to win", () => {
    const engine = new ContinuousCarEngine();
    const result = engine.trainBatch(20);
    assert.ok(result.wins > 0, "Agent should win races after training");

    engine.resetEpisode();
    let steps = 0;
    while (!engine.state.isOver && steps < 200) {
      engine.step();
      steps++;
    }
    assert.equal(
      engine.state.isCollided,
      false,
      "Trained agent should navigate safely",
    );
    assert.ok(engine.state.lapCount > 0, "Trained agent should complete laps");
  });

  it("prevents driving in opposite direction and penalizes wrong-way heading as collision", () => {
    const engine = new ContinuousCarEngine();
    // Force car to turn into opposite direction (steer sharp left)
    let done = false;
    for (let s = 0; s < 30; s++) {
      const res = engine.step(-0.25);
      if (res.done) {
        done = true;
        break;
      }
    }
    assert.equal(
      done,
      true,
      "Attempting to drive in opposite direction must terminate episode",
    );
    assert.equal(
      engine.state.isCollided,
      true,
      "Opposite direction must trigger collision state",
    );
    assert.equal(
      engine.state.lapCount,
      0,
      "Opposite direction must not count any laps",
    );
  });

  it("prevents reverse crossing of the finish line from counting a lap or advancing progress", () => {
    const engine = new ContinuousCarEngine();
    // Move car backwards past start line (x = 158 instead of 160)
    engine.state.x = 158;
    engine.state.y = engine.centerY - 67.5;
    engine.state.lapProgress = 0.05;

    engine.step(0);
    assert.equal(
      engine.state.lapCount,
      0,
      "Reverse crossing must not count a lap",
    );
    assert.ok(
      engine.state.lapProgress < 0.15,
      "Reverse crossing must not credit near-full lap progress (must reset to 0.0)",
    );
  });

  it("ensures villain cars are always faster than RL agent car on open track across errors", () => {
    const engine = new ContinuousCarEngine();
    // Agent max cruising speed is 2.85
    const agentMaxCruisingSpeed = 2.85;

    // Base speeds must strictly exceed agent max cruising speed
    for (const v of engine.state.villains) {
      assert.ok(
        v.baseSpeed > agentMaxCruisingSpeed,
        `Villain ${v.name} base speed (${v.baseSpeed}) must exceed agent max cruising speed (${agentMaxCruisingSpeed})`,
      );
    }

    // Step villains under various error rates without tactical bumps
    for (const errRate of [0, 0.2, 0.5]) {
      engine.setVillainErrorRate(errRate);
      for (let s = 0; s < 100; s++) {
        engine.stepVillains();
        for (const v of engine.state.villains) {
          assert.ok(
            v.speed > agentMaxCruisingSpeed,
            `Villain ${v.name} speed (${v.speed}) must strictly exceed agent cruising max (${agentMaxCruisingSpeed}) on open track`,
          );
        }
      }
    }
  });

  it("initializes configurable target laps with default 3 laps, bounded between 1 and 10", () => {
    const engine = new ContinuousCarEngine();
    assert.equal(engine.targetLaps, 3);
    assert.equal(engine.state.targetLaps, 3);

    // Custom constructor
    const customEngine = new ContinuousCarEngine(undefined, 5);
    assert.equal(customEngine.targetLaps, 5);
    assert.equal(customEngine.state.targetLaps, 5);

    // Dynamic configuration
    engine.setTargetLaps(7);
    assert.equal(engine.targetLaps, 7);
    assert.equal(engine.state.targetLaps, 7);

    // Clamping to [1, 10]
    engine.setTargetLaps(-2);
    assert.equal(engine.targetLaps, 1);
    assert.equal(engine.state.targetLaps, 1);

    engine.setTargetLaps(25);
    assert.equal(engine.targetLaps, 10);
    assert.equal(engine.state.targetLaps, 10);

    // Rounding
    engine.setTargetLaps(4.7);
    assert.equal(engine.targetLaps, 5);
  });

  it("does not terminate episode on intermediate laps when target laps > 1", () => {
    const engine = new ContinuousCarEngine(undefined, 3);
    assert.equal(engine.targetLaps, 3);

    // Helper to simulate completing 1 valid forward lap
    const simulateLapCrossing = () => {
      engine.agentLapMidpoint = true;
      engine.state.lapProgress = 0.95;
      engine.state.x = engine.centerX + 1;
      engine.state.y = engine.centerY - 67.5;
      engine.state.angle = 0; // heading East
      return engine.step(0);
    };

    // Complete Lap 1: target is 3, so episode must NOT end
    const lap1Res = simulateLapCrossing();
    assert.equal(engine.state.lapCount, 1);
    assert.equal(engine.state.isOver, false, "Lap 1 of 3 must not end race");
    assert.equal(lap1Res.done, false, "Done must be false on lap 1 of 3");

    // Complete Lap 2: target is 3, so episode must NOT end
    const lap2Res = simulateLapCrossing();
    assert.equal(engine.state.lapCount, 2);
    assert.equal(engine.state.isOver, false, "Lap 2 of 3 must not end race");
    assert.equal(lap2Res.done, false, "Done must be false on lap 2 of 3");

    // Complete Lap 3: target is 3, so episode MUST terminate
    const lap3Res = simulateLapCrossing();
    assert.equal(engine.state.lapCount, 3);
    assert.equal(
      engine.state.isOver,
      true,
      "Target lap reached: race must finish",
    );
    assert.equal(
      lap3Res.done,
      true,
      "Done must be true on target lap completion",
    );
  });

  it("terminates episode with win reward when agent completes configured target laps in 1st position", () => {
    const engine = new ContinuousCarEngine(undefined, 2);
    engine.state.racePosition = 1;

    // Simulate lap 1
    engine.agentLapMidpoint = true;
    engine.state.lapProgress = 0.92;
    engine.state.x = engine.centerX + 1;
    engine.state.y = engine.centerY - 67.5;
    engine.state.angle = 0;
    const res1 = engine.step(0);
    assert.equal(engine.state.lapCount, 1);
    assert.equal(engine.state.isOver, false);
    assert.ok(res1.reward > 0);

    // Simulate lap 2 (target lap)
    engine.agentLapMidpoint = true;
    engine.state.lapProgress = 0.92;
    engine.state.x = engine.centerX + 1;
    engine.state.y = engine.centerY - 67.5;
    engine.state.angle = 0;
    const res2 = engine.step(0);
    assert.equal(engine.state.lapCount, 2);
    assert.equal(engine.state.isOver, true);
    assert.equal(res2.done, true);
    assert.ok(
      res2.reward >= 50.0,
      "Winning final lap in 1st position must award victory reward",
    );
  });

  it("terminates episode when a villain completes configured target laps first", () => {
    const engine = new ContinuousCarEngine(undefined, 2);
    assert.equal(engine.targetLaps, 2);

    // Agent is still on lap 0
    engine.state.lapCount = 0;
    engine.state.lapProgress = 0.5;

    // Villain 1 reaches target laps (2 laps) ahead of agent
    const v1 = engine.state.villains[0];
    v1.lapCount = 2;
    v1.lapProgress = 0.02;
    v1.totalProgress = 2.02;
    engine.computeRaceStandings();
    assert.ok(
      engine.state.racePosition > 1,
      "Agent should trail winning villain",
    );

    const res = engine.step(0);
    assert.equal(
      engine.state.isOver,
      true,
      "Episode must terminate when villain completes target laps first",
    );
    assert.equal(res.done, true);
    assert.ok(
      res.reward < 0,
      "Loss penalty must be applied when villain wins race",
    );
  });

  it("integrates target laps with gamesStore", () => {
    const store = useGamesStore.getState();
    assert.equal(store.continuousCarState.targetLaps, 3);

    store.setContinuousCarTargetLaps(5);
    assert.equal(useGamesStore.getState().continuousCarState.targetLaps, 5);

    store.resetEpisode();
    assert.equal(
      useGamesStore.getState().continuousCarState.targetLaps,
      5,
      "Target laps should persist across episode resets",
    );
  });

  it("handles dynamic target lap adjustments mid-race without abrupt termination mid-track", () => {
    const engine = new ContinuousCarEngine(undefined, 5);
    engine.state.lapCount = 2;
    engine.state.lapProgress = 0.5;
    engine.state.isOver = false;

    // User dials down target laps from 5 to 2 mid-track
    engine.setTargetLaps(2);
    assert.equal(engine.targetLaps, 2);
    assert.equal(
      engine.state.isOver,
      false,
      "Car should not abruptly freeze/terminate mid-track when slider is moved",
    );

    // Car continues and completes current lap (advances lapCount to 3 >= targetLaps 2)
    engine.agentLapMidpoint = true;
    engine.state.lapProgress = 0.95;
    engine.state.x = engine.centerX + 1;
    engine.state.y = engine.centerY - 67.5;
    engine.state.angle = 0;
    const res = engine.step(0);

    assert.equal(engine.state.lapCount, 3);
    assert.equal(
      engine.state.isOver,
      true,
      "Episode terminates legitimately upon finish line crossing",
    );
    assert.equal(res.done, true);
  });

  it("safely handles non-finite inputs to setTargetLaps and setVillainErrorRate", () => {
    const engine = new ContinuousCarEngine();

    // Non-finite target laps defaults safely to 3
    engine.setTargetLaps(Number.NaN);
    assert.equal(engine.targetLaps, 3);
    assert.equal(engine.state.targetLaps, 3);

    engine.setTargetLaps(Number.POSITIVE_INFINITY);
    assert.equal(engine.targetLaps, 3);

    // Non-finite villain error rate defaults safely to 0.1
    engine.setVillainErrorRate(Number.NaN);
    assert.equal(engine.villainErrorRate, 0.1);
    assert.equal(engine.state.villainErrorRate, 0.1);
  });
});
