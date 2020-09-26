module.exports = (client) => {
  console.log('I am live!');
  client.user.setActivity('your people.', { type: 'WATCHING' });
}