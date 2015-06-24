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
	var expandData=[
		[ // new row
			"<div class='formula'>"+parseFormula("(FN+TN)/(TP+FP+FN+TN)")+"</div>",
			"<div class='label'>"+wikipedia("False negative rate")+"</div><div class='formula'>"+parseFormula("FNR=FN/(TP+FN)")+"</div>",
			"<div class='label'>"+wikipedia("False positive rate")+"</div><div class='formula'>"+parseFormula("FPR=FP/(FP+TN)")+"</div>",
			"<div class='label'>Overall error rate</div><div class='formula'>"+parseFormula("(FP+FN)/(TP+FP+FN+TN)")+"</div>",
			"" // not used
		],[ // new col
			"<div class='formula'>"+parseFormula("(FP+TN)/(TP+FP+FN+TN)")+"</div>",
			"<div class='label'>"+wikipedia("False discovery rate")+"</div><div class='formula'>"+parseFormula("FDR=FP/(TP+FP)")+"</div>",
			"<div class='label'>"+wikipedia("False omission rate")+"</div><div class='formula'>"+parseFormula("FOR=FN/(FN+TN)")+"</div>",
			"<div class='label'>"+wikipedia("Positive likelihood ratio")+"</div><div class='formula'>"+parseFormula("(LR+)=TPR/FPR")+"</div>",
			"<div class='label'>"+wikipedia("Negative likelihood ratio")+"</div><div class='formula'>"+parseFormula("(LR−)=FNR/TNR")+"</div>"
		]
	];
	function haveToSwap(dir,i) {
		if (i==1 || i==2) {
			return ((i-1)^rcOrd[0]^rcOrd[1])&1;
		} else {
			rcOrd[rcDir^dir]&1;
		}
	}
	function expandTable() {
		function addCell(callOrd,dir,i,insertNormal,insertSwapped) {
			function makeCell() {
				var j=i;
				if ((j==1 || j==2) && rcOrd[rcDir^dir^1]) {
					j^=1^2;
				} else if (callOrd && (j==3 || j==4) && rcOrd[rcDir^dir^1]) {
					j^=3^4;
				}
				var cellHtml=expandData[rcDir^dir][j];
				return $("<td>").html(cellHtml);
			}
			var cell=makeCell();
			if (haveToSwap(dir,i)) {
				insertSwapped(cell);
			} else {
				insertNormal(cell);
			}
		}
		function addCol(callOrd) {
			tbodyNode.children().each(function(i){
				var oldRow=$(this);
				addCell(callOrd,1,i,function(newCell){
					oldRow.append(newCell);
				},function(newCell){
					oldRow.children().eq(-1).before(newCell);
				});
			});
		}
		function addRow(callOrd) {
			var newRow=$("<tr>");
			tbodyNode.append(newRow);
			tbodyNode.children().eq(-2).children().each(function(i){
				var oldCell=$(this);
				addCell(callOrd,0,i,function(newCell){
					newRow.append(newCell);
				},function(newCell){
					oldCell.before(newCell);
					newRow.append(oldCell);
				});
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
		tableNode.find('button.add-r, button.add-c').text('−').attr('title','contract table').off().click(contractTable);
	}
	function contractTable() {
		function removeCol() {
			tbodyNode.children().each(function(i){
				var oldRow=$(this);
				oldRow.children().eq(haveToSwap(1,i)?-2:-1).remove();
			});
		}
		function removeRow() {
			var oldRow=tbodyNode.children().eq(-2);
			var newRow=tbodyNode.children().eq(-1);
			newRow.children().each(function(i){
				if (haveToSwap(0,i)) {
					var oldCell=$(this);
					var newCell=oldRow.children().eq(i);
					newCell.after(oldCell).remove();
				}
			});
			newRow.remove();
		}
		if (rcDir) {
			removeRow();
			removeCol();
		} else {
			removeCol();
			removeRow();
		}
		isExpanded=false;
		tableNode.find('button.add-r, button.add-c').text('+').attr('title','expand table').off().click(expandTable);
	}
	function swapChildren(node,i) {
		var c1=node.children().eq(i);
		var c2=node.children().eq(i+1);
		c1.before(c2);
	}
	tableNode.children('caption').append(
		$("<button type='button' class='swap-rc' title='swap rows and columns'>↻</button>").click(function(){
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
		$("<button type='button' class='swap-c' title='swap columns'>↔</button>").click(function(){
			rcOrd[rcDir^1]^=1;
			tbodyNode.children().each(function(){
				swapChildren($(this),1);
				if (!isExpanded) return;
				swapChildren($(this),3);
			});
		})
	).append(
		$("<button type='button' class='swap-r' title='swap rows'>↕</button>").click(function(){
			rcOrd[rcDir]^=1;
			swapChildren(tbodyNode,1);
			if (!isExpanded) return;
			swapChildren(tbodyNode,3);
		})
	).append(
		$("<button type='button' class='add-c' title='expand table'>+</button>").click(expandTable)
	).append(
		$("<button type='button' class='add-r' title='expand table'>+</button>").click(expandTable)
	)
});
