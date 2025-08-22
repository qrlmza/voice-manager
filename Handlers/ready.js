require('dotenv').config({ debug: false });
var colors = require('colors/safe');

const readyHandler = (client) => {
    client.once('ready', async () => {
        const username = client.user?.username;
        console.log(colors.green(`⟭ The application started successfully with the username ${username}.`));
    });
};

module.exports = readyHandler;