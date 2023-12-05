from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ProcessedData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255))
    data = db.Column(db.String)
