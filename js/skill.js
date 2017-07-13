
class Skill {
	static fire(name, player, opponent) {
		if (player.skillCoolDown) return;
		switch (name) {
			case 'speed':
				player.speed = 8;
				player.startCoolDown();
				setTimeout(function () {
					player.speed = 5;
					setTimeout(function() {
						player.endCoolDown();
					}, 5000);
				}, 5000);
				break;
			case 'slow':
				opponent.speed = 2;
				player.startCoolDown();
				setTimeout(function () {
					opponent.speed = 5;
					setTimeout(function() {
						player.endCoolDown();
					}, 5000);
				}, 5000);
				break;
			case 'scramble':
				opponent.scrambled = true;
				player.startCoolDown();
				setTimeout(function () {
					opponent.scrambled = false;
					setTimeout(function() {
						player.endCoolDown();
					}, 5000);
				}, 5000);
				break;
			default:
				break;
		}
	}
}