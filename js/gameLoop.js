var lastTime = +new Date();
var currentTime;
var deltaTime;
var lifeCheck = 0;
var lastCheck = 0;
var lastGenerate = 0;
var generateFreq = conf.generateEnemies.frequency;

gameBody.addEventListener('mousemove', onMouseMove, false);

var gameLoop = function() {
	if(currentTime - lastGenerate > generateFreq && enemy_big.pool.length < conf.generateEnemies.total) {
		var num = Math.random() * conf.generateEnemies.num + 1 | 0;
		for(var i = 0; i < num; i++) {
			enemy_big.generate();
		}
		lastGenerate = currentTime;
		generateFreq = Math.random() * conf.generateEnemies.frequency;
	}
	currentTime = +new Date();
	deltaTime = currentTime - lastTime;
	lastTime = currentTime;
	gb_ctx.clearRect(0, 0, canWidth, canHeight);
	if(p.conf.life) {
		mouseStyle();
		p.draw();
		p.shoot();
		bullet.draw();
	}
	enemy_big.clear();
	enemy_big.draw();
	enemy_bigs_wall_collision();
	enemy_bullet_collision();
	if(currentTime - lastCheck > lifeCheck) {
		if(player_enemy_collision() || enemy_big_wp_p_collision()) {
			if(p.conf.buffTime) {
				p.conf.buffTime = 0;
			} else {
				p.conf.life -= 1;
				if(p.conf.life < 0) {
					p.conf.life = 0;
				}
			}
			lifeCheck = 1000;
		} else {
			lifeCheck = 0;
		}
		lastCheck = currentTime;
	}
	window.requestAnimFrame(gameLoop);
};
window.requestAnimFrame(gameLoop);