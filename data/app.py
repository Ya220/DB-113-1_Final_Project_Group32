from flask import Flask, request, jsonify
from flask_cors import CORS  # 引入 CORS

import psycopg2
from psycopg2 import sql
from psycopg2 import extras

from datetime import datetime

app = Flask(__name__)
CORS(app)

#請依自己的資料庫進行修改
DB_NAME = "DBMS_1209"
DB_USER = "postgres"
DB_HOST = "127.0.0.1"
DB_PORT = 5432
DB_PASSWORD = "chipper1132"

# 驗證ADMIN和密碼
def admin_login(username, password):

    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT)
        print("Successfully connect to DBMS.")

        # 创建一个游标
        cursor = db.cursor()

        ## 编写 SQL 查询语句来验证用户
        role = 'admin'
        query = sql.SQL("SELECT password FROM {} WHERE role = %s AND {} = %s AND status = 'activate'").format(
            sql.Identifier("User"),   # 使用 sql.Identifier 来安全引用表名
            sql.Identifier("user_id")  # 使用 sql.Identifier 来安全引用列名
        )
        cursor.execute(query, (role,username))

        # 获取查询结果
        result = cursor.fetchone()

        if result[0] == password :
            return jsonify({'success': True}), 200
        return jsonify({'success': False}), 400
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400

# 驗證用戶名和密碼  
def user_login(username, password):

    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT)
        print("Successfully connect to DBMS.")

        # 创建一个游标
        cursor = db.cursor()

        # 编写 SQL 查询语句来验证用户
        role = 'member'
        query = sql.SQL('''
                        SELECT password FROM "User" WHERE role = %s AND user_id = %s AND status = 'activate'
                        ''')
        cursor.execute(query, (role,username))

        # 获取查询结果
        result = cursor.fetchone()
        if result[0] == password :
            return jsonify({'success': True}), 200
        return jsonify({'success': False}), 400

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400

