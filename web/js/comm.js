$(function(){
	$("#ico_top").click(function(){
		$("html,body").animate({scrollTop:0}, 500);
	});
	$('#nav>a').on('click', function(){
		var index = $(this).index();
		var href = '';
		if (index === 0) {
			href = 'index.html';
		} else if (index === 1) {
			href = 'web.html';
		} else if (index === 2) {
			href = 'buluo.html';
		} else if (index === 3) {
			href = 'list.html';
		} else if (index === 5) {
			href = 'about.html';
		}
		window.location.href = href;
	})
})