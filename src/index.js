$(function(){
	$('table.statistics-confusion').each(function(){
		var tableNode=$(this);
		tableNode.children('caption').append(
			$("<button type='button' class='swap-rc'>↻</button>")
		).append(
			$("<button type='button' class='swap-c'>↔</button>")
		).append(
			$("<button type='button' class='swap-r'>↕</button>")
		);
	});
});
