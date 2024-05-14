import mysql.connector

mydb = mysql.connector.connect(host="localhost", user="root", passwd="bark32lwmnbe&wx!")

my_cursor = mydb.cursor()

# use this only to create the database if it's not created yet
# my_cursor.execute("CREATE DATABASE website_database")

my_cursor.execute("SHOW DATABASES")
for db in my_cursor:
    print(db)