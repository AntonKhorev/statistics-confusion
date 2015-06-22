$(function(){
	$('table.statistics-confusion').each(function(){
		var tableNode=$(this);
		tableNode.children('caption').append(
			$("<button type='button' class='swap-rc'>↻</button>")
		).append(
			$("<button type='button' class='swap-c'>↔</button>").click(function(){
				tableNode.find('tr').each(function(){
					var cell1Node=$(this).children().eq(1);
					var cell2Node=$(this).children().eq(2);
					cell1Node.before(cell2Node);
				});
			})
		).append(
			$("<button type='button' class='swap-r'>↕</button>").click(function(){
				var row1Node=tableNode.find('tr').eq(1);
				var row2Node=tableNode.find('tr').eq(2);
				row1Node.before(row2Node);
			})
		);
	});
});
