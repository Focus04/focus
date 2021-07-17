module.exports = {
  getRoleColor: (guild) => {
    let roleHexColor;
    let highestColoredRole = { position: -1 };
    guild.me.roles.cache.forEach((role) => {
      if (role.position > highestColoredRole.position && role.color != 0) highestColoredRole = role;
    });
    if (highestColoredRole.position === -1) roleHexColor = '#b9bbbe';
    else roleHexColor = '#' + highestColoredRole.color.toString(16);
    return roleHexColor;
  }
}