window.tpl = function (arr, title, o) {

    var html = '';
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        html += '<li>';
        var dataF = arr[i];
        var flg = dataF[5];
        var cls = (o && o.show) ? ' class="active" ' : '';
        var datatrue = ' data-true="1"' + cls;
        html += '<p class="title">' + dataF[0] + '</p>';
        html += '<p class="selected">\
            <span' + (flg == '标准答案：A' ? datatrue : '') + '>' + dataF[1] + '</span>\
            <span' + (flg == '标准答案：B' ? datatrue : '') + '>' + dataF[2] + '</span>\
            <span' + (flg == '标准答案：C' ? datatrue : '') + '>' + dataF[3] + '</span>\
            <span' + (flg == '标准答案：D' ? datatrue : '') + '>' + dataF[4] + '</span>\
        </p>';
        html += '</li>';
    }
    document.title = title;
    $('body').append('<h3 class="title-h3">' + title + '</h3><ul class="radio-ul"></ul>');
    $('.radio-ul').html(html);
    $('.radio-ul>li>p>span').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });
}

window.tplReading = function (arr, flg) {
    
    var k = 0;
    var len = arr.length;
    var html = '';
    for (; k < len; k++) {
        var dataF = arr[k];
        var title = dataF.title;
        var type = dataF.type;
        var data = dataF.arr;

        if (!flg) html += '<li><p class="miaoshu">' + title + '</p></li>';
        if (type == 1) {
            html += creatHtml1(data);
        }
        if (type == 2) {
            html += creatHtml2(data);
        }
        if (type == 3) {
            html += creatHtml3(data);
        }
    }
    if (flg) {
        $('.radio-ul').append(html);
    } else {
        $('.radio-ul').html(html);
    }
    
}
var creatHtml3 = function (arr) {
    var html = '';
    var len = arr.length;
    var l = len/7;

    for (var i = 0; i < l; i++) {
        var n = 7*i;
        var t = arr[n];
        var flg = arr[n+6]
        var datatrue = ' data-true="1"';
        html +='<li>\
            <p class="title">' + arr[n+0] + '</p>\
            <p class="selected">\
                <span' + (flg == '答案：A' ? datatrue : '') + '>' + arr[n+1] + '</span>\
                <span' + (flg == '答案：B' ? datatrue : '') + '>' + arr[n+2] + '</span>\
                <span' + (flg == '答案：C' ? datatrue : '') + '>' + arr[n+3] + '</span>\
                <span' + (flg == '答案：D' ? datatrue : '') + '>' + arr[n+4] + '</span>\
                <span' + (flg == '答案：E' ? datatrue : '') + '>' + arr[n+5] + '</span>\
            </p>\
        </li>';
    }
    return html;
}

var creatHtml2 = function (arr) {
    var html = '';
    var len = arr.length;
    var l = len/6;

    for (var i = 0; i < l; i++) {
        var n = 6*i;
        var t = arr[n];
        var flg = arr[n+5]
        var datatrue = ' data-true="1"';
        html +='<li>\
            <p class="title">' + arr[n+0] + '</p>\
            <p class="selected">\
                <span' + (flg == '答案：A' ? datatrue : '') + '>' + arr[n+1] + '</span>\
                <span' + (flg == '答案：B' ? datatrue : '') + '>' + arr[n+2] + '</span>\
                <span' + (flg == '答案：C' ? datatrue : '') + '>' + arr[n+3] + '</span>\
                <span' + (flg == '答案：D' ? datatrue : '') + '>' + arr[n+4] + '</span>\
            </p>\
        </li>';
    }
    return html;
}


var creatHtml1 = function (arr) {
    var html = '';
    var len = arr.length;
    var l = len/4;

    for (var i = 0; i < l; i++) {
        var n = 4*i;
        var t = arr[n];
        var flg = arr[n+3]
        var datatrue = ' data-true="1"';
        html +='<li>\
            <p class="title">' + arr[n+0] + '</p>\
            <p class="selected">\
                <span' + (flg == '答案：A' ? datatrue : '') + '>' + arr[n+1] + '</span>\
                <span' + (flg == '答案：B' ? datatrue : '') + '>' + arr[n+2] + '</span>\
            </p>\
        </li>';
    }
    return html;
}


// 翻译
window.transformFn = function (arr) {
    var html = '';
    var len = arr.length;

    for (var i = 0; i < len; i++) {
        var dataF = arr[i];
        if (i%2 == 0) {
            html +='<li class="title"><p class="title">' + dataF + '</p></li>';
        } else {
            html +='<li class="text-li dn"><p class="text">' + dataF + '</p></li>';
        }
    }
    $('.radio-ul').html(html);
}