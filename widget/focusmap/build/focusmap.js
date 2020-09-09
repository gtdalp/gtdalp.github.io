/**
 * Focusmap
 * xisa (2014-2016)
 */
 ;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Focusmap = factory();
  }
}(this, function() {
    'use strict';
    // hapjs
    function Interval(callback, interval, count, callbackNow) {

        var startTime, tick;

        if(typeof callback !== 'function') return;
        if(!interval) interval = 1000;
        if(!count) count = 0;

        startTime = new Date().getTime();

        tick = function() {

            var timespan, wait;

            timespan = new Date().getTime() - startTime,
            wait = interval - (timespan % interval);

            this.pass = Math.floor(timespan / interval) + 1;
            this.surplus = count - this.pass;

            setTimeout(function() {
                if (this._stop) return;

                if ( false === callback.call(this, this.pass, this.surplus) ){
                    this.stop();
                    return;
                }

                if ( count && !this.surplus){
                    this.stop();
                    return;
                }

                tick();

            }.bind(this), wait);

        }.bind(this);

        this.stop = function() {
            this._stop = true;
        }

        this.pass = 0;
        this.surplus = count - this.pass;

        if(callbackNow){
            callback.call(this, this.pass, this.surplus);
        };

        tick(0);

        return this;
    };
    function Focusmap(element, options) {
        if (typeof element !== 'string' || typeof options !== "object") return;
    	this.ele = $(element);
        this.init(options);
    }

    Focusmap.prototype = {
        version: '1.0.0',
        // 初始化
        init: function (options) {
        	this.options = {};
        	// 每隔多少毫秒
        	this.options.time = 3000;
            // 动画过渡时间
            this.options.transitionTime = 1000;
            // 动画
            this.options.Animate = null;

        	$.extend(this.options, options);
            // 执行render
            this.render();
        },
        // 入口
        render: function () {
	        // 创建css样式
	        this.createStyles();

            // 创建模板
            this.createTemplate();

            // 事件
            this.event();
        },
        // 创建css样式
        createStyles: function () {
        	var style = '<style>html,body{margin:0;}ul{padding:0;margin:0;list-style:none;}li{list-style-type:none;}img{border:none;vertical-align:middle;}.focusmap-ul{height:100%;position:relative;}.focusmap-ul>li{position:absolute;top:0;left:0;z-index:1;height:100%;width:100%;background-size:cover;background-position:50% 50%;opacity:0;}.focusmap-ul>li>a{display:block;height:100%;}.focusmap-point{position:absolute;bottom:20px;left:0;z-index:3;width:100%;text-align:center;}.focusmap-point>a{display:inline-block;width:15px;height:15px;margin-right:7px;border-radius:50%;background:#68625C;font-size:0;}.focusmap-point>a:last-child{margin-right:0;}.focusmap-point>a.active{background:#F07A16;}</style>';
            // 渲染样式
        	$('body').append(style);
        },
        // 创建模板
        createTemplate: function () {
        	var op = this.options, dataF, src, href,
        		data = op.data, i = 0,
        		html = '', pointHtml = '';
        	
        	if (!Array.isArray(data)) {
        		data = [];
        	}
        	var length = data.length;

        	for (; i < length; i++) {
        		dataF = data[i];
        		// 图片
        		src = dataF.src || '';
        		// 跳转链接
        		href = dataF.href || '';
        		// 图片
        		html += '<li style="background-image:url(' + src + ');' + 
                            (i === 0 ? 'opacity:1;z-index:2;' : '') + '">' + 
        					(href ? '<a href="' + href + '"></a>' : '') + 
        				'</li>';

        		// 小点
        		pointHtml += '<a href="javascript:void(0);"' + 
        						(i === 0 ? 'class="active"' : '') + '>' + i + 
        					 '</a>';
        	}
        	// 图片
        	html = '<ul class="focusmap-ul">' + html + '</ul>';
        	// 点
        	pointHtml = '<div class="focusmap-point">' + pointHtml + '</div>';
        	
        	// 渲染
        	this.ele.css('position', 'relative').html(html + pointHtml);
        },
        // 切换图片
        toggleImg: function (index) {
            var op = this.options,
                ele = this.ele,
                // 动画过渡时间
                time = op.transitionTime,
                img = ele.find('.focusmap-ul li'),
                point = ele.find('.focusmap-point a');

            // 切换小点
            point.eq(index).addClass("active").siblings()
                           .removeClass("active");
            // 切换图片
            img.eq(index).animate({"opacity" : 1, 'z-index': 2}, time).siblings()
                         .animate({"opacity" : 0, 'z-index': 1}, time);   
        },
        // 事件
        event: function () {
        	var op = this.options, index = 0,
        		time = op.time,
        		self = this,
        		length = op.data.length - 1,
        		ele = this.ele,
        		img = ele.find('.focusmap-ul li'),
        		point = ele.find('.focusmap-point a');

        	// 执行动画
        	ele.hover(function() {    
                // 鼠标放上去图片的时候清除动画
                op.Animate.stop();
			}, function() {

                // 鼠标移开图片的时候重新执行动画
                op.Animate = new Interval(function () {
                    if (!img.is(":animated")) {

                        // 当图片切换到了最后一张的时候
                        if (index === length) { 
                            index = 0;
                        } else {
                            index++;
                        }
                        self.toggleImg(index);
                    }
                }, time);
			}).trigger("mouseleave");

			// 点击小点
			point.on('click', function () {
                // 判断图片是否在动画
                if (img.is(":animated")) return;
				index = $(this).index();
				self.toggleImg(index);
			});
        },
        // 销毁
        destroy: function () {
            // 删除
            this.options.Animate = null;
            clearInterval(this.options.Animate);
            this.ele.remove();
        }
    }

    return Focusmap;
}));