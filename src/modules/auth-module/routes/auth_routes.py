# auth-module/routes/auth_routes.py

from flask import Blueprint
from register_login.login import login
from register_login.register import register
from session_manager.session import load_session, clear_session

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

auth_bp.route("/login", methods=["POST"])(login)
auth_bp.route("/register", methods=["POST"])(register)
auth_bp.route("/session", methods=["GET"])(load_session)
auth_bp.route("/logout", methods=["POST"])(clear_session)
