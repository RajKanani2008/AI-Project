from flask import Blueprint, request, jsonify
from ollama import chat

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/", methods=["POST"])
def chatbot():
    try:
        data = request.get_json()

        message = data.get("message", "")

        print("=" * 50)
        print("USER MESSAGE:", message)

        response = chat(model="llama3", messages=[{"role": "user", "content": message}])

        print("OLLAMA RESPONSE:", response)

        return jsonify({"reply": response["message"]["content"]})

    except Exception as e:
        print("ERROR:", str(e))

        return jsonify({"reply": str(e)}), 500
