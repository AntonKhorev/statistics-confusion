$(function(){
	$('table.statistics-confusion').each(function(){
		var tableNode=$(this);
		var tbodyNode=tableNode.children('tbody');
		var rcDir=0; // outcome headers on top?
		var rcOrd=[0,0]; // outcomes swapped?, conditions swapped?
		var isExpanded=false;
		//function wikipedia(block,url) {
		//	if (url===undefined) url="https://en.wikipedia.org/wiki/"+block.replace(/ /g,'_');
		function wikipedia(block) {
			url="https://en.wikipedia.org/wiki/"+block.replace(/ /g,'_');
			return "<a href='"+url+"'>"+block+"</a>";
		}
		var TP="<span class='actual-true'>T</span><span class='predicted-true'>P</span>";
		var FP="<span class='actual-false'>F</span><span class='predicted-true'>P</span>";
		var FN="<span class='actual-true'>F</span><span class='predicted-false'>N</span>";
		var TN="<span class='actual-false'>T</span><span class='predicted-false'>N</span>";
		var expandData=[
			[ // new row
				"<div class='formula'>("+FN+"+"+TN+")/("+TP+"+"+FP+"+"+FN+"+"+TN+")</div>",
				"<div class='label'>"+wikipedia("False negative rate")+"</div><div class='formula'>FNR="+FN+"/("+TP+"+"+FN+")</div>",
				"<div class='label'>"+wikipedia("False positive rate")+"</div><div class='formula'>FPR="+FP+"/("+FP+"+"+TN+")</div>",
				"<div class='label'>Overall error rate</div><div class='formula'>("+FP+"+"+FN+")/("+TP+"+"+FP+"+"+FN+"+"+TN+")</div>",
				"" // not used
			],[ // new col
				"<div class='formula'>("+FP+"+"+TN+")/("+TP+"+"+FP+"+"+FN+"+"+TN+")</div>",
				"<div class='label'>"+wikipedia("False discovery rate")+"</div><div class='formula'>FDR="+FP+"/("+TP+"+"+FP+")</div>",
				"<div class='label'>"+wikipedia("False omission rate")+"</div><div class='formula'>FOR="+FN+"/("+FN+"+"+TN+")</div>",
				"<div class='label'>"+wikipedia("Positive likelihood ratio")+"</div><div class='formula'>(LR+)=TPR/FPR</div>",
				"<div class='label'>"+wikipedia("Negative likelihood ratio")+"</div><div class='formula'>(LR-)=FNR/TNR</div>"
			]
		];
		function expandTable() {
			function makeCell(callOrd,i,dir) {
				if ((i==1 || i==2) && rcOrd[rcDir^dir^1]) {
					i^=1^2;
				} else if (callOrd && (i==3 || i==4) && rcOrd[rcDir^dir^1]) {
					i^=3^4;
				}
				var s=expandData[rcDir^dir][i];
				return $("<td>").html(s);
			}
			if (isExpanded) return;
			function addCol(callOrd) {
				tbodyNode.children().each(function(i){
					var td=makeCell(callOrd,i,1);
					var swap=rcOrd[rcDir^1]&1;
					if (i==1 || i==2) swap=((i-1)^rcOrd[0]^rcOrd[1])&1;
					if (swap) {
						$(this).children().eq(-1).before(td);
					} else {
						$(this).append(td);
					}
				});
			}
			function addRow(callOrd) {
				var newRowNode=$("<tr>");
				tbodyNode.append(newRowNode);
				tbodyNode.children().eq(-2).children().each(function(i){
					var td=makeCell(callOrd,i,0);
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
				addCol(0);
				addRow(1);
			} else {
				addRow(0);
				addCol(1);
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
