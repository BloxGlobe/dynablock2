# auth-module/register-login/login.py

from flask import request, jsonify
from uuid import uuid4
from session_manager.session import save_session

def login():
    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing credentials"}), 400

    # TODO: verify against DB
    user = {
        "id": str(uuid4()),
        "username": email.split("@")[0],
        "email": email
    }

    save_session(user)
    return jsonify(user), 200
