require('dotenv').config();
const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

async function listModels() {
    try {
        const res = await fetch(URL);
        const data = await res.json();

        let output = "";
        if (data.models) {
            output += "Available Models:\n";
            data.models.forEach(m => {
                output += `- ${m.name} (${m.supportedGenerationMethods.join(', ')})\n`;
            });
        } else {
            output += "No models found or error: " + JSON.stringify(data);
        }

        fs.writeFileSync('models.txt', output);
        console.log("Wrote models to models.txt");
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();
