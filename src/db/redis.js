const { createClient } = require('redis');

const client = createClient();

const connectRedisClient = async () => {
    await client.connect()
}

module.exports = {
    connectRedisClient,
    client,
};