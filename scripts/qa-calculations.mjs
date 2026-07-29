import assert from "node:assert/strict";

const ruleOfThree = (a, b, c) => b ? a * c / b : 0;
const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  return (sorted[Math.floor((sorted.length - 1) / 2)] + sorted[Math.ceil((sorted.length - 1) / 2)]) / 2;
};
const circleArea = radius => Math.PI * radius ** 2;
const sphereVolume = radius => 4 / 3 * Math.PI * radius ** 3;

assert.equal(ruleOfThree(3, 5, 15), 9);
assert.equal(ruleOfThree(10, 0, 5), 0);
assert.equal(mean([8, 10, 12]), 10);
assert.equal(median([1, 9, 3, 5]), 4);
assert.equal(Number(circleArea(2).toFixed(2)), 12.57);
assert.equal(Number(sphereVolume(3).toFixed(2)), 113.1);
console.log("QA de fórmulas: 6 pruebas correctas.");
