# app.py:
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from itsdangerous import URLSafeTimedSerializer as Serializer
from datetime import datetime, timedelta
import json
import base64
import requests
from modules.models import db, User, UserThreads, UserProfile

# Modules:
from modules.bot_default import get_initial_message, continue_thread, get_thread_messages

from pathlib import Path
import uuid
import openai
client = openai.OpenAI(
  api_key = os.environ.get("OPENAI_API_KEY_HEALTHAPP")
)

app = Flask(__name__)
cors_origin = os.environ.get("CORS_ORIGIN", "exp://192.168.20.122:8081")
#CORS(app, origins=[cors_origin])
CORS(app) # for development only

# Database configuration (DigitalOcean hosting)
postgres_user = os.environ.get("POSTGRES_USER_HEALTHAPP")
postgres_pw = os.environ.get("POSTGRES_PW_HEALTHAPP")
postgres_host = os.environ.get("POSTGRES_HOST_HEALTHAPP")
postgres_port = os.environ.get("POSTGRES_PORT_HEALTHAPP")
postgres_db = os.environ.get("POSTGRES_DB_HEALTHAPP")

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{postgres_user}:{postgres_pw}@{postgres_host}:{postgres_port}/{postgres_db}?sslmode=require'

app.config['SECRET_KEY'] = os.environ.get("SECRET_TOKEN_KEY_HEALTHAPP")

# Initialize SQLAlchemy with the app
db.init_app(app)

with app.app_context():
    #db.drop_all() # For dev to delete all tables and create them from scratch
    db.create_all()


### General and Header.js ###

