from flask import Blueprint, render_template, redirect, url_for, request, flash
from . import db
from .models import Users
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return render_template("home.html", user=current_user)

    if request.method == 'POST':
        if 'login-form' in request.form:
            email = request.form.get("login-email")
            password = request.form.get("login-password")
            # Handle login form data
            # print(f"Login form submitted with email: {email} and password: {password}")

            user = Users.query.filter_by(email=email).first()
            if user:
                if check_password_hash(user.password, password):
                    # flash("Logged in!", category='success')
                    login_user(user, remember=True)
                    return redirect(url_for("views.home"))
                else:
                    flash('Password is incorrect.', category='error')
            else:
                flash('Email does not exist.', category='error')

        elif 'registration-form' in request.form:
            email = request.form.get("registration-email")
            username = request.form.get("registration-username")
            password = request.form.get("registration-password")
            # Handle registration form data
            # print(f"Registration form submitted with email: {email}, username: {username} and password: {password}")

            email_exists = Users.query.filter_by(email=email).first()
            user_exists = Users.query.filter_by(username=username).first()

            if email_exists:
                flash('Email is already in use.', category='error')
            elif user_exists:
                flash('Username is already in use.', category='error')
            elif len(username) < 6:
                flash('Username length has to be at least 6 characters.', category='error')
            elif len(email) < 12:
                flash('Email length has to be at least 12 characters.', category='error')
            else:
                new_user = Users(email=email, username=username, password=generate_password_hash(password, method='pbkdf2:sha256'))
                db.session.add(new_user)
                db.session.commit()
                flash('User created!')

    return render_template("login.html", user=current_user)


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("views.home"))