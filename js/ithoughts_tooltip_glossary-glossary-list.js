(function(){
	$d.ready(function(){
		var lists = qsa(".glossary-list-details.masonry");
		for(var i = 0, j = lists.length; i < j; i++){
			var list = lists[i];
			var width = list.clientWidth;
			var cols = list.getAttribute("data-cols", 1);
			var margin = 10;
			var targetWidth = ((width)/cols) - (cols*margin);
			var items = list.querySelectorAll('.glossary-list > li');
			for(var k = 0, l = items.length; k < l; k++){
				items[k].style.width = (targetWidth) + "px"
			}
			console.log(new Masonry( list.querySelector(".glossary-list"), {
				columnWidth:targetWidth,
				itemSelector: '.glossary-list > li',
				fitWidth: true,
				gutter: margin
			}));
			console.log(list.getAttribute("data-cols"));
		}
	});
})();