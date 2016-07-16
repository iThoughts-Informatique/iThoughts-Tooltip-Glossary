$(document).ready(function () {
	var AFFIX_TOP_LIMIT;
	$(window).resize(function(){
		AFFIX_TOP_LIMIT = document.getElementById("bodyContent").offsetTop;
	}).resize();
	var AFFIX_OFFSET = 0;
	$('#menu-left').localScroll({hash:true, onAfterFirst:function(){$('html, body').scrollTo( {top:'-=25px'}, 'fast' );}});
	var $menu = $("#menu"),
		$btn = $("#menu-toggle");

	$("#menu-toggle").on("click", function () {
		$menu.toggleClass("open");
		return false;
	});


	$(".docs-nav").each(function () {
		var $affixNav = $(this),
			$container = $affixNav.parent(),
			affixNavfixed = false,
			originalClassName = this.className,
			current = null,
			$links = $affixNav.find("a");

		function getClosestHeader(top) {
			var last = $links.first();

			if (top < AFFIX_TOP_LIMIT) {
				return last;
			}

			for (var i = 0; i < $links.length; i++) {
				try{
					var $link = $links.eq(i),
						href = $link.attr("href");

					if ($link.attr("no-active") != "true" && /*typeof href != "undefined" && href && */href.charAt(0) === "#" && href.length > 1) {
						var $anchor = $(href).first();

						if ($anchor.length > 0) {
							var offset = $anchor.offset();

							if (top < offset.top - AFFIX_OFFSET) {
								return last;
							}

							last = $link;
						}
					}
				} catch(e){
					console.info(e, $link, " have no link");
				}
			}
			return last;
		}


		$(window).on("scroll", function (evt) {
			var top = window.scrollY,
				height = $affixNav.outerHeight(),
				max_bottom = $container.offset().top + $container.outerHeight(),
				bottom = top + height + AFFIX_OFFSET;

			if (affixNavfixed) {
				if (top <= AFFIX_TOP_LIMIT) {
					$affixNav.removeClass("fixed");
					$affixNav.css("top", 0);
					affixNavfixed = false;
				} else if (bottom > max_bottom) {
					$affixNav.css("top", (max_bottom - height) - top);
				} else {
					$affixNav.css("top", AFFIX_OFFSET);
				}
			} else if (top > AFFIX_TOP_LIMIT) {
				$affixNav.addClass("fixed");
				affixNavfixed = true;
			}

			var $current = getClosestHeader(top);

			if (current !== $current) {
				$affixNav.find(".active").removeClass("active");
				$current.addClass("active");
				current = $current;
			}
		}).scroll();
	});

	prettyPrint();
});
