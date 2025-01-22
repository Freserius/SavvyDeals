from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from db import get_db_connection  # Предполагаем, что `db.py` настроен для подключения к MySQL
import bcrypt

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Секретный ключ для сессий

@app.route('/get_contact_info/<legal_entity>', methods=['GET'])
def get_contact_info(legal_entity):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("CALL get_contact_info(%s)", (legal_entity,))
        contact_info = cursor.fetchone()  # Предполагаем, что запрос возвращает одну строку
        if contact_info:
            return jsonify({
                'legal_entity': legal_entity,
                'address': contact_info[0],
                'phone': contact_info[1],
                'website': contact_info[2]
            })
        else:
            return jsonify({'error': 'No contact information found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()


# Главная страница
@app.route('/')
def index():
    return render_template('index.html', user_id=session.get('user_id'), user_name=session.get('user_name'))

# Авторизация
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')

        # Проверка пользователя в базе данных
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("CALL get_user_by_email(%s)", (email,))
        user = cursor.fetchone()
        connection.close()

        if not user:
            return jsonify({'message': 'Invalid email or password', 'status': 'error'}), 401
        
        # Проверка пароля
        if bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
            session['user_id'] = user[0]
            session['user_name'] = user[1]
            return jsonify({'message': 'Login successful', 'status': 'success'}), 200
        else:
            return jsonify({'message': 'Invalid email or password', 'status': 'error'}), 401
    return render_template('login.html')

# Регистрация
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Проверка существования пользователя с таким email
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("CALL get_user_by_email(%s)", (email,))
    user = cursor.fetchone()

    if user:
        return jsonify({'message': 'Email already registered', 'status': 'error'}), 400

    # Хеширование пароля
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Сохранение пользователя в базу данных
    try:
        cursor.execute("CALL insert_user(%s, %s, %s)", (name, email, hashed_password))
        connection.commit()
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}', 'status': 'error'}), 500
    finally:
        connection.close()

    return jsonify({'message': 'Registration successful', 'status': 'success'}), 201

@app.route('/register')
def register_sait():
    return render_template('register.html')


# Скидки
@app.route('/discounts')
def discounts():
    if 'user_id' not in session:
        return redirect(url_for('login'))  # Если пользователь не авторизован, перенаправляем на страницу входа
    
    return render_template('discounts.html', user_id=session.get('user_id'), user_name=session.get('user_name'))

@app.route('/get_stat_changes', methods=['GET'])
def get_stat_changes():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""CALL get_cluster_data()
    """)
    enterprises = cursor.fetchall()

    cursor1 = connection.cursor()
    cursor1.execute("""
        CALL get_categories()
    """)
    cater = cursor1.fetchall()

    connection.close()

    # Подготовка данных
    grouped = {
        "Крайне выгодные": [],
        "Выгодные": [],
        "Невыгодные": [],
        "Крайне невыгодные": []
    }

    for enterprise in enterprises:
        grouped[enterprise[2]].append({
            'LegalEntity': enterprise[0],
            'Categories': enterprise[1]
        })
    # print(grouped)
    return jsonify({
        'grouped': grouped,
        'categories': [category[0] for category in cater]  
    })


@app.route('/get_discount_info', methods=['GET'])
def get_discount_info():
    # Пример запроса для общей информации о скидках
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""CALL get_legal_entity_data()
    """)
    discounts = cursor.fetchall()
    connection.close()
    return jsonify(discounts)

# @app.route('/get_public_opinion', methods=['GET'])
# def get_public_opinion():
#     # Пример запроса для общественного мнения
#     connection = get_db_connection()
#     cursor = connection.cursor()
#     cursor.execute("""
#         SELECT LegalEntity, 
#             AVG(quality_rating) AS AverageQualityRating,
#             MostFrequentProductIssue,
#             DiscountHonesty
#         FROM feedback
#         GROUP BY LegalEntity
#     """)
#     opinions = cursor.fetchall()
#     connection.close()
#     return jsonify(opinions)


@app.route('/leave_opinion', methods=['GET', 'POST'])
def leave_opinion():
    if 'user_id' not in session:
        return redirect(url_for('login'))  # Если пользователь не авторизован, перенаправляем на страницу входа

    legal_entity = request.args.get('legal_entity')

    if request.method == 'POST':
        # Получаем данные формы
        rating = request.form.get('rating')

        # Сохраняем мнение в базу данных
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute("CALL insert_user_feedback(%s, %s, %s)",
                           ( session['user_id'], legal_entity, rating))
            connection.commit()
            return redirect(url_for('discounts'))  # Перенаправляем на главную страницу после успешной отправки
        except Exception as e:
            return f"Ошибка при сохранении: {str(e)}"
        finally:
            connection.close()

    return render_template('leave_opinion.html', legal_entity=legal_entity, user_id=session.get('user_id'), user_name=session.get('user_name'))


@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Удаляем данные пользователя из сессии
    return redirect(url_for('index'))  # Перенаправляем на главную страницу

if __name__ == '__main__':
    app.run(debug=True)
