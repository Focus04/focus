module.exports = {
    name: 'ready',
    execute () {
        console.log('I am live!');
        client.user.setActivity('your people.', { type: 'WATCHING' });
    }
}