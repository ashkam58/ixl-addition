import { generateLikeDenominatorFractions, generateCubeAddition } from "./questionGenerators.js";

console.log("--- Generating Fraction Questions ---");
const fracQuestions = generateLikeDenominatorFractions({
    count: 3,
    denominatorRange: [4, 8],
    numeratorRange: [1, 7] // Not strictly used in current logic but good for API shape
});
console.log(JSON.stringify(fracQuestions, null, 2));

console.log("\n--- Generating Cube Questions ---");
const cubeQuestions = generateCubeAddition({
    count: 3,
    maxSum: 10
});
console.log(JSON.stringify(cubeQuestions, null, 2));
