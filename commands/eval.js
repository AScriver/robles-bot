const { spawn } = require('child_process');
const servers = {};

module.exports = {
    name: 'eval',
    description: 'Evaluate a code snippet',
    args: true,
    cooldown: 5,
    usage: '!gnome',
    servers: servers,
    execute(message, args) {
        if (message.author.id !== process.env.OWNER_ID) return;
        const command = args.shift();

        const shell = spawn(clean(command), args);
        shell.stdout.on('data', (data) => {
            message.channel.send(`${data}`)
        });

        shell.stderr.on('data', (data) => {
            message.channel.send(`stderr: ${data}`);
        });

        shell.on('close', (code) => {
            message.channel.send(`child process exited with code ${code}`);
        });
    }
};

const clean = text => {
    if (typeof text === "string")
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
};