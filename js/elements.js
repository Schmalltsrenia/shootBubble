var gameBody = document.getElementById("gameBody");
var canWidth = gameBody.width;
var canHeight = gameBody.height;
var gb_ctx = gameBody.getContext("2d");
var mouseX = canWidth * 0.5;
var mouseY = canHeight * 0.5;
var deltaX, deltaY, angle;

//玩家类
function Player() {
	this.conf = conf.player; //初始化参数
	this.lastShootTime = 0;
}
Player.prototype = {
	constructor: Player,

	draw: function() {
		deltaX = mouseX - this.conf.po_x;
		deltaY = mouseY - this.conf.po_y;
		angle = Math.atan2(deltaY, deltaX);

		if(calLength2(this.conf.po_x, this.conf.po_y, mouseX, mouseY) > Math.pow(4 * this.conf.r, 2)) {
			this.conf.po_x += deltaTime * 0.1 * Math.cos(angle);
			this.conf.po_y += deltaTime * 0.1 * Math.sin(angle);
		}

		//画圆
		gb_ctx.save();
		gb_ctx.translate(this.conf.po_x, this.conf.po_y);
		gb_ctx.rotate(angle + Math.PI * 0.5);

		gb_ctx.save();
		gb_ctx.strokeStyle = this.conf.border;
		gb_ctx.fillStyle = this.conf.fill_color;
		gb_ctx.lineWidth = this.conf.borderWidth;
		gb_ctx.beginPath();
		gb_ctx.arc(0, 0, this.conf.r, 0, 2 * Math.PI, false);
		gb_ctx.stroke();
		gb_ctx.fill();
		gb_ctx.restore();

		//画箭头	
		gb_ctx.save();
		gb_ctx.strokeStyle = this.conf.fill_color;
		gb_ctx.lineWidth = this.conf.borderWidth * 0.6;
		gb_ctx.beginPath();
		gb_ctx.moveTo(-this.conf.r * 0.5, -this.conf.r * 1.5);
		gb_ctx.lineTo(0, -2 * this.conf.r);
		gb_ctx.lineTo(this.conf.r * 0.5, -this.conf.r * 1.5);
		gb_ctx.stroke();
		gb_ctx.restore();

		//画鼠标范围
		gb_ctx.save();
		gb_ctx.strokeStyle = this.conf.console;
		gb_ctx.lineWidth = this.conf.borderWidth * 0.4;
		gb_ctx.beginPath();
		gb_ctx.moveTo(-this.conf.r * 0.5, -this.conf.r * 3.5);
		gb_ctx.lineTo(0, -4 * this.conf.r);
		gb_ctx.lineTo(this.conf.r * 0.5, -this.conf.r * 3.5);
		gb_ctx.moveTo(0, -this.conf.r * 4);
		gb_ctx.arc(0, 0, this.conf.r * 4, -Math.PI * 0.5, -Math.PI * 0.5 + 0.5, false);
		gb_ctx.moveTo(0, -this.conf.r * 4);
		gb_ctx.arc(0, 0, this.conf.r * 4, -Math.PI * 0.5, -Math.PI * 0.5 - 0.5, true);
		gb_ctx.stroke();
		gb_ctx.restore();

		//画buff效果
		if(this.conf.buffTime) {
			var startAngle = Math.PI * 1.4 - Math.PI * 1.8 / this.conf.fullBuffTime * this.conf.buffTime;
			gb_ctx.save();
			gb_ctx.strokeStyle = "cyan";
			gb_ctx.lineWidth = 4;
			gb_ctx.beginPath();
			gb_ctx.arc(0, 0, this.conf.r + 10, startAngle, Math.PI * 1.4, false);
			gb_ctx.stroke();
			gb_ctx.restore();

			//buff加成
			this.conf.r = conf.player_buff.after.r;
			this.conf.coolDown = conf.player_buff.after.coolDown;
			conf.bullets.r = conf.player_buff.after.bullets_r;
			this.conf.bulletEffect = conf.player_buff.after.bulletEffect;
			this.conf.bulletToShield = conf.player_buff.after.bulletToShield;

			this.conf.buffTime = this.conf.buffTime - deltaTime;
			if(this.conf.buffTime < 0) {
				this.conf.buffTime = 0;
			}
		} else {
			this.conf.r = conf.player_buff.before.r;
			this.conf.coolDown = conf.player_buff.before.coolDown;
			conf.bullets.r = conf.player_buff.before.bullets_r;
			this.conf.bulletEffect = conf.player_buff.before.bulletEffect;
			this.conf.bulletToShield = conf.player_buff.before.bulletToShield;
		}

		gb_ctx.restore();
	},
	shoot: function() {
		var coolDown = this.conf.coolDown;
		//检测射击条件
		if(currentTime - this.lastShootTime > coolDown) {
			var currentAngle = angle;
			conf.bullets.playerPoolStartX.push(this.conf.po_x);
			conf.bullets.playerPoolStartY.push(this.conf.po_y);
			var bulletX = this.conf.po_x + this.conf.r * 3 * Math.cos(angle);
			var bulletY = this.conf.po_y + this.conf.r * 3 * Math.sin(angle);
			conf.bullets.playerPoolX.push(bulletX);
			conf.bullets.playerPoolY.push(bulletY);
			conf.bullets.playerPoolAngle.push(currentAngle);
			this.lastShootTime = currentTime;
		}
	}
};

