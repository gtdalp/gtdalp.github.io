/**
 * toastjs
 * xisa
 * 0.0.2(2014-2016)
 */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.toast = factory();
  }
}(this, function() {
'use strict';

    var getHead = function(){
            return document.querySelector('head');
        },
        // 向页面中添加style代码块
        // obj是一个hash对象，key是选择器，value是css属性
        addStyle = function(content){
            var tag = document.createElement('style'), rules = [];
            if(typeof content === 'object'){
                Object.keys(content).forEach(function(sel){
                    rules.push(sel + '{' + content[sel] + '; }');
                });
                content = rules.join('\n');
            };
            tag.innerHTML = content;
            getHead().appendChild(tag);
        },
        // 样式
        style = 
            '.toastjs {\
                position: absolute;\
                top: 0;\
                left: 50%;\
                z-index: 10;\
                width: calc(80% - 40px);\
                line-height: 24px;\
                padding: 15px 20px;\
                background: rgba(102, 102, 102, 1);\
                text-align: center;\
                word-break: break-all;\
                word-wrap: break-word;\
                font-size: 14px;\
                color: #fff;\
            }\
            .toastjs-animate-in {\
                -webkit-animation-duration: 0.7s;\
                animation-duration: 0.7s;\
                -webkit-animation-fill-mode: both;\
                animation-fill-mode: both;\
                -webkit-animation-name: shake;\
                animation-name: shake;\
            }\
            @-webkit-keyframes shake {\
                from,\
                to {\
                    -webkit-transform: translate3d(0, 0, 0);\
                    transform: translate3d(0, 0, 0);\
                }\
                10%,\
                30%,\
                50%,\
                70%,\
                90% {\
                    -webkit-transform: translate3d(-10px, 0, 0);\
                    transform: translate3d(-10px, 0, 0);\
                }\
                20%,\
                40%,\
                60%,\
                80% {\
                    -webkit-transform: translate3d(10px, 0, 0);\
                    transform: translate3d(10px, 0, 0);\
                }\
            }\
            @keyframes shake {\
                from,\
                to {\
                    -webkit-transform: translate3d(0, 0, 0);\
                    transform: translate3d(0, 0, 0);\
                }\
                10%,\
                30%,\
                50%,\
                70%,\
                90% {\
                    -webkit-transform: translate3d(-10px, 0, 0);\
                    transform: translate3d(-10px, 0, 0);\
                }\
                20%,\
                40%,\
                60%,\
                80% {\
                    -webkit-transform: translate3d(10px, 0, 0);\
                    transform: translate3d(10px, 0, 0);\
                }\
            }\
            .toastjs-animate-out {\
                animation-name: out;\
                -webkit-animation-name: out;\
            }\
            @-webkit-keyframes out {\
                0% {\
                    opacity: 1;\
                }\
                100% {\
                    opacity: 0;\
                }\
            }\
            @keyframes out {\
                0% {\
                    opacity: 1;\
                }\
                100% {\
                    opacity: 0;\
                }\
            }';
    
    // 添加样式
    addStyle(style);

    // toastjs组件
    function Toast(options) {
        this.options = options;
        this.init();
    }
    Toast.prototype = {
        version: '0.0.2',
        // 初始化
        init: function () {
            this.render();
        },
        isFunction: function( fn ) {
          return  !!fn &&                  // 不为空，存在
            !fn.nodeName &&                // 不是节点对象
            fn.constructor != String &&    // 不是字符串类型
            fn.constructor != RegExp &&    // 不是正则表达式
            fn.constructor != Array &&     // 不是数组
            /function/i.test( fn + "" );   // toString()中包含"function"
        },
        // 渲染
        render: function () {
            var op = this.options;
            var doc = document;
            op.id = 'toastjs';
            
            var toastjs = doc.getElementById(op.id);
            if (!toastjs) {
                var body = doc.body;
                var div = doc.createElement("div");
                div.innerHTML = op.val;
                div.id = op.id;
                body.appendChild(div);
                div.className = 'toastjs';
                var width = div.clientWidth/2;
                var height = div.clientHeight/2;
                div.setAttribute('style', "margin:-" + height + "px 0 0 -" + width + "px;top:50%;");
                div.className = 'toastjs toastjs-animate-in';
            }
            this.hide();
                
        },
        // 显示
        show: function () {
            this.render();
        },
        // 隐藏
        hide: function () {
            var op = this.options;
            var t = op.time;
            var cb = this.isFunction(op.callback) ? op.callback : '';
            var toastjs = document.getElementById(op.id);
            if (toastjs) {
                setTimeout(function () {
                    var cls = toastjs.getAttribute('class') + ' toastjs-animate-out';
                    toastjs.setAttribute('class', cls);
                    // 删除dom节点和回调
                    setTimeout(function () {
                        toastjs.remove();
                        // 回调
                        if (cb) {
                            cb();
                        }
                    }, 806);
                    
                }, t);
                
            }
        },
        // 销毁
        destroy: function () {
            var toastjs = document.getElementById(op.id);
            if (toastjs) {
                toastjs.remove();
            }
        }
    }

    return function (val, time, callback) {
        var options = {
            val: val || '',
            time: time || 3000,
            callback: callback
        }
        return new Toast(options);
    };

}));
