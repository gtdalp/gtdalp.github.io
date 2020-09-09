window.tpl = function (arr, title, o) {
    console.log(arr)
    var html = '';
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        html += '<li>';
        var dataF = arr[i];
        var flg = dataF[5];
        var cls = (o && o.show) ? ' class="active" ' : '';
        var datatrue = ' data-true="1"' + cls;
        html += '<p class="title">' + (i + 1) + '.' + dataF[0] + '</p>';
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