// Quick setup script with your API key
// Run this with: node setup-with-api-key.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Your specific API key
const API_KEY = "AIzaSyArPcjmfGh7vzj1KjFr2NBw5sKL2Stss4U";

async function testWithYourKey() {
  try {
    console.log('🚀 Testing with your specific API key...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

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

    console.log('🤖 Testing Gemini 2.5 Flash model...');
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API response received successfully!');
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
          console.log('📋 Generated Lists:');
          boardData.lists.forEach((list, index) => {
            console.log(`  ${index + 1}. ${list.title} (${list.tasks?.length || 0} tasks)`);
            if (list.tasks && list.tasks.length > 0) {
              list.tasks.slice(0, 2).forEach((task, taskIndex) => {
                console.log(`     - ${task.title} [${task.priority}]`);
              });
              if (list.tasks.length > 2) {
                console.log(`     ... and ${list.tasks.length - 2} more tasks`);
              }
            }
          });
        }
        
        console.log('\n🎉 SUCCESS! Your API key and model are working perfectly!');
        console.log('\n📋 Next steps:');
        console.log('1. Add this to your server/.env file:');
        console.log(`   GOOGLE_API_KEY=${API_KEY}`);
        console.log('2. Start your server: cd server && npm start');
        console.log('3. Start your client: cd client && npm run dev');
        console.log('4. Open http://localhost:5173 and try creating an AI board!');
        
      } catch (parseError) {
        console.log('❌ Failed to parse JSON from response');
        console.log('Raw response preview:', text.substring(0, 500) + '...');
        console.log('Parse error:', parseError.message);
      }
    } else {
      console.log('❌ No JSON found in response');
      console.log('Raw response preview:', text.substring(0, 500) + '...');
    }
    
  } catch (error) {
    console.log('❌ Error testing API:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 Your API key might be invalid or expired');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('💡 Your API key might not have the necessary permissions');
    }
  }
}

// Run the test
testWithYourKey();
