// 取得按鈕和內容區域
const btnAdmin = document.getElementById("btnAdmin");
const btnUser = document.getElementById("btnUser");
const btnCreate = document.getElementById("btnCreate");
const content = document.getElementById("content");

// 監聽按鈕點擊事件，根據選擇顯示不同的內容
btnAdmin.addEventListener("click", function() {
    showLoginFields_admin();
});

btnUser.addEventListener("click", function() {
    showLoginFields_user();
});

btnCreate.addEventListener("click", function() {
    showLoginFields_create();
});

// 顯示admin帳號和密碼欄位
function showLoginFields_admin() {

    // 清空 content 區域
    content.innerHTML = `
        <p>請輸入adminID和密碼</p>
        <label for="username">ID：</label>
        <input type="text" id="username" placeholder="輸入ID">
        <label for="password">密碼：</label>
        <input type="password" id="password" placeholder="輸入密碼">
        <button id="submitBtn">提交</button>
        <div id="error" class="error"></div>
    `;

    // 綁定提交按鈕事件
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("error");
    submitBtn.addEventListener("click", function() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
                //用action幫後端判斷使用何種功能
        const action = "admin_login" ;

        // 使用 fetch 向後端發送 POST 請

        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                username: username,
                password: password 
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析 JSON 回應
        .then(data => {
            if (data.success) {    
                errorDiv.innerHTML = "";  // 清除錯誤訊息            
                showFunctionSelect_admin(username);  // 顯示下拉選單
            } else {
                errorDiv.innerHTML = "帳號或密碼錯誤，請重新輸入。";
            }
        })
        .catch(error => {
            document.getElementById("result").textContent = "Error: " + error;
        });
    });
}

// 顯示user帳號和密碼欄位
function showLoginFields_user() {

    // 清空 content 區域
    content.innerHTML = `
        <p>請輸入userID和密碼</p>
        <label for="username">ID：</label>
        <input type="text" id="username" placeholder="輸入ID">
        <label for="password">密碼：</label>
        <input type="password" id="password" placeholder="輸入密碼">
        <button id="submitBtn">提交</button>
        <div id="error" class="error"></div>
    `;

    // 綁定提交按鈕事件
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("error");
    submitBtn.addEventListener("click", function() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
                //用action幫後端判斷使用何種功能
        const action = "user_login" ;

        // 使用 fetch 向後端發送 POST 請

        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                username: username,
                password: password 
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析 JSON 回應
        .then(data => {
            if (data.success) {    
                errorDiv.innerHTML = "";  // 清除錯誤訊息            
                showFunctionSelect_user(username);  // 顯示下拉選單
            } else {
                errorDiv.innerHTML = "帳號或密碼錯誤，請重新輸入。";
            }
        })
        .catch(error => {
            document.getElementById("result").textContent = "Error: " + error;
        });
    });
}

