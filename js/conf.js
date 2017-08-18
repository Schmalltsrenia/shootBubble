var conf = {

	//初始化值
	player: {
		r: 10,
		po_x: 100,
		po_y: 300,
		fill_color: "white",
		border: "yellow",
		borderWidth: 4,
		console: "rgba(255, 255, 255, 0.4)",
		movespeed: 0.1,
		coolDown: 250,
		bulletEffect: 5,
		bulletToShield: 0.3,
		buffTime: 0, //不可改
		fullBuffTime: 4000,
		buffColor: "cyan",
		life: 1
	},
	player_buff: {
		before: {
			r: 10,
			coolDown: 250,
			bullets_r: 3,
			bulletEffect: 5,
			bulletToShield: 0.3
		},
		after: {
			r: 15,
			coolDown: 100,
			bullets_r: 5,
			bulletEffect: 3,
			bulletToShield: 0.2
		}
	},
	bullets: {

		playerPoolX: [],
		playerPoolY: [],
		playerPoolAngle: [],
		playerPoolStartX: [],
		playerPoolStartY: [],
		playerBulletsL: 250,

		enemyPoolX: [],
		enemyPoolY: [],
		enemyPoolAngle: [],
		enemyPoolStartX: [],
		enemyPoolStartY: [],

		speed: 0.4,
		r: 3,
		color: "white"
	},
	mouse: {
		color: "orange",
		r: 3
	},
	enemy_big: {
		minBornDistance: 100,
		fillStyle: "white",
		r: 40,
		warningTime: 1000,
		warningN: 3,
		init_ms: 0.02,
		growing_spd: 0.01,
		shield_recover: 0.0005,
		maxSize: 70,
		minSize: 10,
		maxAtkInterval: 5000,
		minAtkInterval: 80,
		weaponSpd: 0.1,
		weaponRange: 50,
		weaponColor: "cyan"
	},
	generateEnemies: {
		frequency: 12000, //最多多少秒判定一次
		num: 3, //一次最多生成多少个
		total: 4 //页面上最多有多少个就不继续生成了
	},
	sound: {
		on: true,
		volume: 0.1
	},
	score: 0,
	showfps: true
};