
import { GoogleGenAI, Type } from "@google/genai";
import { InstructionStepData } from '../types';

export const fetchImGuiGuide = async (): Promise<InstructionStepData[]> => {
    // IMPORTANT: Make sure to set the API_KEY environment variable.
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    Generate a comprehensive, step-by-step guide for setting up a basic "Hello, World" application using the ImGui C++ library on Windows Subsystem for Linux (WSL). The target audience is a developer familiar with C++ but new to ImGui or WSL GUI development.

    The guide should cover:
    1.  **Prerequisites:** What needs to be installed on WSL (e.g., build-essential, git, cmake, graphics libraries like libgl1-mesa-dev, xorg-dev, libglfw3-dev). Use a single command block for all installations.
    2.  **Cloning ImGui:** How to clone the ImGui repository from GitHub, including submodules.
    3.  **Project Setup:** How to create a directory structure and a basic \`main.cpp\` file.
    4.  **CMake Configuration:** A complete \`CMakeLists.txt\` file to build the project, linking ImGui and its backends (GLFW3 and OpenGL3).
    5.  **Building the project:** The commands to configure and build the project using CMake.
    6.  **Running the application:** How to run the compiled executable and what to expect (mentioning WSLg for graphics).
    7.  **Example Code:** Provide a complete \`main.cpp\` example that initializes a window with GLFW, sets up ImGui, and renders a simple ImGui window with some text.

    Please return the output as a JSON object that conforms to the provided schema. In the 'description' fields, you can use markdown-style backticks (\`) to highlight commands or filenames. The 'code' field should contain only the raw code or shell commands, without any extra explanation. If a step doesn't have a code block, set 'code' and 'language' to null.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                            },
                            description: {
                                type: Type.STRING,
                            },
                            code: {
                                type: Type.STRING,
                                nullable: true,
                            },
                            language: {
                                type: Type.STRING,
                                nullable: true,
                            },
                        },
                         required: ["title", "description", "code", "language"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (!Array.isArray(parsedData)) {
            throw new Error("Invalid response format from API. Expected an array.");
        }

        return parsedData as InstructionStepData[];
    } catch (error) {
        console.error("Error fetching guide from Gemini API:", error);
        throw new Error("Failed to communicate with the Gemini API. See console for details.");
    }
};