@app.route('/create_user', methods=['POST'])
def create_user():
    data = request.json
    print("Received data:", data)
    hashed_password = generate_password_hash(data['password']) # Hash the password
    new_user = User(
        name=data['name'],
        surname=data['surname'],
        email=data['email'],
        password=hashed_password
    )
    db.session.add(new_user)
    try:
        db.session.commit()
        print(f"User created successfully: {new_user.name} {new_user.surname}")
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")  # Log any error
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        # Correct password
        expiration_time = datetime.utcnow() + timedelta(hours=1)  # Expires 1 hour from now
        s = Serializer(app.config['SECRET_KEY'])
        token = s.dumps({'user_id': user.id, 'exp': expiration_time.timestamp()})
        return jsonify({"token": token, "user": user.name, "user_id": user.id}), 200
    else:
        # Incorrect password
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/verify_token', methods=['POST'])
def verify_token():
    token = request.json.get('token')
    s = Serializer(app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
        # Check if token is expired
        if datetime.utcnow().timestamp() > data['exp']:
            return jsonify({"error": "Token expired"}), 401
        user = User.query.get(data['user_id'])
        if user:
            return jsonify({
                "user": user.name, 
                "user_id": user.id, 
                "user_version": user.user_version
            }), 200
        else:
            return jsonify({"user": user.name, "user_id": user.id}), 200
    except:
        return jsonify({"error": "Invalid token"}), 401

@app.route('/update_language', methods=['POST'])
def update_language():
    data = request.json
    user_id = data['user_id']
    language = data['language']
    print("user_id:", user_id)
    print("language_id:", language)

    user = User.query.get(user_id)
    if user:
        user.language = language
        db.session.commit()
        return jsonify({"message": "Language updated successfully"}), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/get_language', methods=['POST'])
def get_language():
    user_id = request.json.get('user_id')
    user = User.query.get(user_id)
    if user:
        return jsonify({"language": user.language}), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/update_user_version', methods=['POST'])
def update_user_version():
    if not request.is_json:
        return jsonify({"error": "Invalid request"}), 400

    data = request.json
    user_id = data.get('user_id')
    user_version = data.get('user_version')

    user = User.query.get(user_id)
    if user:
        user.user_version = user_version
        db.session.commit()
        return jsonify({"message": "User version updated successfully"}), 200
    return jsonify({"error": "User not found"}), 404


### Profile.js ###

@app.route('/get_user_profile', methods=['POST'])
def get_user_profile():
    try:
        user_id = request.json.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        user_profile = UserProfile.query.filter_by(user_id=user_id).first()
        if user_profile:
            # Directly format the profile data for response
            profile_data = {
                "age": user_profile.age,
                "height": user_profile.height,
                "fitness_level": user_profile.fitness_level,
                "dietary_restrictions": user_profile.dietary_restrictions or "None",
                "health_conditions": user_profile.health_conditions or "None",
                "goals": json.loads(user_profile.goals) if user_profile.goals else {},
                "height_unit": user_profile.height_unit,
            }
            return jsonify(profile_data), 200
        else:
            return jsonify({"error": "Profile not found"}), 404
    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({"error": "An error occurred processing your request"}), 500

@app.route('/update_user_profile', methods=['POST'])
def update_user_profile():
    data = request.json
    user_id = data['user_id']
    user_profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not user_profile:
        user_profile = UserProfile(user_id=user_id)

    # Combine goals from checkboxes and additional text field
    combined_goals = {**data.get('goals', {}), "additionalGoals": data.get('additionalGoals', '')}
    goals_json = json.dumps(combined_goals)

    # Update fields
    user_profile.age = data.get('age')
    user_profile.height = data.get('height')
    user_profile.fitness_level = data.get('fitnessLevel')
    user_profile.dietary_restrictions = data.get('dietaryRestrictions')
    user_profile.health_conditions = data.get('healthConditions')
    user_profile.goals = goals_json
    user_profile.height_unit = data.get('heightUnit', "cm")

    db.session.add(user_profile)
    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200


### Settings.js ###

@app.route('/update_user_settings', methods=['POST'])
def update_user_settings():
    data = request.json
    user_id = data['user_id']
    user = User.query.get(user_id)
    if user:
        user.language = data['language']
        user.display_setting = data['display_setting']
        user.voice_setting = data['voice_setting']
        user.voice_speed_setting = data['voice_speed_setting']
        user.autoplaybackaudio_setting = data['autoplaybackaudio_setting']
        db.session.commit()
        return jsonify({"message": "Settings updated successfully"}), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/get_user_settings', methods=['POST'])
def get_user_settings():
    user_id = request.json.get('user_id')
    user = User.query.get(user_id)
    if user:
        settings = {
            "language": user.language,
            "display_setting": user.display_setting,
            "voice_setting": user.voice_setting,
            "voice_speed_setting": user.voice_speed_setting,
            "autoplaybackaudio_setting": user.autoplaybackaudio_setting
        }
        return jsonify(settings), 200
    return jsonify({"error": "User not found"}), 404


### Threads.js ###

# Route for getting the user's threads #
@app.route('/get_user_threads', methods=['POST'])
def get_user_threads():
    user_id = request.json['user_id']
    sessions = UserThreads.query.filter_by(user_id=user_id).all()
    print(f"Fetched threads for user {user_id}: {sessions}")
    session_list = [{
        "thread_id": session.thread_id,
        "date": session.date_created.strftime("%Y-%m-%d"),
        "title": session.title or "Untitled Thread"
    } for session in sessions]
    return jsonify({"threads": session_list}), 200

@app.route('/cleanup_empty_threads', methods=['POST'])
def cleanup_empty_threads():
    user_id = request.json.get('user_id')

    # Find and delete threads where the title is None (null)
    UserThreads.query.filter_by(user_id=user_id, title=None).delete()
    
    db.session.commit()
    return jsonify({"message": "Empty threads cleaned up"}), 200

@app.route('/update_thread_title', methods=['POST'])
def update_thread_title():
    data = request.json
    thread_id = data['thread_id']
    new_title = data['title']
    thread = UserThreads.query.filter_by(thread_id=thread_id).first()
    if thread:
        thread.title = new_title
        db.session.commit()
        return jsonify({"message": "Thread title updated successfully"}), 200
    return jsonify({"error": "Thread not found"}), 404

@app.route('/delete_thread', methods=['POST'])
def delete_thread():
    thread_id = request.json['thread_id']
    thread = UserThreads.query.filter_by(thread_id=thread_id).first()
    if thread:
        db.session.delete(thread)
        db.session.commit()
        return jsonify({"message": "Thread deleted successfully"}), 200
    return jsonify({"error": "Thread not found"}), 404


### BotScreen.js ###

# Route for creating a new thread #
@app.route('/create_new_thread', methods=['POST'])
def create_new_thread():
    user_id = request.json['user_id']
    new_thread = client.beta.threads.create()  # Assuming this creates a new thread in OpenAI
    new_session = UserThreads(user_id=user_id, thread_id=new_thread.id)
    db.session.add(new_session)
    db.session.commit()
    return jsonify({"thread_id": new_thread.id}), 201

# Route for generating a thread title #
@app.route('/generate_thread_title', methods=['POST'])
def generate_thread_title():
    data = request.json
    thread_id = data['thread_id']
    user_input = data['user_input']

    prompt = f"Generate a very short/concise thread title (for out Health AI chatbot app) based on the following user input: {user_input}"

    # Call OpenAI API to generate a title based on user input
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7
        )
        title = response.choices[0].message.content.strip()
        title = title.strip('"')

        # Truncate the title if it exceeds 255 characters
        truncated_title = title[:255]

        print("Generated Title:", truncated_title)

        # Save the title to the UserThreads table
        user_thread = UserThreads.query.filter_by(thread_id=thread_id).first()
        if user_thread:
            user_thread.title = title
            db.session.commit()
            return jsonify({"message": "Thread title updated successfully", "title": title}), 200
        else:
            return jsonify({"error": "Thread not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for getting the messages of a thread #
@app.route('/get_thread_messages', methods=['POST'])
def handle_get_thread_messages():
    data = request.json
    thread_id = data['thread_id']
    messages_list = get_thread_messages(thread_id)
    return jsonify({"messages": messages_list})

# Route for starting a thread #
@app.route('/thread_initial', methods=['GET'])
def handle_initial():
    thread_id = request.args.get('thread_id')
    user_id = request.args.get('user_id')
    print(f"User ID received in handle_initial: {user_id}, Thread ID: {thread_id}")
    return get_initial_message(thread_id, user_id)

# Route for continuing a thread #
@app.route('/thread_continue', methods=['POST'])
def handle_continue():
    data = request.json
    thread_id = data.get('thread_id')
    user_input = data.get('user_input')
    response = continue_thread(thread_id, user_input)
    return response

# Route for continuing a thread with image attachment #
# Helper function to encode image to base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')
    
@app.route('/thread_continue_with_image', methods=['POST'])
def handle_continue_with_image():
    thread_id = request.form.get('thread_id')
    user_input = request.form.get('user_input')
    image = request.files.get('image')

    image_description = ""
    if image:
        # Save the image temporarily
        image_path = os.path.join('uploads', secure_filename(image.filename))
        image.save(image_path)

        # Encode the image to base64
        base64_image = encode_image_to_base64(image_path)

        # Send request to OpenAI API for image analysis
        payload = {
            "model": "gpt-4-vision-preview",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe this image very briefly."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300
        }

        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY_HEALTHAPP')}"
            }
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            if response.status_code == 200:
                image_description = response.json().get('choices')[0].get('message').get('content')
            else:
                print("Failed to analyze image:", response.text)
        except Exception as e:
            print("Error in analyzing image:", e)
            return jsonify({"error": str(e)}), 500
        finally:
            # Remove temporary image file
            os.remove(image_path)

    response = continue_thread(thread_id, user_input, image_description)
    return response



# Route for getting the user's thread sessions #
@app.route('/get_user_thead_sessions', methods=['POST'])
def get_user_thread_sessions():
    user_id = request.json.get('user_id')
    sessions = UserThreads.query.filter_by(user_id=user_id).all()
    sessions_data = [{'thread_id': session.thread_id} for session in sessions]
    return jsonify(sessions_data)

# Route for converting text to speech #
VOICE_SETTING_MAP = {
    1: 'echo',
    2: 'alloy',
    3: 'fable',
    4: 'onyx',
    5: 'nova',
    6: 'shimmer',
}
@app.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get('text')
    user_id = data.get('user_id')

    # Fetch user's voice_speed_setting
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    voice_speed = user.voice_speed_setting  # Fetch voice speed setting
    voice_setting = VOICE_SETTING_MAP.get(user.voice_setting, 'Echo')  # Default to 'Echo' if not found
    
    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice_setting,
            input=text,
            speed=voice_speed
        )
        speech_file_path = Path('audio') / f"speech_{uuid.uuid4()}.mp3"
        response.stream_to_file(str(speech_file_path))
        audio_url = f"http://enormous-mallard-noted.ngrok-free.app/audio/{speech_file_path.name}"
        return jsonify({"audio_url": audio_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/audio/<filename>')
def uploaded_file(filename):
    return send_from_directory('audio', filename)

@app.route('/upload_voice_memo', methods=['POST'])
def upload_voice_memo():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', filename)
        file.save(file_path)
        return jsonify({"file_url": file_path}), 200

@app.route('/transcribe_voice_memo', methods=['POST'])
def transcribe_voice_memo():
    file_url = request.json.get('file_url')
    try:
        with open(file_url, 'rb') as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
            text = transcript.text  # Directly access the text attribute
            return jsonify({"transcript": text}), 200
    except openai.BadRequestError as e:
        print("Error transcribing audio:", e)
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to transcribe audio"}), 500


if __name__ == '__main__':
    app.run(debug=True)