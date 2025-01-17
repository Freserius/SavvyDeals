import pymysql
# Настройки подключения
config = {
    "host": "127.0.0.1",
    "user": "root",  # Замените на имя пользователя
    "password": "",  # Замените на пароль
    "database": "veb_kurs",  # Имя базы данных
    'port': 3306 
}




def get_db_connection():
    try:
        connection = pymysql.connect(**config)
        print("Успешное подключение к базе данных!")
        return connection
    except pymysql.MySQLError as e:
        print(f"Ошибка подключения к базе данных: {e}")
        raise


# def get_db_connection():
#     try:
#         print(5678)
#         connection = mysql.connector.connect(**config)
#         return connection
#     except mysql.connector.Error as e:
#         print(f"Ошибка подключения к базе данных: {e}")
#         raise
#     except Exception as e:
#         print(f"Неизвестная ошибка: {e}")
#         raise