//顯示創建帳號欄位
function showLoginFields_create() {

    // 清空 content 區域
    content.innerHTML = `
    <p>請輸入要創建的帳號ID和個人資訊</p>
    <label for="username">ID(必須為數字)：</label>
    <input type="text" id="username" placeholder="輸入ID(必須為數字)" required>
    <label for="password">密碼：</label>
    <input type="password" id="password" placeholder="輸入密碼" required>
    
    <label for="email">Email：</label>
    <input type="email" id="email" placeholder="輸入Email" required>
    
    <label for="name">名字：</label>
    <input type="text" id="name" placeholder="輸入名字" required>
    
    <label for="gender">性別：</label>
    <select id="gender" required>
        <option value="">選擇性別</option>
        <option value="male">男</option>
        <option value="female">女</option>
        <option value="other">其他</option>
    </select>
    
    <label for="dob">出生日：</label>
    <input type="date" id="dob" required>
    
    <label for="contact">聯絡資訊：</label>
    <input type="text" id="contact" placeholder="輸入聯絡資訊" required>
    
    <label for="school">學校：</label>
    <input type="text" id="school" placeholder="輸入學校名稱" required>
    
    <label for="city">居住縣市：</label>
    <input type="text" id="city" placeholder="輸入居住縣市" required>
    
    <button id="submitBtn">創建</button>
    <div id="error" class="error"></div>
    `;

    // 綁定提交按鈕事件
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("error"); 

    submitBtn.addEventListener("click", function() {
        // 清空错误信息
        document.getElementById('error').innerHTML = '';

            // 获取所有输入字段
        const fields = [
            { id: 'username', label: 'ID' },
            { id: 'password', label: '密碼' },
            { id: 'email', label: 'Email' },
            { id: 'name', label: '名字' },
            { id: 'gender', label: '性別' },
            { id: 'dob', label: '出生日' },
            { id: 'contact', label: '聯絡資訊' },
            { id: 'school', label: '學校' },
            { id: 'city', label: '居住縣市' }
        ];

        // 检查每个字段是否为空
        let isValid = true;

        // 遍历每个字段，检查是否填写
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const input = document.getElementById(field.id);
    
            // 如果字段为空，添加错误信息并停止验证
            if (!input.value.trim() || (input.tagName === 'SELECT' && input.value === '')) {
                isValid = false;
                document.getElementById('error').innerHTML = `<p>請填寫欄位：${field.label}</p>`;
                break; // 停止循环
            }
        }
        
         // 如果所有字段填写了，继续提交操作
        if (isValid) {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const email = document.getElementById("email").value;
            const name = document.getElementById("name").value;
            const gender = document.getElementById("gender").value;
            const dob = document.getElementById("dob").value;
            const contact = document.getElementById("contact").value;
            const school = document.getElementById("school").value;
            const city = document.getElementById("city").value;
            // 用 action 來告知後端使用哪一個功能
            const action = "create_account" ;
            
            // 使用 fetch 向後端發送 POST 請
            fetch("http://127.0.0.1:5000/action", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    action: action,
                    username: username,
                    password: password,
                    email: email,
                    name: name,
                    gender: gender,
                    dob: dob,
                    contact: contact,
                    school: school,
                    city: city 
                }) // 將密碼作為 JSON 發送
            })
    
            .then(response => response.json()) // 解析 JSON 回應
            .then(data => {
                if (data.success) {    
                    errorDiv.innerHTML = "";  // 清除錯誤訊息
                    content.innerHTML = '<p>創建成功</p>'            
                } else {
                    errorDiv.innerHTML = "ID已存在或ID錯誤，請選擇其他ID。";
                }
            })
            .catch(error => {
                document.getElementById("result").textContent = "Error: " + error;
            });
        } else {
        // 阻止默认表单提交
            event.preventDefault();
        }
    });
}

// 顯示admin下拉選單
function showFunctionSelect_admin(username) {
    content.innerHTML = `
        <div class="select-menu">
            <p>歡迎，您已成功登入！請選擇功能：</p>
            <select id="functionSelect">
                <option value="none" disabled selected>選擇功能</option>
                <option value="feature1">檢視投訴</option>
                <option value="feature2">接受/拒絕投訴</option>
                <option value="feature3">刪除user</option>
                <option value="feature4">刪除二手書資訊</option>
                <option value="feature5">檢視購買紀錄</option>
            </select>
        </div>
        <div id="inputFields"></div> <!-- 用來顯示動態輸入欄位 -->
    `;
    
    // 監聽下拉選單變化
    const selectMenu = document.getElementById("functionSelect");
    selectMenu.addEventListener("change", function() {
        const selectedFeature = selectMenu.value;
        const inputContainer = document.getElementById('inputFields');
        inputContainer.innerHTML = ''; // 清空之前的輸入欄位
        switch (selectedFeature) {
            case "feature1":
                view_report();
                break;
            case "feature2":
                decide_report(inputContainer,username);
                break;
            case "feature3":
                ban_user(inputContainer,username);
                break;
            case "feature4":
                cancel(inputContainer,username);
                break;
            case "feature5":
                admin_search(inputContainer,username);
                break;
        }
    });
}

