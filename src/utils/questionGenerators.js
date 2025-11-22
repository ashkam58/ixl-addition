export function generateLikeDenominatorFractions({ count, denominatorRange, numeratorRange }) {
    const questions = [];
    const [minDenom, maxDenom] = denominatorRange;

    for (let i = 0; i < count; i++) {
        // Random denominator
        const denom = Math.floor(Math.random() * (maxDenom - minDenom + 1)) + minDenom;

        // Random numerators ensuring sum <= denom (for proper fractions)
        // Let's keep it simple: num1 + num2 <= denom
        const maxTotal = denom;
        const num1 = Math.floor(Math.random() * (maxTotal - 1)) + 1;
        const num2 = Math.floor(Math.random() * (maxTotal - num1)) + 1;

        questions.push({
            id: `gen_frac_${Date.now()}_${i}`,
            grade: "4", // Defaulting for now
            skillCode: "Add.Frac.Like",
            prompt: "Add the fractions.",
            difficulty: 1,
            engine: "fractionsArea",
            data: {
                fraction1: [num1, denom],
                fraction2: [num2, denom]
            },
            answer: `${num1 + num2}/${denom}`
        });
    }
    return questions;
}

export function generateCubeAddition({ count, maxSum }) {
    const questions = [];

    for (let i = 0; i < count; i++) {
        const total = Math.floor(Math.random() * (maxSum - 2)) + 2; // Min total 2
        const num1 = Math.floor(Math.random() * (total - 1)) + 1;
        const num2 = total - num1;

        questions.push({
            id: `gen_cube_${Date.now()}_${i}`,
            grade: "1",
            skillCode: "Add.Cubes",
            prompt: "How many cubes in total?",
            difficulty: 1,
            engine: "cubes",
            data: {
                addends: [num1, num2],
                maxTotal: maxSum
            },
            answer: total
        });
    }
    return questions;
}
