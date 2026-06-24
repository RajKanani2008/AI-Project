from database import get_connection


def save_message(user_id, chat_id, role, message):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO chat_messages (user_id, chat_id, role, message)
        VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (user_id, chat_id, role, message))

    conn.commit()
    cursor.close()
    conn.close()


def get_chat_messages(user_id, chat_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT id, role, message, created_at
        FROM chat_messages
        WHERE user_id = %s AND chat_id = %s
        ORDER BY id ASC
    """

    cursor.execute(query, (user_id, chat_id))

    messages = cursor.fetchall()

    cursor.close()
    conn.close()

    return messages


def get_user_chats(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT
            chat_id,
            MIN(message) AS title,
            MAX(created_at) AS last_message_at
        FROM chat_messages
        WHERE user_id = %s
        GROUP BY chat_id
        ORDER BY last_message_at DESC
    """

    cursor.execute(query, (user_id,))

    chats = cursor.fetchall()

    cursor.close()
    conn.close()

    return chats