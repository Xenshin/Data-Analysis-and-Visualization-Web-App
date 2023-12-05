from flask import Flask, render_template, request, g
from flask_sqlalchemy import SQLAlchemy
import sqlite3 as sql
import pandas as pd
from sqlalchemy import create_engine
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

# Define the ProcessedData model
class ProcessedData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255))
    data = db.Column(db.String)

# Configure SQLite Database
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sql.connect('database.db')
        db.execute('CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, data TEXT)')
    return db

# Configure SQLAlchemy Database Engine
engine = create_engine('sqlite:///database.db')

# Prepare and save processed data
def prepare_chart_data(data):
    # Assuming 'Class', 'Roll No.', and subjects as column names
    subjects = list(data.columns[2:])
    chart_data = {'subjects': subjects, 'data': {}}

    for subject in subjects:
        chart_data['data'][subject] = data[subject].tolist()

    processed_data = ProcessedData(filename=data['Class'].iloc[0], data=json.dumps(chart_data))
    db.session.add(processed_data)
    db.session.commit()
    return processed_data

# Define route for home page
@app.route('/')
def home():
    return render_template('index.html')

# Define route for data upload
@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']

        try:
            data = pd.read_csv(file)
        except Exception as e:
            return "Error reading CSV file: " + str(e), 400

        # Save processed data to the database
        prepare_chart_data(data)

        return render_template('index.html', filename=file.filename)

# Teardown function to close the SQLite connection after each request
@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Run the Flask App
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
