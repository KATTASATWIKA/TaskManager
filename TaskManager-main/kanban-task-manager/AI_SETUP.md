# AI Board Generation Setup Guide

This guide will help you set up the AI-powered board generation feature using Google's Gemini API.

## Prerequisites

1. A Google Cloud account
2. Access to Google AI Studio or Google Cloud Console
3. Node.js and npm installed

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy the API key (it will look like: `AIzaSy...`)

## Step 2: Set Up Environment Variables

### For Local Development

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file (if it doesn't exist):
   ```bash
   touch .env
   ```

3. Add your Google API key to the `.env` file:
   ```env
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   PORT=5000
   GOOGLE_API_KEY=your_google_api_key_here
   ```

### For Production (Render)

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add the environment variable:
   - Key: `GOOGLE_API_KEY`
   - Value: Your Google API key

## Step 3: Install Dependencies

Make sure the Gemini AI package is installed:

```bash
cd server
npm install @google/generative-ai
```

## Step 4: Test the Integration

Run the test script to verify everything works:

```bash
# Set your API key in environment
export GOOGLE_API_KEY=your_api_key_here

# Run the test
node test-ai-generation.js
```

You should see output like:
```
🤖 Testing Gemini API...
✅ Gemini API response received
📝 Response length: 1234 characters
✅ Valid JSON structure generated
📋 Board Title: Mobile App Launch Project
📝 Board Description: A comprehensive project management board for launching a new mobile application
📊 Number of lists: 4
📋 Lists:
  1. Planning (3 tasks)
  2. Development (4 tasks)
  3. Testing (3 tasks)
  4. Deployment (2 tasks)

🎉 AI board generation test successful!
```

## Step 5: Start the Application

1. Start the backend:
   ```bash
   cd server
   npm start
   ```

2. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Using AI Board Generation

1. Click "New Board" on the dashboard
2. Toggle to "AI Generate" mode
3. Enter a descriptive prompt, such as:
   - "Create a project management board for launching a new mobile app with development phases, testing, and deployment tasks"
   - "Set up a content marketing board with research, creation, review, and publishing phases"
   - "Build a customer onboarding board with signup, setup, training, and support tasks"
4. Click "Generate Board"
5. The AI will create a complete board with lists, tasks, subtasks, priorities, and due dates

## Features

- **Intelligent Board Creation**: AI generates relevant lists based on your prompt
- **Smart Task Generation**: Creates realistic tasks with descriptions and priorities
- **Subtask Support**: Automatically generates subtasks for complex tasks
- **Priority Assignment**: AI assigns appropriate priority levels (low, medium, high, urgent)
- **Due Date Suggestions**: Generates realistic due dates for tasks
- **Label Generation**: Adds relevant labels and categories

## Troubleshooting

### API Key Issues
- Make sure your API key is correctly set in the environment variables
- Verify the API key is valid and has the necessary permissions
- Check that you're using the correct environment (development vs production)

### Generation Errors
- Check the server logs for detailed error messages
- Ensure your prompt is descriptive enough for the AI to understand
- Try rephrasing your prompt if generation fails

### Rate Limiting
- Gemini API has rate limits for free tier users
- If you hit rate limits, wait a few minutes before trying again
- Consider upgrading to a paid plan for higher limits

## API Usage

The AI board generation uses two main endpoints:

- `POST /api/boards/ai-generate` - Generate a complete board from a prompt
- `POST /api/boards/:id/ai-suggest-tasks` - Get AI suggestions for additional tasks

## Cost Considerations

- Google Gemini API offers free tier with limited requests
- Each board generation counts as one API call
- Monitor your usage in the Google AI Studio dashboard
- Consider setting up billing alerts for production use

## Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify your API key is correct
3. Test with the provided test script
4. Check the Gemini API status page for service issues
