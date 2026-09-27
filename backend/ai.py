import json

from db import get_connection


def understand_task(text):
    connection = get_connection()
    cursor = connection.cursor()

    prompt = f"""
You are the task parser for an app called Tangerined.

Turn the user's statement into one task.

The only valid sliceId values are:
school
projects
personal

Rules:
- title should be short and clear
- choose the most appropriate sliceId
- date must use YYYY-MM-DD
- time should look like 7:00 PM
- if there is no description, use an empty string
- if there is no time, use an empty string

Today is 2026-09-27.

User said:
{text}
"""

    try:
        cursor.execute(
            """
            SELECT AI_COMPLETE(
                model => 'claude-sonnet-5',
                prompt => %s,
                response_format => TYPE OBJECT(
                    title STRING,
                    description STRING,
                    sliceId STRING,
                    date STRING,
                    time STRING
                )
            )
            """,
            (prompt,),
        )

        result = cursor.fetchone()[0]

        if isinstance(result, str):
            result = json.loads(result)

        return result

    finally:
        cursor.close()
        connection.close()