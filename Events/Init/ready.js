module.exports = {
    name: 'ready',
    execute (client) {
        console.log('I am live!');
        client.user.setActivity('your people.', { type: 'WATCHING' });
    }
}