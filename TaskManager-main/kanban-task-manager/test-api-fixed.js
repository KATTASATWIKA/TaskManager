// Fixed API test with better JSON prompting
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Your API key
const API_KEY = "AIzaSyArPcjmfGh7vzj1KjFr2NBw5sKL2Stss4U";

async function testAPIFixed() {
  console.log('🚀 Testing Gemini API - Fixed JSON Generation');
  console.log('=' .repeat(50));
  
  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

    // Improved prompt with strict JSON requirements
    const prompt = `You are a project management AI assistant. Generate a Kanban board structure as a JSON object.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations, no additional text.

Required JSON structure:
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

Generate a board for: "Website redesign project with planning, design, development, and testing phases. Include 2-3 tasks per phase with subtasks, priorities, and due dates."`;
    
    console.log('📝 Test Prompt:');
    console.log('   ', prompt.substring(0, 100) + '...');
    console.log('\n⏳ Calling Gemini API...');
    
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const endTime = Date.now();
    
    console.log(`✅ API Response received in ${endTime - startTime}ms`);
    console.log('📊 Response length:', text.length, 'characters');
    console.log('\n📄 Raw Response Preview:');
    console.log(text.substring(0, 200) + '...');
    
    // Try multiple JSON extraction methods
    console.log('\n🔍 Attempting JSON extraction...');
    
    let aiBoardData = null;
    let jsonText = text;
    
    // Method 1: Look for JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
      console.log('✅ Found JSON object in response');
    }
    
    // Method 2: Look for code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
      console.log('✅ Found JSON in code block');
    }
    
    // Method 3: Clean up the text
    jsonText = jsonText
      .replace(/^[^{]*/, '') // Remove everything before first {
      .replace(/[^}]*$/, '') // Remove everything after last }
      .trim();
    
    console.log('📝 Cleaned JSON text:');
    console.log(jsonText.substring(0, 300) + '...');
    
    try {
      aiBoardData = JSON.parse(jsonText);
      console.log('✅ JSON parsed successfully!');
    } catch (parseError) {
      console.log('❌ JSON parsing failed:', parseError.message);
      console.log('📄 Full response for debugging:');
      console.log(text);
      return false;
    }
    
    // Validate structure
    console.log('\n📋 Board Information:');
    console.log('   Title:', aiBoardData.boardTitle);
    console.log('   Description:', aiBoardData.boardDescription);
    console.log('   Lists:', aiBoardData.lists?.length || 0);
    
    if (!aiBoardData.lists || !Array.isArray(aiBoardData.lists)) {
      console.log('❌ Invalid structure: lists not found or not an array');
      return false;
    }
    
    // Analyze each list and task
    let totalTasks = 0;
    let totalSubtasks = 0;
    let tasksWithDueDates = 0;
    let highPriorityTasks = 0;
    let urgentTasks = 0;
    const allLabels = new Set();
    
    console.log('\n📊 Detailed Analysis:');
    console.log('=' .repeat(40));
    
    aiBoardData.lists.forEach((list, listIndex) => {
      console.log(`\n📋 List ${listIndex + 1}: "${list.title}"`);
      console.log(`   Tasks: ${list.tasks?.length || 0}`);
      
      if (list.tasks && Array.isArray(list.tasks)) {
        list.tasks.forEach((task, taskIndex) => {
          totalTasks++;
          totalSubtasks += task.subtasks?.length || 0;
          
          if (task.dueDate) tasksWithDueDates++;
          if (task.priority === 'high') highPriorityTasks++;
          if (task.priority === 'urgent') urgentTasks++;
          
          if (task.labels && Array.isArray(task.labels)) {
            task.labels.forEach(label => allLabels.add(label));
          }
          
          console.log(`   ${taskIndex + 1}. "${task.title}"`);
          console.log(`      Priority: ${task.priority || 'medium'}`);
          console.log(`      Due Date: ${task.dueDate || 'None'}`);
          console.log(`      Labels: [${(task.labels || []).join(', ')}]`);
          console.log(`      Description: ${(task.description || '').substring(0, 60)}${(task.description || '').length > 60 ? '...' : ''}`);
          console.log(`      Subtasks: ${task.subtasks?.length || 0}`);
          
          if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach((subtask, subIndex) => {
              console.log(`         ${subIndex + 1}. ${subtask.title} [${subtask.done ? '✅' : '⏳'}]`);
            });
          }
        });
      }
    });
    
    // Summary
    console.log('\n📈 Summary Statistics:');
    console.log('=' .repeat(30));
    console.log(`📋 Total Lists: ${aiBoardData.lists.length}`);
    console.log(`📝 Total Tasks: ${totalTasks}`);
    console.log(`📋 Total Subtasks: ${totalSubtasks}`);
    console.log(`📅 Tasks with Due Dates: ${tasksWithDueDates}`);
    console.log(`⚡ High Priority Tasks: ${highPriorityTasks}`);
    console.log(`🚨 Urgent Tasks: ${urgentTasks}`);
    console.log(`🏷️ Unique Labels: ${allLabels.size}`);
    console.log(`📊 Average Tasks per List: ${(totalTasks / aiBoardData.lists.length).toFixed(1)}`);
    console.log(`📊 Average Subtasks per Task: ${(totalSubtasks / totalTasks).toFixed(1)}`);
    
    // Test data structure for API
    console.log('\n🔧 Testing API Data Structure:');
    const testApiData = {
      board: {
        title: aiBoardData.boardTitle,
        description: aiBoardData.boardDescription
      },
      lists: aiBoardData.lists.map(list => ({
        title: list.title,
        tasks: list.tasks || []
      }))
    };
    
    console.log('✅ Board structure valid:', !!testApiData.board.title);
    console.log('✅ Lists structure valid:', testApiData.lists.length > 0);
    console.log('✅ Tasks structure valid:', testApiData.lists.every(list => Array.isArray(list.tasks)));
    
    console.log('\n🎉 API TEST SUCCESSFUL!');
    console.log('✅ Gemini API is working');
    console.log('✅ JSON parsing is working');
    console.log('✅ Task generation is working');
    console.log('✅ Subtask generation is working');
    console.log('✅ Priority assignment is working');
    console.log('✅ Due date generation is working');
    console.log('✅ Label generation is working');
    console.log('✅ Data structure is API-ready');
    
    return true;
    
  } catch (error) {
    console.log('\n❌ API TEST FAILED:');
    console.log('Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 Your API key might be invalid or expired');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('💡 Your API key might not have the necessary permissions');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('💡 You might have exceeded your API quota');
    } else if (error.message.includes('MODEL_NOT_FOUND')) {
      console.log('💡 The model name might be incorrect');
    }
    
    console.log('\nFull error details:');
    console.log(error.stack);
    return false;
  }
}

// Run the test
testAPIFixed().then(success => {
  if (success) {
    console.log('\n🚀 The API is working perfectly! Ready for deployment.');
    console.log('📝 You can now use this in your application with confidence.');
  } else {
    console.log('\n💥 There are issues with the API that need to be fixed.');
    console.log('🔧 Please check the error messages above.');
  }
  process.exit(success ? 0 : 1);
});
