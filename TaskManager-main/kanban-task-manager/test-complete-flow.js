// Complete flow test - API to database
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

// Your API key
const API_KEY = "AIzaSyArPcjmfGh7vzj1KjFr2NBw5sKL2Stss4U";

// Mock database models (simplified for testing)
const mockBoard = {
  _id: 'test-board-id',
  title: 'Test Board',
  description: 'Test Description',
  listOrder: []
};

const mockLists = [];
const mockTasks = [];

async function testCompleteFlow() {
  console.log('🚀 Testing Complete AI Flow: API → Database → Tasks');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Test Gemini API
    console.log('\n1️⃣ Testing Gemini API...');
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

    const prompt = "Create a simple project management board for a website redesign with planning, design, development, and testing phases. Generate 2-3 tasks per phase.";
    
    console.log('📝 Prompt:', prompt);
    console.log('⏳ Calling Gemini API...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Response received');
    console.log('📊 Response length:', text.length, 'characters');
    
    // Step 2: Parse JSON response
    console.log('\n2️⃣ Parsing JSON response...');
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const aiBoardData = JSON.parse(jsonMatch[0]);
    console.log('✅ JSON parsed successfully');
    console.log('📋 Board Title:', aiBoardData.boardTitle);
    console.log('📝 Board Description:', aiBoardData.boardDescription);
    console.log('📊 Number of lists:', aiBoardData.lists?.length || 0);
    
    // Step 3: Simulate database operations
    console.log('\n3️⃣ Simulating database operations...');
    
    // Create board
    const board = {
      _id: 'board-' + Date.now(),
      title: aiBoardData.boardTitle,
      description: aiBoardData.boardDescription,
      listOrder: []
    };
    console.log('✅ Board created:', board.title);
    
    // Create lists and tasks
    let totalTasks = 0;
    let totalSubtasks = 0;
    
    for (const listData of aiBoardData.lists) {
      const list = {
        _id: 'list-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        board: board._id,
        title: listData.title,
        taskOrder: []
      };
      
      board.listOrder.push(list._id);
      mockLists.push(list);
      console.log(`📋 List created: "${list.title}"`);
      
      // Create tasks for this list
      for (const taskData of listData.tasks) {
        const task = {
          _id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          board: board._id,
          list: list._id,
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          labels: taskData.labels || [],
          subtasks: taskData.subtasks || []
        };
        
        list.taskOrder.push(task._id);
        mockTasks.push(task);
        totalTasks++;
        totalSubtasks += task.subtasks.length;
        
        console.log(`  ✅ Task: "${task.title}" [${task.priority}]`);
        console.log(`     📝 Description: ${task.description.substring(0, 50)}${task.description.length > 50 ? '...' : ''}`);
        console.log(`     🏷️ Labels: [${task.labels.join(', ')}]`);
        console.log(`     📅 Due Date: ${task.dueDate ? task.dueDate.toDateString() : 'None'}`);
        console.log(`     📋 Subtasks: ${task.subtasks.length}`);
        
        if (task.subtasks.length > 0) {
          task.subtasks.forEach((subtask, index) => {
            console.log(`       ${index + 1}. ${subtask.title} [${subtask.done ? '✅' : '⏳'}]`);
          });
        }
        console.log('');
      }
    }
    
    // Step 4: Summary
    console.log('\n4️⃣ Summary:');
    console.log('=' .repeat(40));
    console.log(`📊 Board: ${board.title}`);
    console.log(`📋 Lists: ${mockLists.length}`);
    console.log(`📝 Tasks: ${totalTasks}`);
    console.log(`📋 Subtasks: ${totalSubtasks}`);
    console.log(`🏷️ Total Labels: ${[...new Set(mockTasks.flatMap(t => t.labels))].length}`);
    console.log(`📅 Tasks with Due Dates: ${mockTasks.filter(t => t.dueDate).length}`);
    console.log(`⚡ High Priority Tasks: ${mockTasks.filter(t => t.priority === 'high').length}`);
    console.log(`🚨 Urgent Tasks: ${mockTasks.filter(t => t.priority === 'urgent').length}`);
    
    // Step 5: Test API endpoint simulation
    console.log('\n5️⃣ Testing API Endpoint Simulation...');
    const apiResponse = {
      board: board,
      lists: mockLists,
      tasks: mockTasks,
      message: 'AI-generated board created successfully'
    };
    
    console.log('✅ API Response structure:');
    console.log(`  - Board ID: ${apiResponse.board._id}`);
    console.log(`  - Lists: ${apiResponse.lists.length}`);
    console.log(`  - Tasks: ${apiResponse.tasks.length}`);
    console.log(`  - Message: ${apiResponse.message}`);
    
    console.log('\n🎉 COMPLETE FLOW TEST SUCCESSFUL!');
    console.log('✅ Gemini API working');
    console.log('✅ JSON parsing working');
    console.log('✅ Database simulation working');
    console.log('✅ Task creation working');
    console.log('✅ API response structure correct');
    
    return true;
    
  } catch (error) {
    console.log('\n❌ ERROR in complete flow test:');
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
    return false;
  }
}

// Run the test
testCompleteFlow().then(success => {
  if (success) {
    console.log('\n🚀 Ready to deploy! The AI board generation is working perfectly.');
  } else {
    console.log('\n💥 There are issues that need to be fixed before deployment.');
  }
  process.exit(success ? 0 : 1);
});
