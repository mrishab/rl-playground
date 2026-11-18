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
});
