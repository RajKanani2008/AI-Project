from database import get_connection

def create_user(username, email, password):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO users(username, email, password)
    VALUES(%s, %s, %s)
    """

    cursor.execute(query, (username, email, password))

    conn.commit()
    conn.close()


def login_user(username, password):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT * FROM users
    WHERE username=%s AND password=%s
    """

    cursor.execute(query, (username, password))

    user = cursor.fetchone()

    conn.close()

    return user