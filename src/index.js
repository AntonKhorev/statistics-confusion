$(function(){
	$('table.statistics-confusion').each(function(){
		var tableNode=$(this);
		var tbodyNode=tableNode.children('tbody');
		var rcDir=0; // outcome headers on top?
		var rcOrd=[0,0]; // outcomes swapped?, conditions swapped?
		var isExpanded=false;
		var expandData=[
			[ // new row
				"TODO R",
				"<div class='label'>False negative rate</div><div class='formula'>FNR=FN/(TP+FN)</div>", // https://en.wikipedia.org/wiki/False_negative_rate
				"<div class='label'>False positive rate</div><div class='formula'>FPR=FP/(FP+TN)</div>", // https://en.wikipedia.org/wiki/False_positive_rate
				"",
				""
			],[ // new col
				"TODO C",
				"<div class='label'>False discovery rate</div><div class='formula'>FDR=FP/(TP+FP)</div>", // https://en.wikipedia.org/wiki/False_discovery_rate
				"<div class='label'>False omission rate</div><div class='formula'>FOR=FN/(FN+TN)</div>", // https://en.wikipedia.org/wiki/False_omission_rate
				"<div class='label'>Overall error rate</div><div class='formula'>(FP+FN)/(TP+FP+FN+TN)</div>",
				""
			]
		];
		function expandTable() {
			function makeCell(i,dir) {
				if ((i==1 || i==2) && rcOrd[rcDir^dir^1]) {
					i=3-i;
				}
				var s=expandData[rcDir^dir][i];
				return $("<td>").html(s);
			}
			if (isExpanded) return;
			function addCol() {
				tbodyNode.children().each(function(i){
					var td=makeCell(i,1);
					var swap=rcOrd[rcDir^1]&1;
					if (i==1 || i==2) swap=((i-1)^rcOrd[0]^rcOrd[1])&1;
					if (swap) {
						$(this).children().eq(-1).before(td);
					} else {
						$(this).append(td);
					}
				});
			}
			function addRow() {
				var newRowNode=$("<tr>");
				tbodyNode.append(newRowNode);
				tbodyNode.children().eq(-2).children().each(function(i){
					var td=makeCell(i,0);
					var swap=rcOrd[rcDir]&1;
					if (i==1 || i==2) swap=((i-1)^rcOrd[0]^rcOrd[1])&1;
					if (swap) {
						$(this).before(td);
						newRowNode.append(this);
					} else {
						newRowNode.append(td);
					}
				});
			}
			if (rcDir) {
				addRow();
				addCol();
			} else {
				addCol();
				addRow();
			}
			isExpanded=true;
		}
		function swapChildren(node,i) {
			var c1=node.children().eq(i);
			var c2=node.children().eq(i+1);
			c1.before(c2);
		}
		tableNode.children('caption').append(
			$("<button type='button' class='swap-rc'>↻</button>").click(function(){
				rcDir^=1;
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
				rcOrd[rcDir^1]^=1;
				tbodyNode.children().each(function(){
					swapChildren($(this),1);
					if (!isExpanded) return;
					swapChildren($(this),3);
				});
			})
		).append(
			$("<button type='button' class='swap-r'>↕</button>").click(function(){
				rcOrd[rcDir]^=1;
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
