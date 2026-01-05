# auth-module/register-login/register.py

from flask import request, jsonify
from uuid import uuid4
from session_manager.session import save_session

def register():
    data = request.json or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # TODO: hash password + store user
    user = {
        "id": str(uuid4()),
        "username": username,
        "email": email
    }

    save_session(user)
    return jsonify(user), 201
