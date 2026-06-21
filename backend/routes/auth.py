from flask import Blueprint, request, jsonify
from models.user import create_user, login_user

auth_bp = Blueprint("auth", __name__)

# Register API
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data["username"]
    email = data["email"]
    password = data["password"]

    try:
        create_user(username, email, password)

        return jsonify({
            "success": True,
            "message": "User Registered Successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        })


# Login API
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data["username"]
    password = data["password"]

    user = login_user(username, password)

    if user:
        return jsonify({
            "success": True,
            "message": "Login Successful",
            "user": user
        })

    return jsonify({
        "success": False,
        "message": "Invalid Username or Password"
    })