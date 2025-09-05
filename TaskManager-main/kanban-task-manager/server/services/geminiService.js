const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY or GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Try different models in order of preference
    this.modelNames = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro"];
    this.model = this.genAI.getGenerativeModel({ model: this.modelNames[0] });
  }

  async generateBoardStructure(prompt) {
    for (const modelName of this.modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const systemPrompt = `You are a project management AI assistant. Given a user prompt describing a project or task, generate a comprehensive Kanban board structure with lists, tasks, and subtasks.

Return ONLY a valid JSON object with this exact structure:
{
  "boardTitle": "string",
  "boardDescription": "string", 
  "lists": [
    {
      "title": "string",
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "priority": "low|medium|high|urgent",
          "dueDate": "YYYY-MM-DD" or null,
          "labels": ["string"],
          "subtasks": [
            {
              "title": "string",
              "done": false
            }
          ]
        }
      ]
    }
  ]
}

Guidelines:
- Create 3-6 relevant lists (e.g., "To Do", "In Progress", "Review", "Done", "Backlog", "Blocked")
- Generate 2-5 tasks per list with realistic titles and descriptions
- Include 1-3 subtasks per task
- Set appropriate priorities and due dates
- Add relevant labels (colors or categories)
- Make the board structure practical and actionable
- Base everything on the user's prompt context

User prompt: ${prompt}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No valid JSON found in AI response');
        }
        
        const boardData = JSON.parse(jsonMatch[0]);
        
        // Validate the structure
        if (!boardData.boardTitle || !boardData.lists || !Array.isArray(boardData.lists)) {
          throw new Error('Invalid board structure generated');
        }
        
        console.log(`Successfully generated board using model: ${modelName}`);
        return boardData;
      } catch (error) {
        console.error(`Model ${modelName} failed:`, error.message);
        if (modelName === this.modelNames[this.modelNames.length - 1]) {
          // Last model failed, throw the error
          throw new Error('All models failed: ' + error.message);
        }
        // Continue to next model
        continue;
      }
    }
  }

  async generateTaskSuggestions(boardTitle, currentTasks) {
    for (const modelName of this.modelNames) {
      try {
        console.log(`Trying model for suggestions: ${modelName}`);
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const systemPrompt = `You are a project management AI assistant. Given a board title and current tasks, suggest 3-5 additional relevant tasks.

Board: ${boardTitle}
Current tasks: ${currentTasks.map(t => t.title).join(', ')}

Return ONLY a valid JSON array:
[
  {
    "title": "string",
    "description": "string", 
    "priority": "low|medium|high|urgent",
    "dueDate": "YYYY-MM-DD" or null,
    "labels": ["string"],
    "subtasks": [
      {
        "title": "string",
        "done": false
      }
    ]
  }
]`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('No valid JSON array found in AI response');
        }
        
        console.log(`Successfully generated suggestions using model: ${modelName}`);
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error(`Model ${modelName} failed for suggestions:`, error.message);
        if (modelName === this.modelNames[this.modelNames.length - 1]) {
          // Last model failed, throw the error
          throw new Error('All models failed for suggestions: ' + error.message);
        }
        // Continue to next model
        continue;
      }
    }
  }
}

module.exports = new GeminiService();
