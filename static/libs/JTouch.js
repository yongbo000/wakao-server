﻿/*
JTouch v1.1  2013-06-04
https://github.com/liutian1937/JTouch
ok8008@yeah.net
 */
(function () {
	var TapTimes = 0,
	TapTimeout,
	LongTimeout,
	LastDirect = '';
	var TouchCommon = {
		isTouch : function () {
			return document.hasOwnProperty && document.hasOwnProperty('ontouchstart');
		},
		isMSPointer : function () {
			return window.navigator.msPointerEnabled;
		},
		isPointer : function () {
			return window.navigator.pointerEnabled;
		},
		isIE : function () {
			return (document.all) ? true : false;
		},
		isLeft : function (e){
			if (document.all && e.button === 1 || e.button === 0){
				return true;
			};
		},
		getTime : function () {
			return Date.now() || new Date().getTime() ;
		},
		stopDefault : function (e) {
			e = e || window.event;
			if(e && e.preventDefault){
			　　e.preventDe
              
              fault();
			}else{
			　　e.returnValue=false;
			}
		}
	};
 	var TouchAction = function (element,event,touch) {
		/*
		函数TouchAction主要针对点击，滑动的处理，手势变换用下面Gesture
		点击事件：Tap,DoubleTap,LongTap,Swipe(滑动),Flick(轻拂)
		 */
		this.evt = event;
		this.touch = touch || undefined;
		this.startX = this.currentX = touch?touch.screenX:event.pageX; //初始化点击开始的位置，X
		this.startY = this.currentY = touch?touch.screenY:event.pageY; //初始化点击开始的位置，Y
		this.eventType = null; //初始化事件类型
		this.startTime = TouchCommon.getTime(); //点击开始计时，初始点击时间
		this.checkLongTap(element); //检查是否是长按
		this.data = {};
		this.swipeData = {
			x : this.currentX,
			y : this.currentY
		};
		LastDirect = '';
	};
	TouchAction.prototype = {
		getTapType : function () {
			//判断点击类型，tap与doubletap
			var _this = this;
			TapTimes = (TapTimes == 0) ? 1 : TapTimes + 1;
			if (TapTimes == 1) {
				_this.eventType = 'tap';
			} else if (TapTimes == 2) {
				_this.eventType = 'doubletap';
				clearTimeout(TapTimeout);
			} else {
				TapTimes = 0;
			};
		},
		checkLongTap : function (element) {
			//长按检测，longtap
			var _this = this;
			clearTimeout(LongTimeout);
			LongTimeout = setTimeout(function () {
					_this.eventType = 'longtap';
					_this.touchCallback(element);
				}, 500);
		},
		move : function (element,touch) {
			//手指在对象上滑动
			var _this = this, offsetX, offsetY, timeStamp;
			clearTimeout(LongTimeout); //取消长按检测
			_this.currentX = _this.touch?touch.screenX:touch.pageX; //获取当前坐标值，pageX为到窗口的距离
			_this.currentY = _this.touch?touch.screenY:touch.pageY;

			offsetX = _this.currentX - _this.startX; //计算手指滑动的横向长度
			offsetY = _this.currentY - _this.startY; //计算手指滑动的纵向长度

			/*
			move的时候定义事件类型eventType:swipe 或者 hold
			 */
			if (_this.eventType == 'longtap' || _this.eventType == 'hold') {
				_this.eventType = 'hold';
			} else {
				_this.eventType = 'swipe';
			};
			if(LastDirect != ''){
				if(LastDirect == 'Horizontal'){
					_this.data['direction'] = offsetX > 0 ? 'right' : 'left';
				}else{
					_this.data['direction'] = offsetY > 0 ? 'down' : 'up';
				}
			}else{
				if (Math.abs(offsetX) > Math.abs(offsetY)) {
					/*
					如果上次的移动方向是左右
					或者横向滑动大于纵向，是左右滑动
					 */
					_this.data['direction'] = offsetX > 0 ? 'right' : 'left';
					LastDirect = 'Horizontal';
				}else {
					/*
					纵向滑动大于横向，是上下滑动
					 */
					_this.data['direction'] = offsetY > 0 ? 'down' : 'up';
					LastDirect = 'Vertical';
				};
			};
			
			_this.data['x'] = offsetX;
			_this.data['y'] = offsetY;
			
			timeStamp = TouchCommon.getTime();
			if(timeStamp - _this.startTime > 300){
				_this.startTime = timeStamp;
				_this.swipeData = {
					x : _this.currentX,
					y : _this.currentY
				}
			}
			
			_this.touchCallback(element); //执行回调函数
		},
		process : function (element) {
			//touch结束后执行
			var _this = this, offsetX, offsetY;
			offsetX = _this.currentX - _this.startX; //移动横向距离
			offsetY = _this.currentY - _this.startY; //移动纵向距离

			if (_this.eventType && _this.eventType !== 'swipe' && _this.eventType !== 'hold') {
				return false;
			};
			clearTimeout(LongTimeout); //清除长按检测

			if (offsetX == 0 && offsetY == 0) {
				//两次触摸没有距离移动
				_this.getTapType();
				if (TapTimes == 1) {
					TapTimeout = setTimeout(function () {
							_this.touchCallback(element);
						}, 250);
				} else if (TapTimes == 2) {
					_this.touchCallback(element);
				}
			} else if (Math.abs(offsetY) > 0 || Math.abs(offsetX) > 0) {

				_this.data['x'] = offsetX;
				_this.data['y'] = offsetY;
				
				_this.data['time'] = TouchCommon.getTime() - _this.startTime;

				if (_this.data['time'] < 200) {
					_this.data['speed'] = Math.max(Math.abs(_this.currentX - _this.swipeData['x'])/_this.data['time'],Math.abs(_this.currentY - _this.swipeData['y'])/_this.data['time']);
					if(_this.data['speed'] > 0.5){
						//时间小于300，动作为轻拂：flick
						if (Math.abs(offsetY) > Math.abs(offsetX)) {
							_this.data['direction'] = offsetY > 0 ? 'down' : 'up';
						} else {
							_this.data['direction'] = offsetX > 0 ? 'right' : 'left';
						}
						_this.eventType = 'flick';
					}else{
						_this.data['status'] = 'end';
					}
				}else {
					//滑动结束，swipe end
					_this.data['status'] = 'end';
				};
				_this.touchCallback(element);
			};
		},
		touchCallback : function (element) {
			//回调函数
			var _this = this, len = (this.touch) ? this.evt.changedTouches.length : 1;
			_this.data['fingerNum'] = len;
			if (!_this.touch || _this.touch.identifier == _this.evt.changedTouches[len - 1].identifier) {
				if (element.typeFn[_this.eventType])
					element.typeFn[_this.eventType](_this.evt, _this.data); //执行函数
				TapTimes = 0;
			}
		}
	};

	var Gesture = function (event, element) {
		this.data = {};
		this.eventType = null;
		this.rotateActive = this.pinchActive = false;
	};
	Gesture.prototype = {
		change : function (event, element) {
			var _this = this, diffAngle, diffDistance;
			if (element.objEvent.touches.length == 2) {
				if (!_this.startData) {
					_this.startData = _this.getData(element);
				};
				_this.currentData = _this.getData(element); //获取两根手指的坐标
				diffAngle = _this.getAngle(_this.startData) - _this.getAngle(_this.currentData);
				diffDistance = _this.getDistance(_this.startData) - _this.getDistance(_this.currentData);

				if (Math.abs(diffAngle) > 10 || _this.rotateActive) {
					_this.eventType = 'rotate';
					_this.data['direction'] = (event.rotation < 0) ? 'left' : 'right';
					_this.data['rotation'] = event.rotation;
					_this.gestureCallback(event, element, _this.data);
					_this.rotateActive = true;
				};
				if (Math.abs(diffDistance) > 10 || _this.pinchActive) {
					_this.eventType = 'pinch';
					_this.data['type'] = (event.scale < 1) ? 'in' : 'out';
					_this.data['scale'] = event.scale;
					_this.gestureCallback(event, element, _this.data);
					_this.pinchActive = true;
				};
			};
		},
		end : function (event, element) {
			var _this = this;
			_this.data['rotation'] = event.rotation;
			_this.data['scale'] = event.scale;
			_this.data['status'] = 'end';
			_this.gestureCallback(event, element, _this.data);
		},
		gestureCallback : function (event, element, data) {
			var _this = this;
			if (element.typeFn[_this.eventType])
				element.typeFn[_this.eventType](event, data);
		},
		getData : function (element) {
			var _this = this, touchList = element.objEvent.touches, ret = [];
			for (var i = 0; i < touchList.length; i++) {
				ret.push({
					x : touchList[i].screenX ,
					y : touchList[i].screenY 
				});
			};
			return ret;
		},
		getAngle : function (data) {
			var A = data[0], B = data[1], angle = Math.atan((B.y - A.y) * -1 / (B.x - A.x)) * (180 / Math.PI);
			if (angle < 0) {
				return angle + 180;
			} else {
				return angle;
			}
		},
		getDistance : function (data) {
			var A = data[0], B = data[1];
			return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)) * -1;
		}
	};
	
	var Touch = function (obj) {
		var _this = this;
		if(!(this instanceof Touch)){
			return new Touch(obj);
		};
		_this.obj = obj || window;
		_this.init();
	};
	Touch.prototype = {
		on : function (type, callback) {
			this.typeFn[type] = callback; //给typeFn添加对应的事件
			return this;
		},
		stopEvent : function (){
			//是否阻止默认事件
			this.stopDefault = true;
			return this;
		},
		init : function () {
			var _this = this, mousewheel;
			_this.touches = {}; //touch对象哈希表
			_this.typeFn = {}; //点击类型哈希表
			_this.gesture = null;
			_this.handleHash = {};
			if(TouchCommon.isTouch()){
				//是否支持touch事件
				_this.bind(_this.obj,'touchstart',_this.touchStart);
				_this.bind(_this.obj,'touchmove',_this.touchMove);
				_this.bind(_this.obj,'touchend',_this.touchEnd);
				_this.bind(_this.obj,'touchcancel',_this.touchCancel);
				_this.bind(_this.obj,'gesturestart',_this.gestureStart);
				_this.bind(_this.obj,'gesturechange',_this.gestureChange);
				_this.bind(_this.obj,'gestureend',_this.gestureEnd);
			} else if(TouchCommon.isPointer() || TouchCommon.isMSPointer()) {
				_this.bind(_this.obj,'MSPointerDown',_this.mouseStart);
				_this.bind(_this.obj,'MSPointerUp',_this.mouseEnd);
				_this.bind(_this.obj,'MSPointerMove',_this.mouseMove);
				_this.bind(_this.obj,'mousewheel',_this.mouseWheel);
			} else {
				mousewheel = (document.hasOwnProperty('onmousewheel')) ? "mousewheel" : "DOMMouseScroll" ;
				_this.bind(_this.obj,'mousedown',_this.mouseStart);
				_this.bind(_this.obj,'click',_this.clickFn);
				_this.bind(window,'mouseup',_this.mouseEnd);
				_this.bind(_this.obj,mousewheel,_this.mouseWheel);
			};
		},
		touchStart : function (event) {
			var _this = this;
			if(_this.stopDefault){
				TouchCommon.stopDefault(event);
			};
			_this.touches = {};
			_this.objEvent = event;
			_this.touchLoop(event, function (touch) {
				_this.touches[touch.identifier] = new TouchAction(_this,event,touch);
			});
			if (_this.typeFn['start']) {
				_this.typeFn['start'](event);
			};
		},
		touchMove : function (event) {
			var _this = this;
			//event.preventDefault(); //阻止浏览器默认动作
			_this.objEvent = event;
			_this.touchLoop(event, function (touch) {
				var touchTarget = _this.touches[touch.identifier];
				if (touchTarget) {
					touchTarget.move(_this,touch); //touchMove时执行函数
				};
			});
		},
		touchEnd : function (event) {
			var _this = this;
			if(_this.stopDefault){
				TouchCommon.stopDefault(event);
			};
			_this.touchLoop(event, function (touch) {
				_this.touchClear(touch, false);
			});
			if (_this.typeFn['end']) {
				_this.typeFn['end'](event);
			};
		},
		touchCancel : function (event) {
			var _this = this;
			//event.preventDefault(); //阻止浏览器默认动作
			_this.touchLoop(event, function (touch) {
				_this.touchClear(touch, true);
			});
		},
		touchLoop : function (event, callback) {
			var len = event.changedTouches.length;
			callback(event.changedTouches[len - 1]);
		},
		touchClear : function (touch, cancelled) {
			var _this = this, touchTarget;
			if (!cancelled) {
				touchTarget = _this.touches[touch.identifier];
				if (touchTarget) {
					touchTarget.process(_this); //touchEnd时执行函数
				};
			};
			delete _this.touches[touch.identifier];
		},
		mouseStart : function (event) {
			var _this = this;
			if(!TouchCommon.isLeft(event)){
				//如果不是左键，阻止进程
				return false;
			};
			event.preventDefault(); //阻止浏览器默认动作
			
			_this.touches = {};
			_this.objEvent = event;

			_this.touches = new TouchAction(_this,event); //实例化TouchAction
			_this.bind(window,'mousemove',_this.mouseMove);//给window绑定mousemove事件
			if (_this.typeFn['start']) {
				_this.typeFn['start'](event);
			};
		},
		mouseMove : function (event) {
			var _this = this;
			event.preventDefault(); //阻止浏览器默认动作
			_this.objEvent = event;
			if (_this.touches instanceof TouchAction){
				_this.touches.move(_this,event);
			};
		},
		mouseEnd : function (event) {
			var _this = this;
			event.preventDefault(); //阻止浏览器默认动作
			(TouchCommon.isIE())? event.cancelBubble = true : event.stopPropagation();//阻止冒泡

			if(!(_this.touches instanceof TouchAction)){
				return false;
			};
			_this.touches.process(_this);
			_this.touches = {};
			
			_this.unbind(window,'mousemove');//取消window的事件绑定
			if (_this.typeFn['end']) {
				_this.typeFn['end'](event);
			};
		},
		mouseWheel : function (event) {
			var _this = this, data = {}, delta = event.wheelDelta ? (event.wheelDelta / 120) : (- event.detail / 3);
			data['direction'] = (delta > 0)?'up':'down';
			if (_this.typeFn['mousewheel']) {
				_this.typeFn['mousewheel'](event,data);
			};
		},
		clickFn : function (event) {
			var _this = this, target = event.target || event.srcElement;
			if(_this.stopDefault){
				TouchCommon.stopDefault(event);
			};
		},
		gestureStart : function (event) {
			var _this = this;
			event.preventDefault(); //阻止浏览器默认动作
			_this.gesture = new Gesture(event, _this);
		},
		gestureChange : function (event) {
			var _this = this;
			event.preventDefault();
			_this.gesture.change(event, _this);
		},
		gestureEnd : function (event) {
			var _this = this;
			_this.gesture.end(event, _this);
			_this.gesture = null;
		},
		bind : (function() {
			if (window.addEventListener) {
				return function(el, type, fn, capture) {
					var _this = this;
					el.addEventListener(type, function(){
						fn.call(_this,arguments[0]);
						_this.handleHash[type] = arguments.callee;
					}, (capture));
				};
			} else if (window.attachEvent) {
				return function(el, type, fn, capture) {
					var _this = this;
					el.attachEvent("on" + type, function(){
						fn.call(_this,arguments[0]);
						_this.handleHash[type] = arguments.callee;
					});
				};
			}
		})(),
		unbind : (function(){
			if (window.addEventListener) {
				return function(el, type ) {
					var _this = this;
					if(_this.handleHash[type]){
						el.removeEventListener(type, _this.handleHash[type]);
					};
				};
			} else if (window.attachEvent) {
				return function(el, type) {
					var _this = this;
					if(_this.handleHash[type]){
						el.detachEvent("on" + type, _this.handleHash[type]);
					};
				};
			}
		})(),
		destory : function () {
			var _this = this, i;
			for(i in _this.handleHash){
				_this.unbind(_this.obj,i,_this.handleHash[i]);
			}
		}
	};
	window.JTouch = Touch;
}());