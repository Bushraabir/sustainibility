from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

# Initialize Flask application
app = Flask(__name__)

# Configuration settings
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a secure secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'  # Use your database URI here
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Set the login route

# Models

# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# Event Model
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=True)
    host = db.Column(db.String(100))
    image_url = db.Column(db.String(300))

    def __repr__(self):
        return f'<Event {self.name}, {self.location}>'

# SustainabilityTip Model
class SustainabilityTip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<SustainabilityTip {self.title}>'

# ActivityLog Model
class ActivityLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('activities', lazy=True))

    def __repr__(self):
        return f'<ActivityLog {self.user.username} - {self.action} at {self.timestamp}>'

# Flask-Login user loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes

# Home Route
@app.route('/')
def home():
    return render_template('index.html')

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            session['username'] = user.username

            if session['username'] == 'abir':  # Admin user
                flash('Login successful!', 'success')
                return redirect(url_for('admin_page'))  # Redirect to the admin page if logged in
            else:
                flash('Login successful! You are not an admin.', 'success')
                return redirect(url_for('home'))  # Regular user homepage
        else:
            flash('Invalid username or password', 'danger')
            return redirect(url_for('login'))

    return render_template('login.html')

# Signup Route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash('Passwords do not match', 'danger')
            return redirect(url_for('signup'))

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already taken', 'danger')
            return redirect(url_for('signup'))

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        flash('Account created successfully!', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

# Admin Page Route
# Route to fetch and render activity logs
@app.route('/admin')
def admin_page():
    if current_user.is_authenticated and session.get('username') == 'abir':
        # Fetch the total number of users, events, and activities
        user_count = User.query.count()
        event_count = Event.query.count()
        upcoming_events = Event.query.filter(Event.start_date > datetime.now()).count()
        events = Event.query.all()

        # Fetch recent activity logs from the database
        activity_logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).limit(10).all()

        # Prepare the activity logs to pass to the template (converting to a format usable in JS)
        logs = [{
            'user': log.user.username,  # Get the username of the user associated with the activity log
            'action': log.action,
            'timestamp': log.timestamp.strftime('%Y-%m-%d %H:%M:%S')  # Format the timestamp
        } for log in activity_logs]

        # Render the admin page with activity logs
        return render_template('admin_page.html', 
                               user_count=user_count, 
                               event_count=event_count, 
                               upcoming_events=upcoming_events, 
                               events=events, 
                               activity_logs=logs)  # Pass activity logs to the template

    else:
        flash('You must be an admin to access this page', 'danger')
        return redirect(url_for('login'))

# Event Routes

@app.route('/events')
@login_required
def events():
    events = Event.query.all()
    return render_template('events.html', events=events)

@app.route('/update-event/<int:event_id>', methods=['GET', 'POST'])
@login_required
def admin_update_events(event_id):
    event = Event.query.get_or_404(event_id)

    if request.method == 'POST':
        event.name = request.form['name']
        event.description = request.form['description']
        event.location = request.form['location']
        event.start_date = datetime.strptime(request.form['start_date'], '%Y-%m-%dT%H:%M')
        event.end_date = datetime.strptime(request.form['end_date'], '%Y-%m-%dT%H:%M') if request.form['end_date'] else None
        event.host = request.form['host']
        event.image_url = request.form['image_url']

        db.session.commit()
        flash('Event updated successfully', 'success')
        return redirect(url_for('events'))

    return render_template('admin_update_event.html', event=event)

@app.route('/create-event', methods=['GET', 'POST'])
def create_event():
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        location = request.form['location']
        start_date = datetime.strptime(request.form['start_date'], '%Y-%m-%dT%H:%M')
        end_date = datetime.strptime(request.form['end_date'], '%Y-%m-%dT%H:%M') if request.form['end_date'] else None
        host = request.form['host']
        image_url = request.form['image_url']

        new_event = Event(name=name, description=description, location=location, start_date=start_date,
                          end_date=end_date, host=host, image_url=image_url)
        db.session.add(new_event)
        db.session.commit()

        flash('Event created successfully!', 'success')
        return redirect(url_for('events'))  # Redirect to events page after creation

    return render_template('create_event.html')

