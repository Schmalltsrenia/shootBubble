var lastTime = +new Date();
var currentTime;
var deltaTime;
var lifeCheck = 0;
var lastCheck = 0;
var lastGenerate = 0;
var generateFreq = conf.generateEnemies.frequency;

gameBody.addEventListener('mousemove', onMouseMove, false);

var gameLoop = function() {

	currentTime = +new Date();
	deltaTime = Math.min(currentTime - lastTime, 25);
	lastTime = currentTime;
	
	gb_ctx.clearRect(0, 0, canWidth, canHeight);

	//生成泡泡
	if(currentTime - lastGenerate > generateFreq && enemy_big.pool.length < conf.generateEnemies.total) {
		var num = Math.random() * conf.generateEnemies.num + 1 | 0;
		for(var i = 0; i < num; i++) {
			enemy_big.generate();
		}
		lastGenerate = currentTime;
		generateFreq = Math.random() * conf.generateEnemies.frequency;
	}

	mouseStyle();
	if(p.conf.life) {
		p.draw();
		p.shoot();
		bullet.draw();
	}
	
	enemy_big.clear();
	enemy_big.draw();
	enemy_bigs_wall_collision();
	enemy_bullet_collision();

	//判定生命值
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
	panel.showData();
	window.requestAnimFrame(gameLoop);
};

//页面加载完成之后看声音加载完没，如果加载完，就开始动画，
//如果没有，就把循环动画拿给声音的监听事件，让声音加载完后运行循环动画，
//这样就可以在声音监听器执行空函数之前给它一个函数，保证游戏运行前所有资源都是准备好的；
//移除监听，因为后面每次触发声音时都会调用它；
window.onload = function() {
	// if(sound.soundReady === sound.sounds.length) {
		window.requestAnimFrame(gameLoop);
	// } else {
	// 	sound.onAllLoaded = function() {
	// 		window.requestAnimFrame(gameLoop);
	// 		for(var i = 0, len = sound.sounds.length; i < len; i ++) {
	// 			sound.sounds[i].removeEventListener("canplaythrough", sound.onCanplaythrough);
	// 		}
	// 	}
	// }
};