#創建用戶    
def create_account(username, password, email, name, gender, dob, contact, school, city):
    #轉換datatype
    username = int(username)
    try:
        dob = datetime.strptime(dob, '%Y-%m-%d').date()  # 转换为日期对象
    except Exception as e:
        print('dob_convert_fail')
        return jsonify({'success': False}), 400
    if gender == 'male':
        gender = '男'
    else : gender = '女' 
    
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT,client_encoding="UTF8")
        print("Successfully connect to DBMS.")
        
        # 创建一个游标
        cursor = db.cursor()
        # 1. 检查数据库中是否存在相同的用户名
        cursor.execute('SELECT user_id FROM "User" WHERE user_id = %s', (username,))
        user_exists = cursor.fetchone()  # 查询结果是一个元组，如果找到记录则不为空
        # 2. 检查数据库中是否存在相同的email
        cursor.execute('SELECT email FROM "User" WHERE email = %s', (email,))
        email_exists = cursor.fetchone()  # 查询结果是一个元组，如果找到记录则不为空

        # 如果已经存在该用户名，返回错误信息
        if user_exists:
            return jsonify({'success': False}), 400
	    # 如果email已經被使用，返回错误信息
        if email_exists:
            return jsonify({'success': False}), 400

        # 2. 如果用户名不存在，插入新用户到数据库
        try:
            cursor.execute("""
                INSERT INTO "User" ("user_id", "password", "email", "name", "sex", "birth_date", "contact_information", "school", "region", "status", "role")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (username, password, email, name, gender, dob, contact, school, city, 'activate', 'member'))
            db.commit()  # 提交事务
            print('create succeed')
        except Exception as e:
            # 如果插入失败，回滚事务并返回错误信息
            db.rollback()
            print('create fail')
            return jsonify({'success': False}), 400
        
        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400  

def upload_book(bookTitle, edition, price, publisher, publication_year, page, language, note, username,subjects,authors,translators,transactionType):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT,client_encoding="UTF8")
        print("Successfully connect to DBMS.")
        cursor = db.cursor()

        #轉換datatype，處理插入資料
        price = int(price)
        page = int(page)
        username = int(username)
        current_date = datetime.today().date()
        cursor.execute('SELECT MAX("book_id") FROM "Book";')
        result = cursor.fetchone()
        if result[0] is None:
            book_id =1
        else:
            book_id = result[0] + 1

        try:
            # 插入数据到 Book 表
            insert_query = """
                INSERT INTO "Book" ("book_id","title", "edition", "price", "publisher", "publication_year", "page", "language", "note", "quantity", "sell_date", "status","user_id")
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            cursor.execute(insert_query, (book_id, bookTitle, edition, price, publisher, publication_year, page, language, note, 1, current_date ,'available' , username))
            # 檢查每個 subject 是否為空，非空則插入到 Book_Subject
            for subject in subjects:
                if subject.strip():  # 如果 subject 非空
                    try:
                    # 插入資料到 Book_Subject
                        insert_query = """
                            INSERT INTO "Book_Subject" ("book_id","subject")
                            VALUES (%s, %s);
                        """
                        cursor.execute(insert_query,(book_id,subject))
                    except Exception as e:
                        db.rollback()  # 如果插入失敗，回滾操作
                        print('upload fail')
                        return jsonify({'success': False}), 400
             # 檢查每個 author 是否為空，非空則插入到 Book_Author
            for author in authors:
                if author.strip():  # 如果 subject 非空
                    try:
                    # 插入資料
                        insert_query = """
                            INSERT INTO "Book_Author" ("book_id","author")
                            VALUES (%s, %s);
                        """
                        cursor.execute(insert_query,(book_id,author))
                    except Exception as e:
                        db.rollback()  # 如果插入失敗，回滾操作
                        print('upload fail')
                        return jsonify({'success': False}), 400
             # 檢查每個 translator 是否為空，非空則插入到 Book_Translator
            for translator in translators:
                if translator.strip():  # 如果 subject 非空
                    try:
                    # 插入資料
                        insert_query = """
                            INSERT INTO "Book_Translator" ("book_id","translator")
                            VALUES (%s, %s);
                        """
                        cursor.execute(insert_query,(book_id,translator))
                    except Exception as e:
                        db.rollback()  # 如果插入失敗，回滾操作
                        print('upload fail')
                        return jsonify({'success': False}), 400
            #插入交易形式    
            try:
                if transactionType == 'both':
                    insert_query = """
                        INSERT INTO "Book_Method" ("book_id","method")
                        VALUES (%s, %s);
                    """
                    cursor.execute(insert_query,(book_id,'face'))
                    cursor.execute(insert_query,(book_id,'delivery'))
                else:
                    insert_query = """
                        INSERT INTO "Book_Method" ("book_id","method")
                        VALUES (%s, %s);
                    """
                    cursor.execute(insert_query,(book_id,transactionType))     
            except Exception as e:
                    db.rollback()  # 如果插入失敗，回滾操作
                    print('upload fail')
                    return jsonify({'success': False}), 400

            db.commit()  # 提交事务
            print('upload succeed')
        except Exception as e:
            # 如果插入失败，回滚事务并返回错误信息
            db.rollback()
            print('upload fail')
            return jsonify({'success': False}), 400
        
        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400 
def cancelled_book(book_id, user_id):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT,client_encoding="UTF8")
        print("Successfully connect to DBMS.")
        cursor = db.cursor()

        user_id = int(user_id)        
        cursor.execute(
            sql.SQL('SELECT "user_id" FROM "Book" WHERE book_id = %s'),
            [book_id]
        )
        # 獲取查詢結果
        result = cursor.fetchone()
        if result:
            db_user_id = result[0]  # 從結果中獲取 user_id
            if db_user_id == user_id:
                # 如果 user_id 匹配，則更新 status 為 'cancelled'
                cursor.execute(
                    sql.SQL('UPDATE "Book" SET "status" = %s WHERE "book_id" = %s'),
                    ['canceled', book_id]
                )
                db.commit() 
                return jsonify({'success': True}), 200
            else:
                return jsonify({'success': False}), 400
        else: 
            return jsonify({'success': False}), 400 
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        return jsonify({'success': False}), 400    
    
