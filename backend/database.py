from flask import Blueprint, request, jsonify
from ollama import chat
import traceback

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/", methods=["POST"])
def chatbot():
    try:
        data = request.get_json() or {}
        message = data.get("message", "").strip()

        if not message:
            return jsonify({
                "reply": "Please type a message."
            }), 400

        response = chat(
            model="llama3:latest",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant. Reply clearly and politely."
                },
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        return jsonify({
            "reply": response["message"]["content"]
        })

    except Exception as e:
        traceback.print_exc()

        return jsonify({
            "reply": "Ollama connection error. Please run: ollama serve"
        }), 500