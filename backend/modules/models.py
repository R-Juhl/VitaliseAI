# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(260), nullable=False)
    user_version = db.Column(db.String(10), default=None)  # Options are: none, f (free), s (standard) p (premium)
    language = db.Column(db.String(5), default='en')
    display_setting = db.Column(db.String(5), default='dark')
    voice_setting = db.Column(db.Integer, default=1)
    voice_speed_setting = db.Column(db.Float, default=1.0)
    autoplaybackaudio_setting = db.Column(db.Boolean, default=False)

class UserThreads(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    thread_id = db.Column(db.String(100))
    title = db.Column(db.String(255))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    age = db.Column(db.Integer)
    height = db.Column(db.Integer)  # Store height in cm
    fitness_level = db.Column(db.Integer)
    dietary_restrictions = db.Column(db.Text)
    health_conditions = db.Column(db.Text)
    goals = db.Column(db.Text)  # Store as a comma-separated string for different goals
    height_unit = db.Column(db.String(10), default="cm")  # "cm" or "inches"
    
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(260), nullable=False)