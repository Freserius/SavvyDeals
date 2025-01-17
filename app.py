# from flask import Flask, request, jsonify, render_template, redirect, url_for
# from db import get_db_connection
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)
# SESSIONS = {}

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         data = request.get_json()  # Gets the POSTed JSON data
#         email = data.get('email')
#         password = data.get('password')

#         connection = get_db_connection()
#         cursor = connection.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
#         user = cursor.fetchone()
#         connection.close()

#         if user:
#             return jsonify({'message': 'Login successful', 'status': 'success'}), 200
#         return jsonify({'message': 'Invalid credentials', 'status': 'error'}), 401
#     return render_template('login.html')


# @app.route('/register', methods=['POST'])
# def register(): 
#     data = request.get_json()
#     name = data.get('name')
#     email = data.get('email')
#     password = data.get('password')

#     connection = get_db_connection()
#     cursor = connection.cursor()
#     try:
#         cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
#         connection.commit()
#     except Exception as e:
#         return jsonify({'message': f'Error: {e}', 'status': 'error'}), 500
#     finally:
#         connection.close()

#     return jsonify({'message': 'Registration successful', 'status': 'success'}), 201

# @app.route('/register', methods=['GET'])
# def route_page():
#     return render_template('register.html')

# @app.route('/feedback', methods=['POST'])
# def feedback():
#     data = request.get_json()
#     email = data.get('email')
#     message = data.get('message')

#     connection = get_db_connection()
#     cursor = connection.cursor()
#     try:
#         cursor.execute("INSERT INTO feedback (email, message) VALUES (%s, %s)", (email, message))
#         connection.commit()
#     except Exception as e:
#         return jsonify({'message': f'Error: {e}', 'status': 'error'}), 500
#     finally:
#         connection.close()

#     return jsonify({'message': 'Feedback submitted successfully', 'status': 'success'}), 201

# @app.route('/feedback')
# def feedback_page():
#     return render_template('feedback.html')

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify, render_template, redirect, url_for
from db import get_db_connection  # Предполагаем, что `db.py` настроен для подключения к MySQL

app = Flask(__name__)

# Главная страница
@app.route('/')
def index():
    return render_template('index.html')

# Авторизация
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        print(1)
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
        user = cursor.fetchone()
        connection.close()

        if user:
            return jsonify({'message': 'Login successful', 'status': 'success'}), 200
        else:
            return jsonify({'message': 'Invalid credentials', 'status': 'error'}), 401
    return render_template('login.html')

# Регистрация
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
        connection.commit()
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}', 'status': 'error'}), 500
    finally:
        connection.close()

    return jsonify({'message': 'Registration successful', 'status': 'success'}), 201
@app.route('/register')
def register_sait():
    return render_template('register.html')


# Обратная связь
@app.route('/feedback', methods=['GET', 'POST'])
def feedback():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        message = data.get('message')

        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO feedback (email, message) VALUES (%s, %s)", (email, message))
            connection.commit()
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}', 'status': 'error'}), 500
        finally:
            connection.close()

        return jsonify({'message': 'Feedback submitted successfully', 'status': 'success'}), 201
    return render_template('feedback.html')

# Скидки
@app.route('/discounts')
def discounts():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            a.LegalEntity AS Название, 
            ROUND((COALESCE(SUM(a.Discount), 0) + COALESCE(SUM(b.Discount), 0)) / 2, 2) AS Средняя_скидка
        FROM table_2023 a
        FULL JOIN table_2024 b ON a.LegalEntity = b.LegalEntity
        GROUP BY a.LegalEntity
    """)
    discounts = cursor.fetchall()
    connection.close()
    return jsonify(discounts)

if __name__ == '__main__':
    app.run(debug=True)
