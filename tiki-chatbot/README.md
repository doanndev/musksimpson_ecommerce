# Product Chatbot with Gemini API and RAG

This is a chatbot that uses Google's Gemini API and Retrieval Augmented Generation (RAG) to answer questions about products from a product database.

## Features

- Uses ChromaDB as vector database for efficient similarity search
- Implements RAG technique to provide context-aware responses
- Uses Google's Gemini API for natural language generation
- FastAPI backend for quick and easy API access

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a .env file with your Google API key:
```bash
GOOGLE_API_KEY=your_api_key_here
```

3. Run the application:
```bash
python main.py
```

The server will start at http://localhost:8000

## API Usage

Send POST requests to `/chat` endpoint with your question:

```bash
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{"text": "Cho tôi biết về sản phẩm Ensure Gold"}'
```

## Project Structure

- `main.py`: FastAPI application entry point
- `config.py`: Configuration settings
- `vector_store.py`: Vector database operations
- `chatbot.py`: Gemini API interactions
- `requirements.txt`: Project dependencies 