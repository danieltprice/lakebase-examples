import psycopg2
from dotenv import load_dotenv

from lakebase_auth import get_connection_kwargs

load_dotenv()
conn = None

try:
    with psycopg2.connect(**get_connection_kwargs()) as conn:
        print("Connection established")
        with conn.cursor() as cur:
            # Delete a data row from the table
            cur.execute("DELETE FROM books WHERE title = %s;", ("1984",))
            print("Deleted the book '1984' from the table.")

            # Commit the changes
            conn.commit()

except Exception as e:
    print("Connection failed.")
    print(e)
