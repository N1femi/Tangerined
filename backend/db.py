import os

import snowflake.connector
from dotenv import load_dotenv


load_dotenv()


def get_connection():
    connection = snowflake.connector.connect(
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PAT"),
        role=os.getenv("SNOWFLAKE_ROLE"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
    )

    return connection


def test_connection():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT CURRENT_VERSION()")
        result = cursor.fetchone()

        return result[0]
    finally:
        cursor.close()
        connection.close()