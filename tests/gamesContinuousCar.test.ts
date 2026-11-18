import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ContinuousCarEngine } from "../src/lib/games/continuousCarEngine.ts";

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
    for (let s = 0; s < 40; s++) {
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

  it("RL neural network controller smoothly navigates continuous track without collision", () => {
    const engine = new ContinuousCarEngine();
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

    // Place villain right behind agent, approaching agent
    villain.x = engine.state.x + 2;
    villain.y = engine.state.y;
    villain.speed = 4.0;
    engine.state.speed = 2.0;

    const initialAngle = engine.state.angle;
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
  });

  it("handles bump when agent bumps villain (villain deflected, agent loses momentum)", () => {
    const engine = new ContinuousCarEngine();
    const villain = engine.state.villains[0];

    // Place agent moving faster directly behind villain
    villain.x = engine.state.x + 5;
    villain.y = engine.state.y;
    villain.speed = 2.0;
    engine.state.speed = 4.2;

    const reward = engine.handleCarBumps();
    assert.ok(engine.state.lastBump !== null);
    assert.equal(engine.state.lastBump?.type, "bumped_villain");
    // Villain is knocked off and triggered into error
    assert.equal(villain.isError, true);
    // Agent loses momentum (speed drops below 4.2)
    assert.ok(engine.state.speed < 4.2, "Agent should pay a momentum cost");
    assert.ok(typeof reward === "number");
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
    // Villains start ahead, so agent starts in position 3
    engine.computeRaceStandings();
    assert.equal(engine.state.racePosition, 3);

    // Advance agent ahead of both villains
    engine.state.lapCount = 1;
    engine.computeRaceStandings();
    assert.equal(
      engine.state.racePosition,
      1,
      "Agent should lead in 1st place",
    );
  });
});