function cancel(inputContainer,username){
    // 清空 content 區域
    content.innerHTML = `
        <p>刪除二手書資訊</p>
        <label for="book_id">二手書ID：</label>
        <input type="text" id="book_id" name="book_id" placeholder="ID" required>
        <label for="reason">理由：</label>
        <input type="text" id="reason" name="reason" placeholder="ID" required>
        <button id="submitBtn">刪除</button>
        <div id="error" class="error"></div>
    `;
    // 監聽提交按鈕
    document.getElementById('submitBtn').addEventListener('click', function() {
        
        const book_id = document.getElementById('book_id').value;
        const reason = document.getElementById('reason').value;
        if (!book_id || !reason) {
            alert('有未填寫欄位');
            return;
        }
        // 用 action 來告知後端使用哪一個功能
        const action = "cancel" ;         
        // 使用 fetch 向後端發送 POST 請
        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                admin_id: username,
                book_id: book_id,
                reason: reason
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析後端回傳的 JSON
        .then(data => {
            const content = document.getElementById('content');  // 假設你要顯示結果的區域是 content
        
            if (data.success) {  // 根據後端回傳的 success 字段顯示結果
                content.innerHTML = '<p>刪除成功</p>';
            } else {
                alert('刪除失敗，請檢察ID是否有誤');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // 輸出錯誤訊息到控制台
            const content = document.getElementById('content');  // 假設你要顯示錯誤訊息的區域是 content
            content.innerHTML = '<p>錯誤: 失敗</p>';  // 發生錯誤時顯示錯誤訊息
        });
    });

}

function admin_search(inputContainer,username){
    // 清空 content 區域
    content.innerHTML = `
        <p>查詢購買紀錄</p>
        <label for="report_id">查詢ID：</label>
        <input type="text" id="report_id" name="report_id" placeholder="查詢ID" required>
        <button id="submitBtn">查詢</button>
        <div id="error" class="error"></div>
    `;

    // 綁定提交按鈕事件
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("error");
    submitBtn.addEventListener("click", function() {
        const user_id = document.getElementById('report_id').value;
        //用action幫後端判斷使用何種功能
        const action = "own_book" ;

        // 使用 fetch 向後端發送 POST 請

        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                user_id: user_id 
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析 JSON 回應
        .then(data => {
            errorDiv.innerHTML = "";  // 清除錯誤訊息 

            // 清空內容並新增列表標題
            content.innerHTML = "<h2>獲取的清單：</h2><ul id='list'></ul>";
            const listContainer = document.getElementById("list");

            // 遍歷清單並新增到前端
            data.list.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item; // 假設清單是單純的文字
                listContainer.appendChild(listItem);
            });
        })
        .catch(error => {
            document.getElementById("result").textContent = "Error: " + error;
        });
    });
}

function view_report(){
    // 清空 content 區域
    content.innerHTML = `
        <p>查詢投訴</p>
        <button id="submitBtn">查詢</button>
        <div id="error" class="error"></div>
    `;

    // 綁定提交按鈕事件
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("error");
    submitBtn.addEventListener("click", function() {

                //用action幫後端判斷使用何種功能
        const action = "view_report" ;

        // 使用 fetch 向後端發送 POST 請

        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析 JSON 回應
        .then(data => {
            errorDiv.innerHTML = "";  // 清除錯誤訊息 

            // 清空內容並新增列表標題
            content.innerHTML = "<h2>獲取的清單：</h2><ul id='list'></ul>";
            const listContainer = document.getElementById("list");

            // 遍歷清單並新增到前端
            data.list.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item; // 假設清單是單純的文字
                listContainer.appendChild(listItem);
            });
        })
        .catch(error => {
            document.getElementById("result").textContent = "Error: " + error;
        });
    });
}

