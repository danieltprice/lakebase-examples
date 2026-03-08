import psycopg
from dotenv import load_dotenv

from lakebase_auth import get_connection_kwargs

load_dotenv()

try:
    with psycopg.connect(**get_connection_kwargs()) as conn:
        print("Connection established")
        with conn.cursor() as cur:
            # Update a data row in the table
            cur.execute(
                "UPDATE books SET in_stock = %s WHERE title = %s;", (True, "Dune")
            )
            print("Updated stock status for 'Dune'.")

except Exception as e:
    print("Connection failed.")
    print(e)