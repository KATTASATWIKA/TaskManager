const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY or GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateBoardStructure(prompt) {
    try {
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

      const result = await this.model.generateContent(systemPrompt);
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
      
      return boardData;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate board structure: ' + error.message);
    }
  }

  async generateTaskSuggestions(boardTitle, currentTasks) {
    try {
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

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate task suggestions: ' + error.message);
    }
  }
}

module.exports = new GeminiService();
