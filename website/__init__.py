from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

DB_NAME = "e_learning"
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    load_dotenv(dotenv_path="C:\\Users\\Florin\\Documents\\E-Learning Project\\website\\.env")
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')#"yosoymuipeligroso"
    # New MYSQL DB
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')#f'mysql+pymysql://root:wtfisgoingon22@localhost/e_learning'
    db.init_app(app)

    from .view import views
    from .auth import auth

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")

    from .models import Users
    #create_database(app)

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return Users.query.get(int(id))

    return app


def create_database(app):
    if not path.exists("website/" + DB_NAME):
        with app.app_context():
            db.create_all()
            print("Created database!")
