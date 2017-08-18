function enemy_bigs_wall_collision() {
	for(var i = 0, len = enemy_big.pool.length; i < len; i++) {
		var enemy = enemy_big.pool[i];
		var ang = enemy.moveDirection;
		if(enemy.po_y < enemy.r || enemy.po_y > canHeight - enemy.r) {
			ang = - ang;
		} else if(enemy.po_x < enemy.r) {
			ang = ang > 0 ? Math.PI - ang : - Math.PI - ang;
		} else if(enemy.po_x > canWidth - enemy.r) {
			ang = ang < 0 ? - Math.PI - ang : Math.PI - ang;
		}
		enemy.moveDirection = ang;
	}
}
function enemy_bigs_growing_check(me, i) {
	var enemy = me.pool[i];
	var rplus = conf.enemy_big.growing_spd * deltaTime;
	if(enemy.po_y < enemy.r) {
		enemy.po_y += rplus;
	} else if(enemy.po_y > canHeight - enemy.r) {
		enemy.po_y -= rplus;
	}
	if(enemy.po_x < enemy.r) {
		enemy.po_x += rplus;
	} else if(enemy.po_x > canWidth - enemy.r) {
		enemy.po_x -= rplus;
	}
}
function enemy_bullet_collision() {
	for(var i = 0, len = bullet.conf.playerPoolX.length; i < len; i ++) {
		var x = bullet.conf.playerPoolX[i];
		var y = bullet.conf.playerPoolY[i];
		for(var obj of enemy_big.pool) {
			if(calLength2(x, y, obj.po_x, obj.po_y) < Math.pow(bullet.conf.r + obj.r, 2)) {
				if(obj.status === "growing") {
					bullet.drop(i);
					attackSound();
					obj.r -= p.conf.bulletEffect;
				} else if(obj.status === "grown") {
					bullet.drop(i);
					attackSound();
					obj.shield += p.conf.bulletToShield;
				}
				break;
			}
		}
	}
}
function player_enemy_collision() {
	for(var obj of enemy_big.pool) {
		var enemyR = obj.r;
		if(obj.status === "grown") {
			enemyR += 12;
		}
		if(obj.status !== "warning") {
			if(calLength2(obj.po_x, obj.po_y, p.conf.po_x, p.conf.po_y) < Math.pow(p.conf.r + enemyR, 2)) {
				return true;
			}
		}
	}
}
function enemy_big_wp_p_collision() {
	for(var obj of enemy_big.pool) {
		for(var i of obj.weapon) {
			if(calLength2(obj.po_x, obj.po_y, p.conf.po_x, p.conf.po_y) < Math.pow(i + p.conf.r, 2)) {
				return true;
			}
		}
	}
}