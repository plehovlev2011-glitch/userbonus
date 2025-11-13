exports.handler = async function(event) {
  const { username } = event.queryStringParameters;
  
  // Чтение из database.json
  const users = await readDatabase();
  
  if (users[username]) {
    return {
      statusCode: 200,
      body: JSON.stringify(users[username])
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'User not found' })
  };
};
