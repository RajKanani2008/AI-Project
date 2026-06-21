from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from routes.chatbot import chatbot_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(chatbot_bp, url_prefix="/chat")

@app.route("/")
def home():
    return {
        "message": "AI Assistant Backend Running"
    }

if __name__ == "__main__":
    print("Starting AI Assistant Backend...")
    app.run(host="0.0.0.0", port=5000)