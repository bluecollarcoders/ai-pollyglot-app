# PollyGlot

PollyGlot is a simple, AI-powered web application that translates text into French, Spanish, and Japanese using the OpenAI API.

This project was developed to demonstrate a clean, serverless architecture for consuming AI services, with a focus on safe API usage, real-world constraints, and professional deployment practices.

[View the Live Demo](https://polygott-app.vercel.app/)

![PollyGlot Screenshot](assets/screenshots/Screenshot%202025-12-24%20at%2010.17.24%20AM.png)

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML, and CSS, built with Vite.
- **Backend**: Vercel Serverless Functions running Node.js.
- **AI Service**: OpenAI API (`gpt-4-turbo-2024-04-09`).
- **Infrastructure**: Vercel for hosting and serverless function deployment.

## Architecture

The application uses a decoupled frontend and backend architecture, hosted entirely on Vercel.

- The frontend is a static site built by Vite, served directly to users.
- The core translation logic resides in a single serverless function located at `api/translate.js`.
- Vercel automatically detects the `api` directory and deploys the function as a serverless endpoint.
- The frontend sends `POST` requests with the text and target language to the `/api/translate` endpoint.
- The serverless function handles input validation, applies rate limiting, calls the OpenAI API, and returns the translated text as a JSON response.

This architecture avoids the need for a continuously running backend server, reducing cost and complexity.

## Features

- **Multi-language Translation**: Translates text into French (🇫🇷), Spanish (🇪🇸), and Japanese (🇯🇵).
- **Serverless API**: All backend logic is handled by a Node.js serverless function.
- **Rate Limiting**: Protects the API from abuse with simple, serverless-safe, in-memory rate limiting (20 requests per minute per IP).
- **Robust Error Handling**: Provides clear frontend feedback for different error states, including invalid input (400), rate limit exceeded (429), and server errors (500).
- **Secure API Key Management**: Uses environment variables to keep the OpenAI API key secure.

## Rate Limiting

To prevent API abuse and control costs, the `api/translate` endpoint implements a fixed-window rate limiting strategy.

- **Limit**: 20 requests per IP address per minute.
- **Implementation**: The rate limiter is implemented directly within the serverless function using an in-memory `Map` to track request timestamps for each IP address. This approach is simple, effective for moderate traffic, and requires no external services like Redis.
- **Response**: If a user exceeds the rate limit, the API responds with a `429 Too Many Requests` status code.

## Environment Variables

The project requires the following environment variable to be set for the serverless function to operate:

- `OPENAI_API_KEY`: Your secret key for the OpenAI API.

### On Vercel

1.  Navigate to your project in the Vercel dashboard.
2.  Go to **Settings** → **Environment Variables**.
3.  Add `OPENAI_API_KEY` with your key as the value.

The API will return a `500 Internal Server Error` with a clear message if the `OPENAI_API_KEY` is missing or invalid.

## Local Development

To run the project on your local machine, follow these steps:

1.  **Clone and Install**:
    Clone the repository and install the necessary dependencies.
    ```bash
    git clone https://github.com/bluecollarcoders/ai-pollyglot-app.git
    cd ai-pollyglot-app
    npm install
    ```

2.  **Run the Frontend**:
    This command starts the Vite development server for the frontend.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

3.  **Run the Backend (Optional)**:
    To test the serverless function locally, you can use the Vercel CLI. First, create a `.env` file in the root of the project and add your API key:
    ```
    OPENAI_API_KEY="your-key-here"
    ```
    Then, run the development server:
    ```bash
    vercel dev
    ```
    This command starts a local server that runs both your frontend and the serverless function, replicating the Vercel production environment.

## Deployment

This project is configured for seamless deployment on Vercel.

1.  **Install Vercel CLI**:
    ```bash
    npm install -g vercel
    ```

2.  **Deploy**:
    Run the following command from the project root and follow the prompts:
    ```bash
    vercel --prod
    ```
    Vercel automatically detects the Vite frontend and the serverless function in the `api` directory, building and deploying them accordingly.

## Learning Goals

This project serves as a practical portfolio piece demonstrating core skills in modern web and AI engineering:

- **Practical OpenAI API Integration**: Using the OpenAI API for a real-world task.
- **Serverless Architecture**: Building and deploying a backend without managing traditional servers.
- **Production Deployment**: Taking a web application from development to a live, public URL.
- **API Safety and Security**: Implementing rate limiting and using environment variables for secrets.
- **Full-Stack Integration**: Connecting a JavaScript frontend to a serverless backend API.

## Future Improvements

- **Streaming translations**
  - Implement Server-Sent Events (SSE) for token-by-token translation updates
  - Improve perceived performance for longer inputs

- **Persistent rate limiting**
  - Replace in-memory rate limiting with Redis or Upstash for production-scale limits

- **React frontend**
  - Refactor UI into reusable React components
  - Improve state management and loading transitions

- **Language auto-detection**
  - Automatically detect source language before translation

- **Authentication**
  - Add optional user accounts with per-user rate limits

- **Improved error telemetry**
  - Add logging and monitoring via Vercel Analytics or Sentry

## What I Learned

This project reinforced several real-world engineering lessons:

- Serverless APIs behave differently than long-running servers
- Environment variables must be configured per-deployment
- Rate limiting is essential when exposing paid APIs
- Debugging production requires understanding deployment platforms
- Simple architectures are often the most reliable

Most importantly, I learned how to confidently ship an AI-powered feature end-to-end — from UI to production deployment.
