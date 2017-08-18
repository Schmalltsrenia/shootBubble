window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();

function calLength2(x1, y1, x2, y2) {
	return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}

function onMouseMove(e) {
	if(e.offSetX || e.layerX) {
		mouseX = e.offSetX == undefined ? e.layerX : e.offSetX;
		mouseY = e.offSetY == undefined ? e.layerY : e.offSetY;
	}
}

//重置鼠标样式
function mouseStyle () {
	gb_ctx.save();
	gb_ctx.beginPath();
	gb_ctx.strokeStyle = conf.mouse.color;
	gb_ctx.lineWidth = 1;
	gb_ctx.arc(mouseX, mouseY, conf.mouse.r, 0, Math.PI * 2, false);
	gb_ctx.stroke();
	gb_ctx.restore();
}

//检测射击条件
function isShootReady(player, enemies, angle) {
	for(var i in enemies) {
		var len2 = calLength2(player.conf.po_x, player.conf.po_y, enemies[i].po_x, enemies[i].po_y);
		var len = Math.sqrt(len2);
		if(len - enemies[i].r < conf.bullets.playerBulletsL) {
			if(Math.asin((enemies[i].r + player.conf.r) / len) > deltaAngle(getAngle(enemies[i].po_x - player.conf.po_x, enemies[i].po_y - player.conf.po_y), angle)) {
				return true;
			}
		}
	}
	return false;
}

//一个canvas直角坐标转极坐标的函数
function getAngle(x, y) {
	if(x === 0) {
		if(y === 0) {
			return 0;
		} else if(y < 0) {
			return Math.PI * 1.5;
		} else {
			return Math.PI * 0.5;
		}
	} else if(x > 0) {
		if(y === 0) {
			return 0;
		} else { 
			return Math.atan(y / x);
		}
	} else if(x < 0) {
		if(y === 0) {
			return Math.PI;
		} else if(y < 0) {
			return Math.atan(y / x) - Math.PI;
		} else if(y > 0) {
			return Math.PI + Math.atan(y / x);
		}
	}
}

//计算角度差的函数
function deltaAngle(x, y) {
	var z = Math.abs(x - y);
	return z > Math.PI ? Math.PI * 2 - z : z;
}

//调试用函数，强制返回音频的所有指定属性
function getAuProps(au) {
	var props = ["volume", "audioTracks", "autoplay", "buffered",
		"controller", "controls", "crossOrigin", "currentSrc",
		"currentTime", "defaultMuted", "defaultPlaybackRate",
		"duration", "ended", "error", "loop", "mediaGroup",
		"muted", "networkState", "paused", "playbackRate",
		"played", "preload", "readyState", "seekable", "seeking",
		"src", "startDate", "textTracks", "videoTracks", "type"];
	return getProps(au, props);
}
function getProps(target, props) {
	var obj = {};
	for(var i = 0, len = props.length; i < len; i++) {
		getProp(obj, target, props[i]);
	}
	return obj;
	function getProp(obj, target, prop) {
		try {
			Object.defineProperty(obj, prop, {
				value: target[prop]
			});
		} catch(e) {}
	}
}