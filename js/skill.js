
class Skill {
	static fire(skillName, player, opponent) {
		if (player.skillCoolDown) return;
		switch (skillName) {
			case 'speed':
				player.speedUp();
				player.startCoolDown();
				break;
			case 'slow':
				opponent.slowDown();
				player.startCoolDown();
				break;
			case 'scramble':
				opponent.scramble();
				player.startCoolDown();
				break;
			default:
				break;
		}
	}
}