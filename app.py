from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session

# Initialize the Flask application
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a secret key
app.config['SESSION_TYPE'] = 'filesystem'  # To store session data on the filesystem

# Initialize the database and session
db = SQLAlchemy(app)
Session(app)

# User model definition
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Stored password hash
    
    def __repr__(self):
        return f'<User {self.username}>'

# Event model definition
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=True)
    host = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(300), nullable=True)
    rsvp_count = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<Event {self.name}, {self.location}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'start_date': self.start_date.strftime('%Y-%m-%d %H:%M:%S'),
            'end_date': self.end_date.strftime('%Y-%m-%d %H:%M:%S') if self.end_date else None,
            'host': self.host,
            'image_url': self.image_url,
            'rsvp_count': self.rsvp_count
        }

# Route for user registration (Signup)
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Special check for admin user
        if username == 'abir':
            password = 'neelaabir'  # Set a predefined password for the admin
        
        # Hash the password
        hashed_password = generate_password_hash(password, method='sha256')
        
        # Create a new user object
        new_user = User(username=username, password=hashed_password)
        
        # Check if the username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return 'Username already exists! Please choose another.'
        
        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()
        
        return redirect(url_for('login'))  # Redirect to login after successful signup

    return render_template('signup.html')

# Route for user login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get the username and password from the form
        username = request.form.get('username')  # Use .get() to avoid KeyError
        password = request.form.get('password')

        # Debugging: print the form data to verify
        print(f"Attempting login with Username: {username}, Password: {password}")

        if not username or not password:
            return 'Please fill in both fields', 400  # Optional: return an error if fields are empty

        # Normalize username to lower case for case-insensitive comparison
        username = username.lower()  # Convert username to lowercase for case-insensitive check
        
        # Check if the user exists
        user = User.query.filter_by(username=username).first()

        if user:
            # Debugging: print user and password hash comparison
            print(f"Found user: {user.username}, Stored Password Hash: {user.password}")
            
            # Check if the password matches the stored hash
            if check_password_hash(user.password, password):
                session['user_id'] = user.id
                session['username'] = user.username
                return redirect(url_for('events'))  # Redirect to events page upon successful login
            else:
                print("Password mismatch")

        return 'Invalid credentials, please try again.', 401  # Invalid credentials message

    return render_template('login.html')  # Render the login form

# Route for logging out
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return redirect(url_for('login'))

# Route for updating event details
@app.route('/update-event/<int:event_id>', methods=['GET', 'POST'])
def update_event(event_id):
    if 'username' not in session:
        return redirect(url_for('login'))  # If the user is not logged in, redirect to login page

    # Only the admin can access this route
    if session['username'] != 'abir':  # Ensure the logged-in user is admin (with username 'abir')
        return 'Unauthorized access', 403

    event = Event.query.get_or_404(event_id)  # Get the event by ID or return 404 if not found
    
    if request.method == 'POST':
        # Update the event details with form data
        event.name = request.form['name']
        event.description = request.form['description']
        event.location = request.form['location']
        event.start_date = datetime.strptime(request.form['start_date'], '%Y-%m-%dT%H:%M')
        event.end_date = datetime.strptime(request.form['end_date'], '%Y-%m-%dT%H:%M') if request.form['end_date'] else None
        event.host = request.form['host']
        event.image_url = request.form['image_url']
        
        # Commit the updated event to the database
        db.session.commit()
        
        return redirect(url_for('events'))  # Redirect to the events page after update
    
    return render_template('update_event.html', event=event)

# Route to serve the event data as JSON
@app.route('/api/events')
def get_events():
    events = Event.query.all()  # Get all events from the database
    events_data = [event.to_dict() for event in events]  # Convert events to a list of dictionaries
    return jsonify(events_data)

# Route for the Home page
@app.route('/')
def home():
    return render_template('index.html')

# Route for the Events page
@app.route('/events')
def events():
    if 'username' not in session:
        return redirect(url_for('login'))  # Redirect to login if not logged in
    
    events = Event.query.all()  # Fetch all events
    return render_template('events.html', events=events)

# Main entry point to start the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables for our data models
        
    app.run(debug=True)
