const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { username, password } = JSON.parse(event.body);
  
  // Простая "хэш-функция" для демонстрации
  const simpleHash = (str) => Buffer.from(str).toString('base64');
  
  // Генерация случайного штрихкода
  const generateBarcode = () => Math.random().toString().slice(2, 14);
  
  const newUser = {
    password: simpleHash(password),
    balance: 0,
    barcode: generateBarcode()
  };

  // Здесь будет код для сохранения в database.json
  // (см. следующий пример с полной реализацией)
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true, 
      barcode: newUser.barcode 
    })
  };
};
