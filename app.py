from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/sustainability-tips')
def sustainability_tips():
    return render_template('sustainability_tips.html')

@app.route('/success-stories')
def success_stories():
    return render_template('success_stories.html')
@app.route('/events')
def events():
    return render_template('events.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)