function decide_report(inputContainer,username){
    inputContainer.innerHTML = `
        <p>您已選擇功能：處理投訴</p>
        <label for="report_id">投訴ID：</label>
        <input type="text" id="report_id" name="report_id" placeholder="投訴ID" required>
        <select id="choise" name="choise">
            <option value="accept">接受投訴</option>
            <option value="deny">拒絕投訴</option>
        </select>
        <button id="submitFeature1">提交</button>
    `;
    // 監聽提交按鈕
    document.getElementById('submitFeature1').addEventListener('click', function() {
        
        const report_id = document.getElementById('report_id').value;
        const choise = document.getElementById('choise').value;
        if (!report_id) {
            alert('請填寫投訴ID');
            return;
        }
        // 用 action 來告知後端使用哪一個功能
        const action = "decide_report" ;         
        // 使用 fetch 向後端發送 POST 請
        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                admin_id: username,
                report_id: report_id,
                choise: choise
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析後端回傳的 JSON
        .then(data => {
            const content = document.getElementById('content');  // 假設你要顯示結果的區域是 content
        
            if (data.success) {  // 根據後端回傳的 success 字段顯示結果
                content.innerHTML = '<p>處理成功</p>';
            } else {
                alert('處理失敗，請檢察ID是否有誤');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // 輸出錯誤訊息到控制台
            const content = document.getElementById('content');  // 假設你要顯示錯誤訊息的區域是 content
            content.innerHTML = '<p>錯誤: 失敗</p>';  // 發生錯誤時顯示錯誤訊息
        });
    });
}

function ban_user(inputContainer,username){
    inputContainer.innerHTML = `
        <p>您已選擇功能：刪除user</p>
        <label for="user_id">要刪除的userID(必填)：</label>
        <input type="text" id="user_id" name="user_id" placeholder="ID" required>
        <label for="reason">刪除原因(必填)：</label>
        <input type="text" id="reason" name="reason" placeholder="原因" required>
        <button id="submitFeature7">確認刪除</button>
    `;
    // 監聽提交按鈕
    document.getElementById('submitFeature7').addEventListener('click', function() {
        
        const user_id = document.getElementById('user_id').value;
        const reason = document.getElementById('reason').value;
        if (!user_id || !reason) {
            alert('有未填寫欄位');
            return;
        }
        // 用 action 來告知後端使用哪一個功能
        const action = "ban_user" ;         
        // 使用 fetch 向後端發送 POST 請
        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                admin_id: username,
                user_id: user_id,
                reason: reason
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析後端回傳的 JSON
        .then(data => {
            const content = document.getElementById('content');  // 假設你要顯示結果的區域是 content
        
            if (data.success) {  // 根據後端回傳的 success 字段顯示結果
                content.innerHTML = '<p>刪除成功</p>';
            } else {
                alert('刪除失敗，請檢察ID是否有誤');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // 輸出錯誤訊息到控制台
            const content = document.getElementById('content');  // 假設你要顯示錯誤訊息的區域是 content
            content.innerHTML = '<p>錯誤: 失敗</p>';  // 發生錯誤時顯示錯誤訊息
        });
    });
}

function admin_canceled(inputContainer,username){
    inputContainer.innerHTML = `
        <p>您已選擇功能：刪除二手書資訊</p>
        <label for="user_id">要刪除的bookID(必填)：</label>
        <input type="text" id="user_id" name="user_id" placeholder="ID" required>
        <label for="reason">刪除原因(必填)：</label>
        <input type="text" id="reason" name="reason" placeholder="原因" required>
        <button id="submitFeature7">確認刪除</button>
    `;
    // 監聽提交按鈕
    document.getElementById('submitFeature7').addEventListener('click', function() {
        if (!user_id || !reason) {
            alert('有未填寫欄位');
            return;
        }
        // 用 action 來告知後端使用哪一個功能
        const action = "admin_canceled" ;
        // 使用 fetch 向後端發送 POST 請
        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                admin_id: username,
                book_id: user_id,
                reason: reason
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析後端回傳的 JSON
        .then(data => {
            const content = document.getElementById('content');  // 假設你要顯示結果的區域是 content
        
            if (data.success) {  // 根據後端回傳的 success 字段顯示結果
                content.innerHTML = '<p>刪除成功</p>';
            } else {
                alert('刪除失敗，請檢察ID是否有誤');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // 輸出錯誤訊息到控制台
            const content = document.getElementById('content');  // 假設你要顯示錯誤訊息的區域是 content
            content.innerHTML = '<p>錯誤: 失敗</p>';  // 發生錯誤時顯示錯誤訊息
        });
    });         
}


// 顯示user下拉選單
function showFunctionSelect_user(username) {
    content.innerHTML = `
        <div class="select-menu">
            <p>歡迎，您已成功登入！請選擇功能：</p>
            <select id="functionSelect">
                <option value="none" disabled selected>選擇功能</option>
                <option value="feature1">上傳二手書資訊</option>
                <option value="feature2">查詢二手書資訊</option>
                <option value="feature3">刪除已上傳的二手書</option>
                <option value="feature4">購買二手書</option>
                <option value="feature5">檢視購買紀錄</option>
                <option value="feature6">投訴</option>
                <option value="feature7">檢視已上傳的書</option>
            </select>
        </div>
        <div id="inputFields"></div> <!-- 用來顯示動態輸入欄位 -->
    `;
    
    // 監聽下拉選單變化
    const selectMenu = document.getElementById("functionSelect");
    selectMenu.addEventListener("change", function() {
        const selectedFeature = selectMenu.value;
        const inputContainer = document.getElementById('inputFields');
        inputContainer.innerHTML = ''; // 清空之前的輸入欄位

        switch (selectedFeature) {
            case "feature1":
                upload_book(inputContainer,username);
                break;
            case "feature2":
                showBook();
                break;
            case "feature3":
                cancelled_book(inputContainer,username);
                break;
            case "feature4":
                buy_book(inputContainer,username);
                break;
            case "feature5":
                view_order(username);
                break;
            case "feature6":
                report(inputContainer,username);
                break;
            case "feature7":
                own_book(username);
                break;
        }
    });
}

function upload_book(inputContainer,username) {
    inputContainer.innerHTML = `
        <p>您已選擇功能：上傳二手書資訊</p>
        <label for="bookTitle">書名(必填)：</label>
        <input type="text" id="bookTitle" name="bookTitle" placeholder="輸入書名" required>
        <label for="edition">版本：</label>
        <input type="text" id="edition" name="edition" placeholder="輸入版本">
        <label for="price">價格(必填)：</label>
        <input type="number" id="price" name="price" placeholder="輸入價格" required>
        <label for="publisher">出版社：</label>
        <input type="text" id="publisher" name="publisher" placeholder="輸入出版社">
        <label for="publication_year">出版年份(必填)(輸入四位數字)：</label>
        <input type="number" id="publication_year" name="publication_year" placeholder="輸入出版年份" required>
        <label for="page">頁數(必填)：</label>
        <input type="number" id="page" name="page" placeholder="輸入頁數">
        <label for="language">語言(必填)：</label>
        <input type="text" id="language" name="language" placeholder="輸入語言" required>
        <label for="note">書況：</label>
        <input type="text" id="note" name="note" placeholder="輸入書況">

        <!-- 新增的科目輸入欄位 -->
        <label for="subject">科目：</label>
        <div id="subject" style="display: flex;">
            <input type="text" id="subject1" name="subject1" placeholder="科目1">
            <input type="text" id="subject2" name="subject2" placeholder="科目2">
            <input type="text" id="subject3" name="subject3" placeholder="科目3">
        </div>
        <!-- 新增的作者輸入欄位 -->
        <label for="author">作者(至少一位)：</label>
        <div id="author" style="display: flex;">
            <input type="text" id="author1" name="author1" placeholder="作者1">
            <input type="text" id="author2" name="author2" placeholder="作者2">
            <input type="text" id="author3" name="author3" placeholder="作者3">
        </div>
        <!-- 新增的譯者輸入欄位 -->
        <label for="translator">譯者：</label>
        <div id="translator" style="display: flex;">
            <input type="text" id="translator1" name="translator1" placeholder="譯者1">
            <input type="text" id="translator2" name="translator2" placeholder="譯者2">
            <input type="text" id="translator3" name="translator3" placeholder="譯者3">
        </div>
        <!-- 新增的交易方式選擇欄位 -->
        <label for="transactionType">交易方式(必填)：</label>
        <select id="transactionType" name="transactionType">
            <option value="face">面交</option>
            <option value="delivery">郵寄</option>
            <option value="both">兩者皆可</option>
        </select>
        <button id="submitFeature1">提交上傳資訊</button>

    `;
    // 監聽提交按鈕
    document.getElementById('submitFeature1').addEventListener('click', function() {
        
        const bookTitle = document.getElementById('bookTitle').value;
        const edition = document.getElementById('edition').value;
        const price = document.getElementById('price').value;
        const publisher = document.getElementById('publisher').value;
        const publication_year = document.getElementById('publication_year').value;
        const page = document.getElementById('page').value;
        const language = document.getElementById('language').value;
        const note = document.getElementById('note').value;
            // 讀取新增的科目欄位值
        const subject1 = document.getElementById('subject1').value;
        const subject2 = document.getElementById('subject2').value;
        const subject3 = document.getElementById('subject3').value;
    
    // 讀取新增的作者欄位值
        const author1 = document.getElementById('author1').value;
        const author2 = document.getElementById('author2').value;
        const author3 = document.getElementById('author3').value;

    // 讀取新增的譯者欄位值
        const translator1 = document.getElementById('translator1').value;
        const translator2 = document.getElementById('translator2').value;
        const translator3 = document.getElementById('translator3').value;

    // 讀取交易方式選擇的值
        const transactionType = document.getElementById('transactionType').value;
        // 如果有必填項目未填寫，提示錯誤
        if (!bookTitle || !price || !publication_year || !language || !page) {
            alert('請填寫所有必填項目！');
            return;
        }
        if (!author1 && !author2 && !author3) {
            alert('請填寫所有必填項目！');
            return;
        }
  
        // 用 action 來告知後端使用哪一個功能
        const action = "upload_book" ;         
        // 使用 fetch 向後端發送 POST 請
        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                bookTitle: bookTitle,
                edition: edition,
                price: price,
                publisher: publisher,
                publication_year: publication_year,
                page: page,
                language: language,
                note: note,
                username: username,
                subject: [subject1, subject2, subject3], // 將科目作為數組
                author: [author1, author2, author3], // 將作者作為數組
                translator: [translator1, translator2, translator3], // 將譯者作為數組
                transactionType: transactionType // 傳遞交易方式
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析後端回傳的 JSON
        .then(data => {
            const content = document.getElementById('content');  // 假設你要顯示結果的區域是 content
        
            if (data.success) {  // 根據後端回傳的 success 字段顯示結果
                content.innerHTML = '<p>上傳成功</p>';
            } else {
                alert('上傳失敗，請檢察欄位是否有誤');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // 輸出錯誤訊息到控制台
            const content = document.getElementById('content');  // 假設你要顯示錯誤訊息的區域是 content
            content.innerHTML = '<p>錯誤: 失敗</p>';  // 發生錯誤時顯示錯誤訊息
        });
    });
}

function showBook(){
    // 清空 content 區域
    content.innerHTML = `
        <p>請輸入要查詢的書名</p>
        <label for="title">書名：</label>
        <input type="text" id="title" placeholder="輸入書名" required>
        <button id="submitBtn">提交</button>
        <div id="error" class="error"></div>
    `;

    // 綁定提交按鈕事件
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("error");
    submitBtn.addEventListener("click", function() {
        const title = document.getElementById("title").value;

                //用action幫後端判斷使用何種功能
        const action = "search_book" ;

        // 使用 fetch 向後端發送 POST 請

        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                title: title 
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析 JSON 回應
        .then(data => {
            errorDiv.innerHTML = "";  // 清除錯誤訊息 

            // 清空內容並新增列表標題
            content.innerHTML = "<h2>獲取的清單：</h2><ul id='list'></ul>";
            const listContainer = document.getElementById("list");

            // 遍歷清單並新增到前端
            data.list.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item; // 假設清單是單純的文字
                listContainer.appendChild(listItem);
            });
        })
        .catch(error => {
            document.getElementById("result").textContent = "Error: " + error;
        });
    });
}


function cancelled_book(inputContainer,username) {
    inputContainer.innerHTML = `
        <p>您已選擇功能：刪除二手書資訊</p>
        <label for="book_id">要刪除書的ID：</label>
        <input type="text" id="book_id" name="book_id" placeholder="ID" required>
        <button id="submitFeature2">確認刪除</button>
    `;
    // 監聽提交按鈕
    document.getElementById('submitFeature2').addEventListener('click', function() {
        const book_id = document.getElementById('book_id').value;
        if (!book_id) {
            alert('未填入ID');
            return;
        }
        // 用 action 來告知後端使用哪一個功能
        const action = "cancelled_book" ;         
        // 使用 fetch 向後端發送 POST 請
        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                book_id: book_id,
                user_id: username
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析後端回傳的 JSON
        .then(data => {
            const content = document.getElementById('content');  // 假設你要顯示結果的區域是 content
            if (data.success) {  // 根據後端回傳的 success 字段顯示結果
                content.innerHTML = '<p>刪除成功</p>';
            } else {
                alert('刪除失敗，只有自己的書能被刪除');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // 輸出錯誤訊息到控制台
            const content = document.getElementById('content');  // 假設你要顯示錯誤訊息的區域是 content
            content.innerHTML = '<p>錯誤: 失敗</p>';  // 發生錯誤時顯示錯誤訊息
        });
    });
}

function buy_book(inputContainer,username) {
    inputContainer.innerHTML = `
        <p>您已選擇功能：購買二手書</p>
        <label for="book_id">要購買書的ID：</label>
        <input type="text" id="book_id" name="book_id" placeholder="ID" required>
        <label for="transactionType">交易方式(必填)：</label>
        <select id="transactionType" name="transactionType">
            <option value="face">面交</option>
            <option value="delivery">郵寄</option>
        </select>
        <label for="city">縣市(必填)：</label>
        <input type="text" id="city" name="city" placeholder="輸入縣市" required><br>
        <label for="district">鄉鎮區(必填)：</label>
        <input type="text" id="district" name="district" placeholder="輸入鄉鎮區" required><br>
        <label for="street">路(必填)：</label>
        <input type="text" id="street" name="street" placeholder="輸入路" required><br>
        <label for="number">號(必填)：</label>
        <input type="text" id="number" name="number" placeholder="輸入號" required><br>

        <button id="submitFeature4">確認購買</button>
    `;
    // 監聽提交按鈕
    document.getElementById('submitFeature4').addEventListener('click', function() {
        const book_id = document.getElementById('book_id').value;
        const transactionType = document.getElementById('transactionType').value;
        const city = document.getElementById('city').value;
        const district = document.getElementById('district').value;
        const street = document.getElementById('street').value;
        const number = document.getElementById('number').value;
        if (!book_id || !city || !district || !street || !number) {
            alert('有未填入欄位');
            return;
        }
        // 用 action 來告知後端使用哪一個功能
        const action = "buy_book" ;         
        // 使用 fetch 向後端發送 POST 請
        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                book_id: book_id,
                user_id: username,
                transactionType : transactionType,
                city: city,
                district: district,
                road: street,
                doorplate: number
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析後端回傳的 JSON
        .then(data => {
            const content = document.getElementById('content');  // 假設你要顯示結果的區域是 content
            if (data.success) {  // 根據後端回傳的 success 字段顯示結果
                content.innerHTML = '<p>購買成功</p>';
            } else {
                alert('購買失敗，請確認書的ID及狀態');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // 輸出錯誤訊息到控制台
            const content = document.getElementById('content');  // 假設你要顯示錯誤訊息的區域是 content
            content.innerHTML = '<p>錯誤: 失敗</p>';  // 發生錯誤時顯示錯誤訊息
        });
    });
}

function view_order(username){
    // 清空 content 區域
    content.innerHTML = `
        <p>查詢購買紀錄</p>
        <button id="submitBtn">查詢</button>
        <div id="error" class="error"></div>
    `;

    // 綁定提交按鈕事件
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("error");
    submitBtn.addEventListener("click", function() {

        //用action幫後端判斷使用何種功能
        const action = "view_order" ;

        // 使用 fetch 向後端發送 POST 請

        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                user_id: username 
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析 JSON 回應
        .then(data => {
            errorDiv.innerHTML = "";  // 清除錯誤訊息 

            // 清空內容並新增列表標題
            content.innerHTML = "<h2>獲取的清單：</h2><ul id='list'></ul>";
            const listContainer = document.getElementById("list");

            // 遍歷清單並新增到前端
            data.list.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item; // 假設清單是單純的文字
                listContainer.appendChild(listItem);
            });
        })
        .catch(error => {
            document.getElementById("result").textContent = "Error: " + error;
        });
    });
}

function report(inputContainer,username)
{
    inputContainer.innerHTML = `
        <p>您已選擇功能：檢舉</p>
        <label for="book_id">要檢舉書的ID(必填)：</label>
        <input type="text" id="book_id" name="book_id" placeholder="ID" required>
        <label for="reason">檢舉原因(必填)：</label>
        <input type="text" id="reason" name="reason" placeholder="原因" required>
        <button id="submitFeature5">確認檢舉</button>
    `;
    // 監聽提交按鈕
    document.getElementById('submitFeature5').addEventListener('click', function() {
        const book_id = document.getElementById('book_id').value;
        const reason = document.getElementById('reason').value;
        if (!book_id || !reason) {
            alert('有未填入欄位');
            return;
        }
        // 用 action 來告知後端使用哪一個功能
        const action = "report" ;
        // 使用 fetch 向後端發送 POST 請
        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                book_id: book_id,
                user_id: username,
                reason: reason
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析後端回傳的 JSON
        .then(data => {
            const content = document.getElementById('content');  // 假設你要顯示結果的區域是 content
            if (data.success) {  // 根據後端回傳的 success 字段顯示結果
                content.innerHTML = '<p>檢舉成功</p>';
            } else {
                alert('檢舉失敗，ID不存在');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // 輸出錯誤訊息到控制台
            const content = document.getElementById('content');  // 假設你要顯示錯誤訊息的區域是 content
            content.innerHTML = '<p>錯誤: 失敗</p>';  // 發生錯誤時顯示錯誤訊息
        });
    });
}

function own_book(username){
    // 清空 content 區域
    content.innerHTML = `
        <p>查詢購買紀錄</p>
        <button id="submitBtn">查詢</button>
        <div id="error" class="error"></div>
    `;

    // 綁定提交按鈕事件
    const submitBtn = document.getElementById("submitBtn");
    const errorDiv = document.getElementById("error");
    submitBtn.addEventListener("click", function() {

        //用action幫後端判斷使用何種功能
        const action = "own_book" ;

        // 使用 fetch 向後端發送 POST 請

        fetch("http://127.0.0.1:5000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                action: action,
                user_id: username 
            }) // 將密碼作為 JSON 發送
        })
        .then(response => response.json()) // 解析 JSON 回應
        .then(data => {
            errorDiv.innerHTML = "";  // 清除錯誤訊息 

            // 清空內容並新增列表標題
            content.innerHTML = "<h2>獲取的清單：</h2><ul id='list'></ul>";
            const listContainer = document.getElementById("list");

            // 遍歷清單並新增到前端
            data.list.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = item; // 假設清單是單純的文字
                listContainer.appendChild(listItem);
            });
        })
        .catch(error => {
            document.getElementById("result").textContent = "Error: " + error;
        });
    });
}