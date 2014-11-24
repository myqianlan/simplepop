/* *
 * @author myiqnlan
 * @date 2014-11-24 13:19:36
 *
 * */
"use strict";
var SimplePop = {
	alert: function(msg, arg) {
		var alertDefaults = {
			popType: "alert",
			title: "提示",
			content: "<div class='layer_msg'><p>" + (msg === undefined ? "" : msg) + "</p><div class='btn_box'><button id='simplePopBtnSure' type='button'>确定</button></div></div>",
			callback: function() {
				console.log("you click sure")
			}
		};
		var opt = $.extend({}, this._defaults, alertDefaults, arg);
		this._creatLayer(opt)
	},
	confirm: function(msg, arg) {
		var confirmDefaults = {
			popType: "confirm",
			title: "请选择",
			content: "<div class='layer_msg'><p>" + (msg === undefined ? "" : msg) + "</p><div class='btn_box'><button id='simplePopBtnSure' type='button'>确定</button><button id='SimplePopBtncancel' type='button'>取消</button></div></div>",
			cancel: function() {
				console.log("cancel")
			},
			confirm: function() {
				console.log("confirm")
			}
		};
		var opt = $.extend({}, this._defaults, confirmDefaults, arg);
		this._creatLayer(opt)
	},
	prompt: function(msg, arg) {
		var promptDefaults = {
			popType: "prompt",
			title: "请输入",
			content: "<div class='layer_msg'><p>" + (msg === undefined ? "" : msg) + "</p><div><input type='text' /></div><div class='btn_box'><button id='simplePopBtnSure' type='button'>确定</button><button id='SimplePopBtncancel' type='button'>取消</button></div></div>",
			cancel: function() {
				console.log("cancel")
			},
			confirm: function(value) {
				console.log(value)
			}
		};
		var opt = $.extend({}, this._defaults, promptDefaults, arg);
		this._creatLayer(opt)

	},
	_defaults: {
		icon: "",
		title: "",
		content: "",
		width: 0,
		height: 0,
		background: "#000",
		opacity: 0.5,
		duration: "normal",
		showTitle: true,
		escClose: true,
		masksClose: false,
		drag: true,
		dragOpacity: 1,
		popType: "alert",
		type: "info"
	},
	_creatLayer: function(opt) {
		var self = this;
		$(".masks").empty().remove();
		$(".popMain").empty().remove();
		$("body").append("<div class='masks'></div>");
		var $mask = $(".masks");
		$mask.css({
			"background-color": opt.background,
			filter: "alpha(opacity=" + opt.opacity * 100 + ")",
			"-moz-opacity": opt.opacity,
			opacity: opt.opacity
		});
		opt.masksClose &&
			$mask.bind("click", function() {
				self._closeLayer()
			});
		opt.escClose && $(document).bind("keyup", function(e) {
			try {
				e.keyCode == 27 && self._closeLayer()
			} catch (f) {
				self._closeLayer()
			}
		});
		$mask.fadeIn(opt.duration);
		var wrap = "<div class='popMain'>";
		wrap += "<div class='popTitle'>" + (opt.icon !== undefined && opt.icon !== "" ? "<img class='icon' src='" +
			opt.icon + "' />" : "") + "<span class='text'>" + opt.title + "</span><a class='close'>&times;</a></div>";
		wrap += "<div class='popContent'>" + opt.content + "</div>";
		wrap += "</div>";
		$("body").append(wrap);
		var $popMain = $(".popMain");
		$popMain.find('.layer_msg').addClass(opt.type + '_icon')
		var $popTitle = $(".popTitle");
		var $popContent = $(".popContent");
		opt.showTitle ? $popTitle.show() : $popTitle.hide();
		opt.width !== 0 && $popTitle.width(opt.width);
		$(".popTitle .close").bind("click", function() {
			$mask.fadeOut(opt.duration);
			$popMain.fadeOut(opt.duration);
			$popMain.attr("isClose", "1");
			opt.type == "container" && $(opt.targetId).empty().append(opt.content);
		});
		opt.width !== 0 && $popContent.width(opt.width);
		opt.height !== 0 && $popContent.height(opt.height);
		$popMain.css({
			left: $(window).width() / 2 - $popMain.width() / 2 + "px",
			top: $(window).height() / 2 - $popMain.height() / 2 + "px"
		});
		$(window).resize(function() {
			$popMain.css({
				left: $(window).width() / 2 - $popMain.width() / 2 + "px",
				top: $(window).height() / 2 - $popMain.height() / 2 + "px"
			})
		});
		opt.drag && this._drag(opt.dragOpacity)

		switch (opt.popType) {
			case "alert":
				$popMain.fadeIn(opt.duration, function() {
					$popMain.attr("style", $popMain.attr("style").replace("FILTER:", ""))
				});
				$("#simplePopBtnSure").bind("click", function() {
					opt.callback();
					self._closeLayer()
				});
				break;
			case "confirm":
				$popMain.fadeIn(opt.duration, function() {
					$popMain.attr("style", $popMain.attr("style").replace("FILTER:", ""))
				});
				$("#simplePopBtnSure").bind("click",
					function() {
						opt.confirm()
						self._closeLayer()
					});
				$("#SimplePopBtncancel").bind("click", function() {
					opt.cancel()
					self._closeLayer()
				});
				break;
			case "prompt":
				$popMain.fadeIn(opt.duration, function() {
					$popMain.attr("style", $popMain.attr("style").replace("FILTER:", ""))
				});
				$("#simplePopBtnSure").bind("click",
					function() {
						opt.confirm($(".layer_msg input").val())
						self._closeLayer()
					});
				$("#SimplePopBtncancel").bind("click", function() {
					opt.cancel()
					self._closeLayer()
				});
				break;
			default:
				break;
		}
	},
	_closeLayer: function() {
		$(".popTitle .close").triggerHandler("click")
	},
	_drag: function(d) {
		var isDown = false,
			b, g;
		$(".popTitle").bind("mousedown", function(e) {
			if ($(".popMain:visible").length > 0) {
				isDown = true;
				b = e.pageX - parseInt($(".popMain").css("left"), 10);
				g = e.pageY - parseInt($(".popMain").css("top"), 10);
				$(".popTitle").css({
					cursor: "move"
				})
			}
		});
		$(document).bind("mousemove", function(e) {
			if (isDown && $(".popMain:visible").length > 0) {
				d != 1 && $(".popMain").fadeTo(0, d);
				var f = e.pageX - b;
				e = e.pageY - g;
				if (f < 0) f = 0;
				if (f > $(window).width() - $(".popMain").width()) f = $(window).width() - $(".popMain").width() - 2;
				if (e <
					0) e = 0;
				if (e > $(window).height() - $(".popMain").height()) e = $(window).height() - $(".popMain").height() - 2;
				$(".popMain").css({
					top: e,
					left: f
				})
			}
		}).bind("mouseup", function() {
			if ($(".popMain:visible").length > 0) {
				isDown = false;
				d != 1 && $(".popMain").fadeTo(0, 1);
				$(".popTitle").css({
					cursor: "auto"
				})
			}
		})
	}
}