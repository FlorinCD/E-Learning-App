from dotenv import load_dotenv
import mysql.connector
import os

load_dotenv(dotenv_path="C:\\Users\\Florin\\Documents\\E-Learning Project\\website\\.env")
mydb = mysql.connector.connect(host="localhost", user="root", passwd=os.getenv("DB_ROOT_USER_PASS"),)

my_cursor = mydb.cursor()

# use this only to create the database if it's not created yet
# my_cursor.execute("CREATE DATABASE website_database")

my_cursor.execute("SHOW DATABASES")
for db in my_cursor:
    print(db)