def search_book(title):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
        print("Successfully connect to DBMS.")
        # 创建一个游标
        cursor = db.cursor()
        
        title = str(title)
        title = '%' + title + '%'
        
        # 獲取所有可購買二手書的資料
        query = sql.SQL("""
        SELECT array_agg((row_to_json(b)))
        FROM (
            SELECT * FROM "Book" 
            WHERE status = 'available' and  title LIKE %s
            ORDER BY book_id
        ) b;
        """)
        cursor.execute(query, (title,))
        # 获取查询结果
        book = cursor.fetchall()[0][0]

        #加上檢查type
        print(book)
        
        # 獲取所有可購買二手書的作者資料
        query = sql.SQL("""
        SELECT array_agg((row_to_json(t)))
        FROM (
            SELECT * FROM "Book_Author" 
            ORDER BY book_id
        ) t;
        """)
        cursor.execute(query)
        # 获取查询结果
        author = cursor.fetchall()[0][0]

        # 獲取所有可購買二手書的方法資料
        query = sql.SQL("""
        SELECT array_agg((row_to_json(t)))
        FROM (
            SELECT * FROM "Book_Method" 
            ORDER BY book_id
        ) t;
        """)
        cursor.execute(query)
        # 获取查询结果
        method = cursor.fetchall()[0][0]

        # 獲取所有可購買二手書的領域資料
        query = sql.SQL("""
        SELECT array_agg((row_to_json(t)))
        FROM (
            SELECT * FROM "Book_Subject" 
            ORDER BY book_id
        ) t;
        """)
        cursor.execute(query)
        # 获取查询结果
        subject = cursor.fetchall()[0][0]

        # 獲取所有可購買二手書的譯者資料
        query = sql.SQL("""
        SELECT array_agg((row_to_json(t)))
        FROM (
            SELECT* FROM "Book_Translator" 
            ORDER BY book_id
        ) t;
        """)
        cursor.execute(query)
        # 获取查询结果
        translator = cursor.fetchall()[0][0]
        
        list = []
        for i in range(len(book)):
            string = '書籍編號:' + str(book[i]['book_id']) + '書名:' + str(book[i]['title'])
            if(book[i]['edition'] is not None):
                string += '版本:' + str(book[i]['edition'])

            printBool = False    
            for j in range(len(author)):
                if(author[j]['book_id'] > book[i]['book_id']):
                    break
                if(author[j]['book_id'] == book[i]['book_id'] and printBool == False):
                    printBool = True
                    string += '作者:' + str(author[j]['author'])
                elif(author[j]['book_id'] == book[i]['book_id']):
                    string += ',' + str(author[j]['author'])

            printBool = False        
            for j in range(len(translator)):
                if(translator[j]['book_id'] > book[i]['book_id']):
                    break
                if(translator[j]['book_id'] == book[i]['book_id']  and printBool == False):
                    printBool = True
                    string += '譯者:' + str(translator[j]['translator'])
                elif(translator[j]['book_id'] == book[i]['book_id']):
                    string += ',' + str(translator[j]['translator'])
                    
            string += '價格:' + str(book[i]['price'])
            if(book[i]['publisher'] is not None):
                string += '出版商:' + str(book[i]['publisher'])
            if(book[i]['publication_year'] is not None):
                string += '出版年份:' + str(book[i]['publication_year'])
            if(book[i]['page'] is not None):
                string += '頁數:' + str(book[i]['page'])
            string += '語言:' + str(book[i]['language'])
            
            printBool = False
            for j in range(len(subject)):
                if(subject[j]['book_id'] > book[i]['book_id']):
                    break
                if(subject[j]['book_id'] == book[i]['book_id'] and printBool == False):
                    printBool = True
                    string += '領域:' + str(subject[j]['subject'])
                elif(subject[j]['book_id'] == book[i]['book_id']):
                    string += ',' + str(subject[j]['subject'])
                    
            string += '數量:' + str(book[i]['quantity'])
            if(book[i]['note'] is not None):
                string += '註記:' + str(book[i]['note'])

            printBool = False
            for j in range(len(method)):
                if(method[j]['book_id'] > book[i]['book_id']):
                    break
                if(method[j]['book_id'] == book[i]['book_id'] and printBool == False):
                    printBool = True
                    string += '接受交易方法:' + method[j]['method']
                elif(method[j]['book_id'] == book[i]['book_id']):
                    string += ',' + method[j]['method']

            string += '上架日期:' + str(book[i]['sell_date']) 
            list.append(string)
            
        return jsonify({'success': True, "list": list}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400

def buy_book(book_id, user_id,transactionType,city,district,road,doorplate):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT,client_encoding="UTF8")
        print("Successfully connect to DBMS.")
        cursor = db.cursor()

        book_id = int(book_id)

        try:
            query = '''
                    BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
                    UPDATE "Book" SET "status" = 'ongoing' WHERE "book_id" = %s and status = 'available';
                    COMMIT;
                    '''
            cursor.execute(query, (book_id,))
        except Exception as e:
            db.rollback()  # 如果插入失敗，回滾操作
            print('buy fail')
            return jsonify({'success': False}), 400

        user_id = int(user_id)
        current_date = datetime.today().date()
        cursor.execute('SELECT MAX("order_id") FROM "Order";')
        result = cursor.fetchone()
        if result[0] is None:
            order_id =1
        else:
            order_id = result[0] + 1
        try:
            # 插入数据到 order 表
            insert_query = """
                INSERT INTO "Order" ("order_id","book_id","user_id" ,"date", "method", "quantity", "city", "district", "road", "doorplate", "status")
                VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            cursor.execute(insert_query, (order_id, book_id, user_id, current_date, transactionType, 1, city, district, road, doorplate,'ongoing'))
        except Exception as e:
            db.rollback()  # 如果插入失敗，回滾操作
            print('buy fail')
            return jsonify({'success': False}), 400
        db.commit()
        print('buy success')
        return jsonify({'success': True}), 200
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        return jsonify({'success': False}), 400
    
def report(book_id, user_id,reason):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT,client_encoding="UTF8")
        print("Successfully connect to DBMS.")
        cursor = db.cursor()
        book_id = int(book_id)
        user_id = int(user_id)
        cursor.execute('SELECT MAX("report_id") FROM "Report";')
        result = cursor.fetchone()
        if result[0] is None:
            report_id =1
        else:
            report_id = result[0] + 1
        current_date = datetime.today().date()

        query = '''SELECT * FROM "Book" WHERE "book_id" = %s;'''
        cursor.execute(query, (book_id,))
        book = cursor.fetchone()

        if book:
            try:
                insert_query = """
                            INSERT INTO "Report" ("report_id","date","reason","status","user_id","book_id")
                            VALUES (%s, %s, %s, %s, %s, %s);
                        """
                cursor.execute(insert_query,(report_id,current_date,reason,'waiting',user_id,book_id))
                db.commit()
                print('report success')
                return jsonify({'success': True}), 200
            except Exception as e:
                db.rollback()  # 如果插入失敗，回滾操作
                print('report fail')
                return jsonify({'success': False}), 400   
        else:
            return jsonify({'success': False}), 400
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        return jsonify({'success': False}), 400
def view_order(user_id):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
        print("Successfully connect to DBMS.")
        # 创建一个游标
        cursor = db.cursor()
        
        user_id = int(user_id)
        
        # 獲取所有該使用者的購買紀錄
        query = sql.SQL("""
        SELECT array_agg((row_to_json(o)))
        FROM (
            SELECT * FROM "Order" 
            WHERE user_id = %s
        ) o;
        """)
        cursor.execute(query, (user_id,))
        # 获取查询结果
        order = cursor.fetchall()[0][0]
        
        #檢查是否為空
        if order is None:
            order = []

        list = []
        for i in range(len(order)):
            string = '訂單編號:' + str(order[i]['order_id']) + '購買的書籍編號:' + str(order[i]['book_id'])
            string += '買家編號:' + str(order[i]['user_id']) + '購買日期:' + str(order[i]['date'])
            if(order[i]['pickup_date'] == order[i]['pickup_date']):
                string += '取貨日期:' + str(order[i]['pickup_date'])
            string += '數量:' + str(order[i]['quantity'])
            string += '交貨方法:' + str(order[i]['method'])
            if(order[i]['city'] == order[i]['city'] and str(order[i]['district']) == str(order[i]['district']) and str(order[i]['road']) == str(order[i]['road']) and str(order[i]['doorplate']) == str(order[i]['doorplate'])):
                string += '地址:' + str(order[i]['city']) + str(order[i]['district']) + str(order[i]['road']) + str(order[i]['doorplate'])
            string += '交易狀態:' + str(order[i]['status'])
            if(order[i]['buyer_rate'] == order[i]['buyer_rate']):
                string += '買家評價:' + str(order[i]['buyer_rate'])
            if(order[i]['seller_rate'] == order[i]['seller_rate']):
                string += '賣家評價:' + str(order[i]['seller_rate'])
            if(order[i]['buyer_comment'] == order[i]['buyer_comment']):
                string += '買家評論:' + str(order[i]['buyer_comment'])
            if(order[i]['seller_comment'] == order[i]['seller_comment']):
                string += '賣家評論:' + str(order[i]['seller_comment'])

            list.append(string)

        return jsonify({'success': True, "list": list}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400

def view_report():
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
        print("Successfully connect to DBMS.")
        # 创建一个游标
        cursor = db.cursor()
        
        # 獲取尚未檢視的投訴
        query = sql.SQL("""
        SELECT array_agg((row_to_json(r)))
        FROM (
            SELECT * FROM "Report" 
            WHERE status = 'waiting'
        ) r;
        """)
        cursor.execute(query)
        # 获取查询结果
        report = cursor.fetchall()[0][0]
        
        #檢查是否為空
        if report is None:
            report = []
        
        list = []
        for i in range(len(report)):
            string = '投訴編號:' + str(report[i]['report_id']) + '投訴使用者編號:' + str(report[i]['user_id'])
            string += '投訴日期:' + str(report[i]['date']) + '投訴理由:' + str(report[i]['reason']) + '被投訴書籍編號:' + str(report[i]['book_id'])
            
            # 獲取二手書的資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(b)))
            FROM (
                SELECT * FROM "Book" 
                WHERE book_id = %s
            ) b;
            """)
            cursor.execute(query, (int(report[i]['book_id']),))
            # 获取查询结果
            book = cursor.fetchall()[0][0]
            string += '書名:' + str(book[0]['title'])
            if(book[0]['edition'] is not None):
                string += '版本:' + str(book[0]['edition'])
            
            # 獲取作者資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(a)))
            FROM (
                SELECT * FROM "Book_Author" 
                WHERE book_id = %s
            ) a;
            """)
            cursor.execute(query, (report[i]['book_id'],))
            # 获取查询结果
            author = cursor.fetchall()[0][0]
            if author is None:
                author = []
            printBool = False    
            for j in range(len(author)):
                if(author[j]['book_id'] == book[0]['book_id'] and printBool == False):
                    printBool = True
                    string += '作者:' + str(author[j]['author'])
                elif(author[j]['book_id'] == book[0]['book_id']):
                    string += ',' + str(author[j]['author'])

            
            # 獲取譯者資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(t)))
            FROM (
                SELECT* FROM "Book_Translator" 
                WHERE book_id = %s
            ) t;
            """)
            cursor.execute(query, (report[i]['book_id'],))
            # 获取查询结果
            translator = cursor.fetchall()[0][0]
            if translator is None:
                translator = []
            printBool = False        
            for j in range(len(translator)):
                if(translator[j]['book_id'] == book[0]['book_id']  and printBool == False):
                    printBool = True
                    string += '譯者:' + str(translator[j]['translator'])
                elif(translator[j]['book_id'] == book[0]['book_id']):
                    string += ',' + str(translator[j]['translator'])
                    
            string += '價格:' + str(book[0]['price'])
            if(book[0]['publisher'] is not None):
                string += '出版商:' + str(book[0]['publisher'])
            if(book[0]['publication_year'] is not None):
                string += '出版年份:' + str(book[0]['publication_year'])
            if(book[0]['page'] is not None):
                string += '頁數:' + str(book[0]['page'])
            string += '語言:' + str(book[0]['language'])
            
            # 獲取領域資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(s)))
            FROM (
                SELECT * FROM "Book_Subject" 
                WHERE book_id = %s
            ) s;
            """)
            cursor.execute(query, (report[i]['book_id'],))
            # 获取查询结果
            subject = cursor.fetchall()[0][0]
            if subject is None:
                subject = []
            printBool = False
            for j in range(len(subject)):
                if(subject[j]['book_id'] == book[0]['book_id'] and printBool == False):
                    printBool = True
                    string += '領域:' + str(subject[j]['subject'])
                elif(subject[j]['book_id'] == book[0]['book_id']):
                    string += ',' + str(subject[j]['subject'])
                    
            string += '數量:' + str(book[0]['quantity'])
            if(book[0]['note'] is not None):
                string += '註記:' + str(book[0]['note'])

            # 獲取交易方法資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(m)))
            FROM (
                SELECT * FROM "Book_Method" 
                WHERE book_id = %s
            ) m;
            """)
            cursor.execute(query, (report[i]['book_id'],))
            # 获取查询结果
            method = cursor.fetchall()[0][0]
            if method is None:
                method = []
            printBool = False
            for j in range(len(method)):
                if(method[j]['book_id'] == book[0]['book_id'] and printBool == False):
                    printBool = True
                    string += '接受交易方法:' + method[j]['method']
                elif(method[j]['book_id'] == book[0]['book_id']):
                    string += ',' + method[j]['method']

            string += '上架日期:' + str(book[0]['sell_date'])

            list.append(string)
    
        return jsonify({'success': True, "list": list}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400

def decide_report(report_id,admin_id,choise):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT,client_encoding="UTF8")
        print("Successfully connect to DBMS.")
        cursor = db.cursor()
        report_id = int(report_id)
        admin_id = int(admin_id)
        current_date = datetime.today().date()
        
        try:
            # 執行 UPDATE 查詢，使用佔位符 %s
            query = '''UPDATE "Report"
                   SET "check_date" = %s, "admin_id" = %s,"status"= %s
                   WHERE "report_id" = %s;'''
            cursor.execute(query, (current_date, admin_id, choise,report_id))
            db.commit()
            print('alert success')
            return jsonify({'success': True}), 200
        except Exception as e:
            db.rollback()
            print('alert fail')
            return jsonify({'success': False}), 400       
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400

