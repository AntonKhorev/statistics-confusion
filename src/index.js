$(function(){
	$('table.statistics-confusion').each(function(){
		var tableNode=$(this);
		var tbodyNode=tableNode.children('tbody');
		var colOrder=0;
		var rowOrder=0;
		var isExpanded=false;
		function expandTable(){
			if (isExpanded) return;
			tbodyNode.children().each(function(i){
				if (i==2-rowOrder) {
					$(this).children().eq(-1).before("<td>");
				} else {
					$(this).append("<td>");
				}
			});
			var newRowNode=$("<tr>");
			tbodyNode.append(newRowNode);
			tbodyNode.children().eq(-2).children().each(function(i){
				if (i==2-colOrder) {
					$(this).before("<td>");
					newRowNode.append(this);
				} else {
					newRowNode.append("<td>");
				}
			});
			isExpanded=true;
		}
		tableNode.children('caption').append(
			$("<button type='button' class='swap-rc'>↻</button>").click(function(){
				var n=tbodyNode.children().length;
				for (var i=0;i<n;i++) {
					for (var j=0;j<i;j++) {
						var c1=tbodyNode.children().eq(i).children().eq(j);
						var c2=tbodyNode.children().eq(j).children().eq(i);
						var c2p=c2.prev();
						c1.after(c2);
						c2p.after(c1);
					}
				}
				var t=colOrder;
				colOrder=rowOrder;
				rowOrder=t;
			})
		).append(
			$("<button type='button' class='swap-c'>↔</button>").click(function(){
				tbodyNode.children().each(function(){
					var c1=$(this).children().eq(1);
					var c2=$(this).children().eq(2);
					c1.before(c2);
				});
				colOrder^=1;
			})
		).append(
			$("<button type='button' class='swap-r'>↕</button>").click(function(){
				var r1=tbodyNode.children().eq(1);
				var r2=tbodyNode.children().eq(2);
				r1.before(r2);
				rowOrder^=1;
			})
		).append(
			$("<button type='button' class='add-c'>+</button>").click(expandTable)
		).append(
			$("<button type='button' class='add-r'>+</button>").click(expandTable)
		)
	});
});
