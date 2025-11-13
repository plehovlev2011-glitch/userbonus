const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { adminId, password } = JSON.parse(event.body);
    
    // Простая "хэш-функция"
    const simpleHash = (str) => Buffer.from(str).toString('base64');
    const hashedPassword = simpleHash(password);
    
    // Читаем базу данных
    const dbResponse = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/data/database.json');
    const dbData = await dbResponse.json();
    const content = Buffer.from(dbData.content, 'base64').toString();
    const database = JSON.parse(content);
    
    // Проверяем администратора
    if (database.admins[adminId] && database.admins[adminId] === hashedPassword) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, error: 'Неверный ID или пароль' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ошибка сервера' })
    };
  }
};