//子弹类
function Bullets() {
	this.conf = conf.bullets;
}
Bullets.prototype = {
	constructor: Bullets,

	//子弹消失
	drop: function(i) {
		this.conf.playerPoolX.splice(i, 1);
		this.conf.playerPoolY.splice(i, 1);
		this.conf.playerPoolAngle.splice(i, 1);
		this.conf.playerPoolStartX.splice(i, 1);
		this.conf.playerPoolStartY.splice(i, 1);	
	},
	draw: function() {
		for(var i = 0, len = this.conf.playerPoolX.length; i < len; i ++) {
			gb_ctx.save();
			gb_ctx.fillStyle = this.conf.color;
			gb_ctx.beginPath();
			gb_ctx.arc(this.conf.playerPoolX[i], this.conf.playerPoolY[i], this.conf.r, 0, Math.PI * 2, false);
			gb_ctx.fill();
			gb_ctx.restore;

			this.conf.playerPoolX[i] += this.conf.speed * deltaTime * Math.cos(this.conf.playerPoolAngle[i]);
			this.conf.playerPoolY[i] += this.conf.speed * deltaTime * Math.sin(this.conf.playerPoolAngle[i]);
		}
		for(var i = 0, len = this.conf.playerPoolStartX.length; i < len; i ++) {
			if(calLength2(this.conf.playerPoolStartX[i], this.conf.playerPoolStartY[i], this.conf.playerPoolX[i], this.conf.playerPoolY[i]) > Math.pow(this.conf.playerBulletsL, 2)) {
				this.drop(i);
			}
		}
	}
};

