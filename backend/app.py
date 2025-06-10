# backend/app.py
import os
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Database Connection ---
def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    return conn

# --- OpenAI Client (kept for continuity, but you can comment out if not using AI right now) ---
try:
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key) if api_key else None
    if not client:
        print("Warning: OPENAI_API_KEY not set. AI features will be disabled.")
except Exception as e:
    print(f"Error initializing OpenAI client: {e}")
    client = None

# --- ADD THIS ENTIRE BLOCK TO YOUR backend/app.py ---
@app.route('/api/questions', methods=['GET'])
def get_questions():
    test_type = request.args.get('test_type')
    topic = request.args.get('topic')
    limit = request.args.get('limit', 1, type=int) # Default to 1 question

    if not test_type or not topic:
        return jsonify({"error": "test_type and topic parameters are required"}), 400

    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, question_text, correct_answers, options FROM questions WHERE test_type = %s AND topic = %s ORDER BY RANDOM() LIMIT %s",
            (test_type, topic, limit)
        )
        questions_data = cur.fetchall()
        cur.close()

        questions_list = []
        for q_id, text, correct_ans, options in questions_data:
            questions_list.append({
                "id": q_id,
                "question_text": text,
                "correct_answers": correct_ans, # This will be a Python list/dict from JSONB
                "options": options
            })
        return jsonify(questions_list)
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return jsonify({"error": "Failed to fetch questions."}), 500
    finally:
        if conn:
            conn.close()
# --- END OF BLOCK TO ADD ---

# --- Existing AI Chat Route ---
@app.route('/api/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "AI service not available (API key missing)."}), 503

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
        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        ai_response = chat_completion.choices[0].message.content
        return jsonify({"response": ai_response})
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return jsonify({"error": "Failed to get response from AI. Please try again later."}), 500
    

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '') # Get search query from URL parameter 'q'
    if not query:
        return jsonify({"results": []}) # Return empty results if no query

    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Use plainto_tsquery for simple keyword search (handles punctuation)
        # For more advanced queries (AND/OR), use to_tsquery
        search_query = f"plainto_tsquery('english', %s)"

        # Perform the search. The @@ operator checks for match.
        # ts_rank orders by relevance.
        cur.execute(
            f"SELECT id, question_text, test_type, topic, ts_rank(tsv_question_text, {search_query}) as rank FROM questions WHERE tsv_question_text @@ {search_query} ORDER BY rank DESC LIMIT 10",
            (query, query) # Pass query twice for both plainto_tsquery calls
        )
        search_results = cur.fetchall()
        cur.close()

        results_list = []
        for q_id, text, test_type, topic, rank in search_results:
            results_list.append({
                "id": q_id,
                "question_text": text,
                "test_type": test_type,
                "topic": topic,
                "relevance": rank # Rank can be used for display or sorting
            })
        return jsonify(results_list)
    except Exception as e:
        print(f"Error during search: {e}")
        return jsonify({"error": "Failed to perform search."}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/contact', methods=['POST'])
def submit_contact_form():
    data = request.json
    name = data.get('name')
    phone_number = data.get('phone_number')
    email = data.get('email')
    message = data.get('message')
    is_human = data.get('is_human', False) 

    
    if not name or not email or not message:
        return jsonify({"error": "Name, Email, and Message are required fields."}), 400


    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO contact_messages (name, phone_number, email, message, is_human) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, phone_number, email, message, is_human)
        )
        message_id = cur.fetchone()[0] 
        conn.commit()
        cur.close()

        return jsonify({"message": "Message sent successfully!", "id": message_id}), 201 # 201 Created
    except Exception as e:
        print(f"Error submitting contact message: {e}")
        return jsonify({"error": "Failed to send message. Please try again later."}), 500
    finally:
        if conn:
            conn.close()

@app.route('/')
def index():
    return "Flask backend for German Uni Guide is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)


