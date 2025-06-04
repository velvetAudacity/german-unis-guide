import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app =Flask(__name__)
CORS(app) 

try:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY enviroment variable not set.")
    client = OpenAI(api_key=api_key)
except Exception as e:
    print(f"Error initiallizing OpenAI client: {e}")
    client = None    

@app.route('/api/chat', methods=['POST'])
def chat():  # <-- The function definition starts here
    if not client:
        return jsonify({"error": "AI service not available. API key missing or invalid."}), 503

    data = request.json
    user_message = data.get('message')
    conversation_history = data.get('history', [])

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    messages = [
        {"role": "system", "content": "You are a helpful assistant for students preparing for the German Studienkolleg entrance exam. You can answer questions about German grammar, basic math, and general information about studying in Germany and the application process. Keep answers concise and helpful."},
    ]
    messages.extend(conversation_history)
    messages.append({"role": "user", "content": user_message})

    try:
        # Call OpenAI API
        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        ai_response = chat_completion.choices[0].message.content
        return jsonify({"response": ai_response})  # <-- This return must be inside the 'chat' function
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return jsonify({"error": "Failed to get response from AI. Please try again later."}), 500

@app.route('/')
def index():
    return "Flask backend for German Uni Guide is running!"

if __name__ == '__main__':
    # Use a different port than Parcel's development server (e.g., 5000)
    app.run(debug=True, port=5000)


