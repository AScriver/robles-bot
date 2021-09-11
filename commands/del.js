module.exports = {
    name: 'del',
    description: '',
    args: false,
    cooldown: 0,
    usage: 'dont',
    execute(message, args) {
        message.delete()
    },
};