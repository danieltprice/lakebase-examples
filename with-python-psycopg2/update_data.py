import psycopg2
from dotenv import load_dotenv

from lakebase_auth import get_connection_kwargs

load_dotenv()
conn = None

try:
    with psycopg2.connect(**get_connection_kwargs()) as conn:
        print("Connection established")
        with conn.cursor() as cur:
            # Update a data row in the table
            cur.execute(
                "UPDATE books SET in_stock = %s WHERE title = %s;", (True, "Dune")
            )
            print("Updated stock status for 'Dune'.")

            # Commit the changes
            conn.commit()

except Exception as e:
    print("Connection failed.")
    print(e)
