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
		function swapChildren(node,i){
			var c1=node.children().eq(i);
			var c2=node.children().eq(i+1);
			c1.before(c2);
		}
		tableNode.children('caption').append(
			$("<button type='button' class='swap-rc'>↻</button>").click(function(){
				var t=colOrder;
				colOrder=rowOrder;
				rowOrder=t;
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
			})
		).append(
			$("<button type='button' class='swap-c'>↔</button>").click(function(){
				colOrder^=1;
				tbodyNode.children().each(function(){
					swapChildren($(this),1);
					if (!isExpanded) return;
					swapChildren($(this),3);
				});
			})
		).append(
			$("<button type='button' class='swap-r'>↕</button>").click(function(){
				rowOrder^=1;
				swapChildren(tbodyNode,1);
				if (!isExpanded) return;
				swapChildren(tbodyNode,3);
			})
		).append(
			$("<button type='button' class='add-c'>+</button>").click(expandTable)
		).append(
			$("<button type='button' class='add-r'>+</button>").click(expandTable)
		)
	});
});
