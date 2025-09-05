// Test script for AI board generation
// Run this with: node test-ai-generation.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test the Gemini API integration
async function testGeminiAPI() {
  try {
    // You'll need to set your GOOGLE_API_KEY in environment variables
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.log('❌ GOOGLE_API_KEY not found in environment variables');
      console.log('Please set your Gemini API key:');
      console.log('export GOOGLE_API_KEY=your_api_key_here');
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

    const testPrompt = `You are a project management AI assistant. Given a user prompt describing a project or task, generate a comprehensive Kanban board structure with lists, tasks, and subtasks.

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

User prompt: Create a project management board for launching a new mobile app with development phases, testing, and deployment tasks`;

    console.log('🤖 Testing Gemini API...');
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API response received');
    console.log('📝 Response length:', text.length, 'characters');
    
    // Try to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const boardData = JSON.parse(jsonMatch[0]);
        console.log('✅ Valid JSON structure generated');
        console.log('📋 Board Title:', boardData.boardTitle);
        console.log('📝 Board Description:', boardData.boardDescription);
        console.log('📊 Number of lists:', boardData.lists?.length || 0);
        
        if (boardData.lists && boardData.lists.length > 0) {
          console.log('📋 Lists:');
          boardData.lists.forEach((list, index) => {
            console.log(`  ${index + 1}. ${list.title} (${list.tasks?.length || 0} tasks)`);
          });
        }
        
        console.log('\n🎉 AI board generation test successful!');
      } catch (parseError) {
        console.log('❌ Failed to parse JSON from response');
        console.log('Raw response:', text.substring(0, 500) + '...');
      }
    } else {
      console.log('❌ No JSON found in response');
      console.log('Raw response:', text.substring(0, 500) + '...');
    }
    
  } catch (error) {
    console.log('❌ Error testing Gemini API:', error.message);
  }
}

// Run the test
testGeminiAPI();