function Enemy_big() {
	this.pool = [];
}
Enemy_big.prototype = {
	constructor: Enemy_big,
	generate: function() {
		var enemyObj = {};
		var me = this;
		enemyObj.status = "warning";
		enemyObj.timeStp = 0;
		enemyObj.fontSize = 14;
		enemyObj.r = conf.enemy_big.r;
		enemyObj.ms = conf.enemy_big.init_ms;
		enemyObj.moveDirection = Math.random() * Math.PI * 2 - Math.PI;
		enemyObj.alpha = 0;
		enemyObj.shield = - Math.PI * 0.5;
		enemyObj.weapon = [];
		enemyObj.cd = 0;
		enemyObj.lastAtkTime = 0;
		do {
			enemyObj.po_x = Math.random() * (canWidth - conf.enemy_big.r * 2) + conf.enemy_big.r;
			enemyObj.po_y = Math.random() * (canHeight - conf.enemy_big.r * 2) + conf.enemy_big.r;
		} while ((function(obj) {
			if(me.pool.length === 0) {
				return false;
			}
			for(var i in me.pool) {
				if(calLength2(me.pool[i].po_x, me.pool[i].po_y, enemyObj.po_x, enemyObj.po_y) < Math.pow(conf.enemy_big.minBornDistance, 2)) {
					return true;
				}
			}
			return false;
		}) (enemyObj));
		this.pool.push(enemyObj);
	},
	draw: function() {
		for(var i = 0, len = this.pool.length; i < len; i ++) {
			if(this.pool[i].status === "warning") {
				if(this.pool[i].timeStp === 0) {
					this.pool[i].timeStp = currentTime;
				}
				this.pool[i].fontSize = 14 + (currentTime - this.pool[i].timeStp) % conf.enemy_big.warningTime / 62.5 | 0;
				if(currentTime - this.pool[i].timeStp > conf.enemy_big.warningTime * conf.enemy_big.warningN) {
					this.pool[i].status = "sliding";
				}
				gb_ctx.save();
				gb_ctx.strokeStyle = "white";
				gb_ctx.lineWidth = 2;
				gb_ctx.font = "bold "+ this.pool[i].fontSize + "px Arial";
				gb_ctx.textAlign = "center";
				gb_ctx.textBaseline = "middle";
				gb_ctx.shadowColor = "white";
				gb_ctx.shadowBlur = "5";
				gb_ctx.beginPath();
				gb_ctx.fillText("!", this.pool[i].po_x, this.pool[i].po_y);
				gb_ctx.arc(this.pool[i].po_x, this.pool[i].po_y, this.pool[i].r * 0.85, 0, Math.PI * 2, false);
				gb_ctx.stroke();
				gb_ctx.restore();
			} else if(this.pool[i].status === "sliding") {
				gb_ctx.save();
				gb_ctx.fillStyle = "rgba(255, 255, 255, " + this.pool[i].alpha + ")";
				gb_ctx.beginPath();
				gb_ctx.arc(this.pool[i].po_x, this.pool[i].po_y, this.pool[i].r, 0, Math.PI * 2);
				gb_ctx.fill();
				gb_ctx.restore();
				this.pool[i].alpha += 0.001 * deltaTime;
				if(this.pool[i].alpha > 1) this.pool[i].status = "growing";
			} else if(this.pool[i].status === "growing") {
				var me = this;
				this.pool[i].po_x += this.pool[i].ms * deltaTime * Math.cos(this.pool[i].moveDirection); 
				this.pool[i].po_y += this.pool[i].ms * deltaTime * Math.sin(this.pool[i].moveDirection);
				if(this.pool[i].r < conf.enemy_big.minSize) {
					this.pool[i].status = "dead";
					sound.play(4);
					conf.score += 1;
				}
				gb_ctx.save();
				gb_ctx.fillStyle = conf.enemy_big.fillStyle;
				gb_ctx.beginPath();
				gb_ctx.arc(this.pool[i].po_x, this.pool[i].po_y, this.pool[i].r, 0, Math.PI * 2);
				gb_ctx.fill();
				gb_ctx.restore();
				enemy_bigs_growing_check(me, i);
				if(this.pool[i].r < conf.enemy_big.maxSize) {
					this.pool[i].r += conf.enemy_big.growing_spd * deltaTime;
				} else {
					this.pool[i].r = conf.enemy_big.maxSize;
					this.pool[i].status = "grown";
				}
			} else if(this.pool[i].status === "grown") {
				this.pool[i].po_x += this.pool[i].ms * deltaTime * Math.cos(this.pool[i].moveDirection); 
				this.pool[i].po_y += this.pool[i].ms * deltaTime * Math.sin(this.pool[i].moveDirection);
				this.pool[i].shield -= conf.enemy_big.shield_recover * deltaTime;
				if(this.pool[i].shield < - Math.PI * 0.5) this.pool[i].shield = - Math.PI * 0.5;
				if(this.pool[i].shield > Math.PI * 1.5) {
					this.pool[i].status = "growing";
					this.pool[i].shield = -Math.PI * 0.5;
					this.pool[i].r = 0.6 * conf.enemy_big.maxSize;
					p.conf.buffTime = p.conf.fullBuffTime;
					getBuff = true;
					sound.play(2);
				}
				gb_ctx.save();
				gb_ctx.fillStyle = conf.enemy_big.fillStyle;
				gb_ctx.strokeStyle = conf.enemy_big.fillStyle;
				gb_ctx.beginPath();
				gb_ctx.arc(this.pool[i].po_x, this.pool[i].po_y, this.pool[i].r, 0, Math.PI * 2);
				gb_ctx.fill();
				gb_ctx.beginPath();
				gb_ctx.arc(this.pool[i].po_x, this.pool[i].po_y, this.pool[i].r + 5, -Math.PI * 0.5, Math.PI * 1.5);
				gb_ctx.arc(this.pool[i].po_x, this.pool[i].po_y, this.pool[i].r + 12, -Math.PI * 0.5, Math.PI * 1.5);
				gb_ctx.stroke();
				gb_ctx.save();
				gb_ctx.lineWidth = 5;
				gb_ctx.strokeStyle = "cyan";
				gb_ctx.beginPath();
				gb_ctx.arc(this.pool[i].po_x, this.pool[i].po_y, this.pool[i].r + 8.5, this.pool[i].shield, Math.PI * 1.5);
				gb_ctx.stroke();
				gb_ctx.restore();
				gb_ctx.restore();

				this.attack(i);
			}
		}
	},
	attack: function(i) {
		var len = this.pool[i].weapon.length;
		if(len) {
			for(var j = 0; j < len; j ++) {
				this.pool[i].weapon[j] += conf.enemy_big.weaponSpd * deltaTime;
			}
			if(this.pool[i].weapon[0] > this.pool[i].r + 12 + conf.enemy_big.weaponRange) { //412
				this.pool[i].weapon.shift();
			}
		}
		len = this.pool[i].weapon.length;
		if(len) {
			gb_ctx.save();
			gb_ctx.strokeStyle = conf.enemy_big.weaponColor;
			gb_ctx.lineWidth = 3;
			gb_ctx.beginPath();
			for(var k = 0; k < len; k ++) {
				gb_ctx.arc(this.pool[i].po_x, this.pool[i].po_y, this.pool[i].weapon[k], 0, Math.PI * 2, false);
			}
			sound.play(3);
			gb_ctx.stroke();
			gb_ctx.restore();
		}
		if(currentTime - this.pool[i].lastAtkTime > this.pool[i].cd) {
			this.pool[i].weapon.push(this.pool[i].r + 12); //112
			this.pool[i].lastAtkTime = currentTime;
			this.pool[i].cd = Math.random() * (conf.enemy_big.maxAtkInterval - conf.enemy_big.minAtkInterval) + conf.enemy_big.minAtkInterval;
		}
	},
	clear: function() {
		var delArr = [];
		for(var i = 0, len = this.pool.length; i < len; i ++) {
			if(this.pool[i].status === "dead") {
				delArr.push(i);
			}
		}
		for(var j = 0, l = delArr.length; j < l; j ++) {
			this.pool.splice(delArr[j], 1);
		}
	}
};

