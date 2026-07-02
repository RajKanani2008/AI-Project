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
                    "content": (
                        "You are a helpful AI Assistant. "
                        "Reply clearly, politely and in simple English. "
                        "If the user writes Gujarati, you can reply in Gujarati."
                    )
                },
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        reply = response["message"]["content"]

        return jsonify({
            "success": True,
            "reply": reply
        })

    except Exception as e:
        traceback.print_exc()

        return jsonify({
            "success": False,
            "reply": "Ollama connection error. Start Ollama first using: ollama serve"
        }), 500