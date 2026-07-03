from flask import Flask, jsonify
from flask_cors import CORS

from routes.auth import auth_bp
from routes.chatbot import chatbot_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(chatbot_bp, url_prefix="/chat")


@app.route("/")
def home():
    return jsonify({
        "message": "AI Assistant Backend Running"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)