const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { barcode, amount } = JSON.parse(event.body);
    
    // Читаем базу данных
    const dbResponse = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/data/database.json');
    const dbData = await dbResponse.json();
    const content = Buffer.from(dbData.content, 'base64').toString();
    const database = JSON.parse(content);
    
    // Ищем пользователя по штрихкоду
    let userFound = null;
    let username = null;
    
    for (const [user, userData] of Object.entries(database.users)) {
      if (userData.barcode === barcode) {
        userFound = userData;
        username = user;
        break;
      }
    }
    
    if (!userFound) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: 'Пользователь не найден' })
      };
    }
    
    // Начисляем бонусы
    database.users[username].balance += parseInt(amount);
    
    // Сохраняем в базу (в демо-режиме просто возвращаем успех)
    // В реальной системе здесь будет запись в GitHub
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        newBalance: database.users[username].balance,
        username: username
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ошибка сервера' })
    };
  }
};
