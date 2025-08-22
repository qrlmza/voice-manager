require('dotenv').config({ debug: false });

const readyHandler = (client) => {
    client.once('ready', async () => {
        const username = client.user?.username;
        console.log(`\x1b[32m ⟭ The application started successfully with the username ${username}.`);
    });
};

module.exports = readyHandler;