//包装Audio类
function Sound() {
	this.sounds = [];
	this.soundReady = 0;
	var me = this;
	this.onCanplaythrough = function() {
		me.soundReady += 1;
		if(me.soundReady === me.sounds.length) {
			me.onAllLoaded();
		}
	};
	this.onAllLoaded = function() {
		for(var i = 0, len = sound.sounds.length; i < len; i ++) {
			this.sounds[i].removeEventListener("canplaythrough", me.onCanplaythrough);
		}
	};
}
Sound.prototype = {
	constructor: Sound,
	loadSounds: function(arr) {
		var me = this;
		var len = arr.length;
		for(var i = 0; i < len; i ++) {
			var au = new Audio;
			if(typeof arr[i] === "string") {
				au.src = "./sounds/" + arr[i];
				au.volume = conf.sound.volume;
			} else {
				au.src = "./sounds/" + arr[i][0];
				au.volume = arr[i][1];			
			}
			au.type = "audio/" + au.src.slice(au.src.lastIndexOf(".") + 1);
			au.addEventListener("canplaythrough", me.onCanplaythrough);
			this.sounds.push(au);
		}
	},
	play: function(i) {
		if(this.sounds.length) {
			this.sounds[i].play();
		}
	}
}

var panel = {
	lastShowfps: 0,
	fps: 0,
	time: 0,
	showData: function() {
		gb_ctx.save();
		gb_ctx.font = "bold 20px Arial";
		gb_ctx.textAlign = "center";
		gb_ctx.textBaseline = "middle";
		gb_ctx.fillText("Score: " + conf.score, 400, 30);
		gb_ctx.save();
		gb_ctx.font = "bold 12px Arial";
		gb_ctx.fillStyle = "yellow";
		if(conf.showfps && currentTime - this.lastShowfps > 800) {
			this.fps = 1000 / deltaTime | 0;
			this.lastShowfps = currentTime;
		}
		gb_ctx.fillText("fps: " + this.fps, 750, 20);
		gb_ctx.restore();

		gb_ctx.save();
		gb_ctx.font = "bold 16px Arial";
		this.time += deltaTime;
		var seconds = this.time / 1000 | 0;
		gb_ctx.fillText((seconds / 3600 | 0) + ":" + (seconds % 3600 / 60 | 0) + ":" + (seconds % 60), 750, 40);
		gb_ctx.restore();

		gb_ctx.restore();
	}
};

var p = new Player;
var enemy_big = new Enemy_big;
var bullet = new Bullets;

var soundsArr = ["bubble.ogg", "bubble1.ogg", ["bling.ogg", 1], "water_spread.ogg", "kill.ogg"];
var sound = new Sound;
//只有开启声音时才创建audio并发起请求，以免浪费资源
if(conf.sound.on) {
	sound.loadSounds(soundsArr);
}
var attackSound = function() {
	var i = Math.random() * 2 | 0;
	if(i) {
		sound.play(0);
	} else {
		sound.play(1);
	}
};