# Event Add Route (Admin Only)
@app.route('/admin_add_event', methods=['GET', 'POST'])
@login_required
def admin_add_event():
    if session.get('username') != 'abir':
        flash('You need to be an admin to access this page', 'danger')
        return redirect(url_for('login'))

    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        location = request.form['location']
        start_date = datetime.strptime(request.form['start_date'], '%Y-%m-%dT%H:%M')
        end_date = datetime.strptime(request.form['end_date'], '%Y-%m-%dT%H:%M') if request.form['end_date'] else None
        host = request.form['host']
        image_url = request.form['image_url']

        new_event = Event(name=name, description=description, location=location,
                          start_date=start_date, end_date=end_date, host=host, image_url=image_url)

        db.session.add(new_event)
        db.session.commit()

        flash('Event added successfully!', 'success')
        return redirect(url_for('events'))  # Redirect to the events page after adding the event

    return render_template('admin_add_event.html')

# Manage Users Routes

@app.route('/admin_manage_users')
def admin_manage_users():
    if current_user.is_authenticated and session.get('username') == 'abir':
        users = User.query.all()
        return render_template('admin_manage_users.html', users=users)
    else:
        flash('You need to be an admin to access this page', 'danger')
        return redirect(url_for('login'))

@app.route('/edit-user/<int:user_id>', methods=['GET', 'POST'])
@login_required
def edit_user(user_id):
    user = User.query.get_or_404(user_id)

    if request.method == 'POST':
        user.username = request.form['username']
        if request.form['password']:
            user.password = generate_password_hash(request.form['password'], method='pbkdf2:sha256')

        db.session.commit()
        flash('User updated successfully!', 'success')
        return redirect(url_for('admin_manage_users'))

    return render_template('admin_edit_user.html', user=user)

@app.route('/admin_add_user', methods=['GET', 'POST'])
@login_required
def admin_add_user():
    if session.get('username') != 'abir':
        flash('You need to be an admin to access this page', 'danger')
        return redirect(url_for('login'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash('Passwords do not match', 'danger')
            return redirect(url_for('admin_add_user'))

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already taken', 'danger')
            return redirect(url_for('admin_add_user'))

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        flash('User created successfully!', 'success')
        return redirect(url_for('admin_manage_users'))

    return render_template('admin_add_user.html')

@app.route('/delete-user/<int:user_id>', methods=['POST'])
@login_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    flash('User deleted successfully!', 'success')
    return redirect(url_for('admin_manage_users'))

# Sustainability Tips Routes

@app.route('/sustainability-tips')
def sustainability_tips():
    if current_user.is_authenticated and session.get('username') == 'abir':
        tips = SustainabilityTip.query.all()
        return render_template('sustainability_tips.html', tips=tips)
    else:
        flash('You need to be an admin to access this page', 'danger')
        return redirect(url_for('login'))

@app.route('/add-sustainability-tip', methods=['GET', 'POST'])
@login_required
def add_sustainability_tip():
    if session.get('username') != 'abir':
        flash('You need to be an admin to access this page', 'danger')
        return redirect(url_for('login'))

    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']

        new_tip = SustainabilityTip(title=title, content=content)
        db.session.add(new_tip)
        db.session.commit()

        flash('Sustainability tip added successfully!', 'success')
        return redirect(url_for('sustainability_tips'))

    return render_template('add_sustainability_tip.html')

@app.route('/edit-sustainability-tip/<int:tip_id>', methods=['GET', 'POST'])
@login_required
def edit_sustainability_tip(tip_id):
    tip = SustainabilityTip.query.get_or_404(tip_id)

    if request.method == 'POST':
        tip.title = request.form['title']
        tip.content = request.form['content']

        db.session.commit()
        flash('Sustainability tip updated successfully!', 'success')
        return redirect(url_for('sustainability_tips'))

    return render_template('edit_sustainability_tip.html', tip=tip)

@app.route('/delete-sustainability-tip/<int:tip_id>', methods=['POST'])
@login_required
def delete_sustainability_tip(tip_id):
    tip = SustainabilityTip.query.get_or_404(tip_id)
    db.session.delete(tip)
    db.session.commit()

    flash('Sustainability tip deleted successfully!', 'success')
    return redirect(url_for('sustainability_tips'))

# Logout Route
@app.route('/logout')
@login_required
def logout():
    logout_user()  # Use Flask-Login's logout_user method
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

# Main entry point to start the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
        # Ensure admin user 'abir' exists
        admin = User.query.filter_by(username='abir').first()
        if not admin:
            hashed_password = generate_password_hash('neelaabir', method='pbkdf2:sha256')
            admin = User(username='abir', password=hashed_password)
            db.session.add(admin)
            db.session.commit()

    app.run(debug=True)
