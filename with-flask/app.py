import psycopg2
from flask import Flask
from dotenv import load_dotenv

from lakebase_auth import get_connection_kwargs

load_dotenv()

app = Flask(__name__)


def get_db_connection():
    return psycopg2.connect(**get_connection_kwargs())


@app.route("/")
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM playing_with_neon")
    books = cur.fetchall()
    cur.close()
    conn.close()
    return books