def own_book(user_id):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
        print("Successfully connect to DBMS.")
        # 创建一个游标
        cursor = db.cursor()
        
        user_id = int(user_id)
        
        # 獲取所有可購買二手書的資料
        query = sql.SQL("""
        SELECT array_agg((row_to_json(b)))
        FROM (
            SELECT * FROM "Book" 
            WHERE user_id = %s
        ) b;
        """)
        cursor.execute(query, (user_id,))
        # 获取查询结果
        book = cursor.fetchall()[0][0]

        if(book is None):
            book = []
        
        list = []
        for i in range(len(book)):
            string = '書籍編號:' + str(book[i]['book_id']) + '書名:' + str(book[i]['title'])
            if(book[i]['edition'] is not None):
                string += '版本:' + str(book[i]['edition'])

            # 獲取作者資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(a)))
            FROM (
                SELECT * FROM "Book_Author" 
                WHERE book_id = %s
            ) a;
            """)
            cursor.execute(query, (book[i]['book_id'],))
            # 获取查询结果
            author = cursor.fetchall()[0][0]
            if author is None:
                author = []
            printBool = False    
            for j in range(len(author)):
                if(author[j]['book_id'] > book[i]['book_id']):
                    break
                if(author[j]['book_id'] == book[i]['book_id'] and printBool == False):
                    printBool = True
                    string += '作者:' + str(author[j]['author'])
                elif(author[j]['book_id'] == book[i]['book_id']):
                    string += ',' + str(author[j]['author'])

            # 獲取譯者資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(t)))
            FROM (
                SELECT* FROM "Book_Translator" 
                WHERE book_id = %s
            ) t;
            """)
            cursor.execute(query, (book[i]['book_id'],))
            # 获取查询结果
            translator = cursor.fetchall()[0][0]
            if translator is None:
                translator = []
            printBool = False        
            for j in range(len(translator)):
                if(translator[j]['book_id'] > book[i]['book_id']):
                    break
                if(translator[j]['book_id'] == book[i]['book_id']  and printBool == False):
                    printBool = True
                    string += '譯者:' + str(translator[j]['translator'])
                elif(translator[j]['book_id'] == book[i]['book_id']):
                    string += ',' + str(translator[j]['translator'])
                    
            string += '價格:' + str(book[i]['price'])
            if(book[i]['publisher'] is not None):
                string += '出版商:' + str(book[i]['publisher'])
            if(book[i]['publication_year'] is not None):
                string += '出版年份:' + str(book[i]['publication_year'])
            if(book[i]['page'] is not None):
                string += '頁數:' + str(book[i]['page'])
            string += '語言:' + str(book[i]['language'])
            
            # 獲取領域資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(s)))
            FROM (
                SELECT * FROM "Book_Subject" 
                WHERE book_id = %s
            ) s;
            """)
            cursor.execute(query, (book[i]['book_id'],))
            # 获取查询结果
            subject = cursor.fetchall()[0][0]
            if subject is None:
                subject = []
            printBool = False
            for j in range(len(subject)):
                if(subject[j]['book_id'] > book[i]['book_id']):
                    break
                if(subject[j]['book_id'] == book[i]['book_id'] and printBool == False):
                    printBool = True
                    string += '領域:' + str(subject[j]['subject'])
                elif(subject[j]['book_id'] == book[i]['book_id']):
                    string += ',' + str(subject[j]['subject'])
                    
            string += '數量:' + str(book[i]['quantity'])
            if(book[i]['note'] is not None):
                string += '註記:' + str(book[i]['note'])

            # 獲取交易方法資料
            query = sql.SQL("""
            SELECT array_agg((row_to_json(m)))
            FROM (
                SELECT * FROM "Book_Method" 
                WHERE book_id = %s
            ) m;
            """)
            cursor.execute(query, (book[i]['book_id'],))
            # 获取查询结果
            method = cursor.fetchall()[0][0]
            if method is None:
                method = []
            printBool = False
            for j in range(len(method)):
                if(method[j]['book_id'] > book[i]['book_id']):
                    break
                if(method[j]['book_id'] == book[i]['book_id'] and printBool == False):
                    printBool = True
                    string += '接受交易方法:' + method[j]['method']
                elif(method[j]['book_id'] == book[i]['book_id']):
                    string += ',' + method[j]['method']

            string += '上架日期:' + str(book[i]['sell_date']) 
            list.append(string)
            
        return jsonify({'success': True, "list": list}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400
    
def ban_user(admin_id,user_id,reason):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT,client_encoding="UTF8")
        print("Successfully connect to DBMS.")
        cursor = db.cursor()
        user_id = int(user_id)
        admin_id = int(admin_id)
        current_date = datetime.today().date()
        try:
            query_check = '''SELECT * FROM "User" WHERE "user_id" = %s;'''
            cursor.execute(query_check, (user_id,))
            user = cursor.fetchone()
            if not user:
                return jsonify({'success': False}), 400
            query_update = '''UPDATE "User"
                          SET "status" = %s
                          WHERE "user_id" = %s;'''
            cursor.execute(query_update, ('banned', user_id))
            insert_query = """
                INSERT INTO "Delete_Record" ("user_id","admin_id","date","reason")
                VALUES (%s, %s, %s, %s);
            """
            cursor.execute(insert_query,(user_id,admin_id,current_date,reason))
            print('ban user succeed')
            db.commit()
            return jsonify({'success': True}), 200
        except Exception as e:
            print('ban user fail')
            db.rollback()
            return jsonify({'success': False}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False}), 400
    
def cancel(admin_id, book_id,reason):
    try:
        db = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASSWORD, 
                              host=DB_HOST, port=DB_PORT,client_encoding="UTF8")
        print("Successfully connect to DBMS.")
        cursor = db.cursor()
        book_id = int(book_id)
        query = '''SELECT * FROM "Book" WHERE "book_id" = %s and status <> 'canceled' ;'''
        cursor.execute(query, (book_id,))
        book = cursor.fetchone()

        admin_id = int(admin_id)
        current_date = datetime.today().date()
        reason = str(reason)
        
        if book:
            try:
                query = '''
                        UPDATE "Book" 
                        SET status = 'canceled'
                        WHERE "book_id" = %s;
                        '''
                cursor.execute(query, (book_id,))

                insert_query = """
                            INSERT INTO "Cancel_Record" ("book_id","admin_id","date","reason")
                            VALUES (%s, %s, %s, %s);
                        """
                cursor.execute(insert_query,(book_id,admin_id,current_date,reason))
                db.commit()
                print('cancel success')
                return jsonify({'success': True}), 200
            except Exception as e:
                db.rollback()  # 如果插入失敗，回滾操作
                print('cancel fail')
                return jsonify({'success': False}), 400   
        else:
            return jsonify({'success': False}), 400
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        return jsonify({'success': False}), 400

#接收路徑
@app.route('/action', methods=['POST'])
def verify_login():
    # 從前端接收 JSON 數據
    data = request.get_json()
    action = data.get('action')
    print(action)

    #用action選擇function
    if(action == 'admin_login'): 
        username = data.get('username')
        password = data.get('password')
        return admin_login(username, password)
    elif(action == 'user_login'): 
        username = data.get('username')
        password = data.get('password')
        return user_login(username, password)
    elif(action == 'create_account'): 
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        name = data.get('name')
        gender = data.get('gender')
        dob = data.get('dob')  # 日期字段
        contact = data.get('contact')
        school = data.get('school')
        city = data.get('city')
        # 调用 create_account 函数并传递所有参数
        return create_account(username, password, email, name, gender, dob, contact, school, city) 
    elif(action == 'upload_book'):
        bookTitle =  data.get('bookTitle')
        edition = data.get('edition')
        price = data.get('price')
        publisher = data.get('publisher')
        publication_year = data.get('publication_year')
        page = data.get('page')
        language = data.get('language')
        note = data.get('note')
        username = data.get('username')
        # 科目、作者、譯者處理（這些資料是列表形式）
        subjects = data.get('subject', [])
        authors = data.get('author', [])
        translators = data.get('translator', [])
        # 交易方式
        transactionType = data.get('transactionType')
        return upload_book(bookTitle, edition, price, publisher, publication_year, page, language, note, username,subjects,authors,translators,transactionType)
    elif(action == 'cancelled_book'):
        book_id = data.get('book_id')
        user_id = data.get('user_id')
        return cancelled_book(book_id, user_id)
    elif(action == 'search_book'):
        title = data.get('title')
        return search_book(title)
    elif(action == 'buy_book'):
        book_id = data.get('book_id')
        user_id = data.get('user_id')
        transactionType =data.get('transactionType')
        city = data.get('city')
        district = data.get('district')
        road = data.get('road')
        doorplate = data.get('doorplate')
        return buy_book(book_id, user_id,transactionType,city,district,road,doorplate)
    elif(action == 'report'):
        book_id = data.get('book_id')
        user_id = data.get('user_id')
        reason = data.get('reason')
        return report(book_id, user_id, reason)
    elif(action == 'view_order'):
        user_id = data.get('user_id')
        return view_order(user_id)
    elif(action == 'view_report'):
        return view_report()
    elif(action == 'decide_report'):
        report_id = data.get('report_id')
        admin_id = data.get('admin_id')
        choise = data.get('choise')
        return decide_report(report_id,admin_id,choise)
    elif(action == 'own_book'):
        user_id = data.get('user_id')
        return own_book(user_id)
    elif(action == 'ban_user'):
        admin_id = data.get('admin_id')
        user_id = data.get('user_id')
        reason = data.get('reason')
        return ban_user(admin_id,user_id,reason)
    elif(action == 'cancel'):
        admin_id = data.get('admin_id')
        book_id = data.get('book_id')
        reason = data.get('reason')
        return cancel(admin_id, book_id,reason)
    else:
        return jsonify({'success': False, 'message': 'Unknown action'}), 400


if __name__ == '__main__':
    app.run(debug=True)
