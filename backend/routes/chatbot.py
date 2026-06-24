from flask import Blueprint, request, jsonify
from ollama import chat
from models.chat import save_message, get_chat_messages, get_user_chats

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/", methods=["POST"])
def chatbot():
    try:
        data = request.get_json() or {}

        user_id = data.get("user_id")
        chat_id = data.get("chat_id")
        message = data.get("message", "").strip()

        if not user_id:
            return jsonify({
                "reply": "Please login first."
            }), 401

        if not chat_id:
            return jsonify({
                "reply": "Chat ID is missing."
            }), 400

        if not message:
            return jsonify({
                "reply": "Message is empty."
            }), 400

        # Save user message in MySQL
        save_message(user_id, chat_id, "user", message)

        # Send message to Ollama
        response = chat(
            model="llama3",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI Assistant. Reply clearly and politely."
                },
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        reply = response["message"]["content"]

        # Save AI reply in MySQL
        save_message(user_id, chat_id, "bot", reply)

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "reply": str(e)
        }), 500


@chatbot_bp.route("/history/<int:user_id>", methods=["GET"])
def history(user_id):
    try:
        chats = get_user_chats(user_id)

        return jsonify({
            "success": True,
            "chats": chats
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@chatbot_bp.route("/messages/<int:user_id>/<chat_id>", methods=["GET"])
def messages(user_id, chat_id):
    try:
        chat_messages = get_chat_messages(user_id, chat_id)

        return jsonify({
            "success": True,
            "messages": chat_messages
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500