$( document ).ready(function() {
	var menuOpen = false;
	$('#menu').click(function() {
		if (menuOpen) {
			menuOpen = false;
			$(this).removeClass("click");
			$("nav, #navMask").removeClass("open");
		} else {
			menuOpen = true;
			$(this).addClass("click");
			$("nav, #navMask").addClass("open");
		}
	});
	
	$('#navMask').click(function() {
		if (menuOpen) {
			menuOpen = false;
			$("#menu").removeClass("click");
			$("nav, #navMask").removeClass("open");
		} else {
			menuOpen = true;
			$("menu").addClass("click");
			$("nav, #navMask").addClass("open");
		}
	});
	
	$('.nav-link').click(function() {
		if (menuOpen) {
			menuOpen = false;
			$("#menu").removeClass("click");
			$("nav, #navMask").removeClass("open");
		}
	});
	
});