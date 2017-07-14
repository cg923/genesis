
class Skill {
	static fire(name, player, opponent) {
		if (player.skillCoolDown) return;
		switch (name) {
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