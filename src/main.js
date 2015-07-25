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
			[null,makeEmptyFormulaHtml("(FN+TN)/(TP+FP+FN+TN)")],
			['FNR',"<div class='label'>"+wikipedia("False negative rate")+"</div>"+makeEmptyFormulaHtml("FNR=FN/(TP+FN)")],
			['FPR',"<div class='label'>"+wikipedia("False positive rate")+"</div>"+makeEmptyFormulaHtml("FPR=FP/(FP+TN)")],
			[null,"<div class='label'>Overall error rate</div>"+makeEmptyFormulaHtml("(FP+FN)/(TP+FP+FN+TN)")],
			[null,""] // not used
		],[ // new col
			[null,makeEmptyFormulaHtml("(FP+TN)/(TP+FP+FN+TN)")],
			['FDR',"<div class='label'>"+wikipedia("False discovery rate")+"</div>"+makeEmptyFormulaHtml("FDR=FP/(TP+FP)")],
			['FOR',"<div class='label'>"+wikipedia("False omission rate")+"</div>"+makeEmptyFormulaHtml("FOR=FN/(FN+TN)")],
			['PLR',"<div class='label'>"+wikipedia("Positive likelihood ratio")+"</div>"+makeEmptyFormulaHtml("PLR=TPR/FPR")],
			['NLR',"<div class='label'>"+wikipedia("Negative likelihood ratio")+"</div>"+makeEmptyFormulaHtml("NLR=FNR/TNR")]
		]
	];
	function haveToSwap(dir,i) {
		if (i==1 || i==2) {
			return ((i-1)^rcOrd[0]^rcOrd[1])&1;
		} else {
			return rcOrd[rcDir^dir]&1;
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
				var cellData=expandData[rcDir^dir][j];
				var cell=$("<td>").html(cellData[1]);
				if (cellData[0]!==null) cell.attr('data-term',cellData[0]);
				return cell;
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
		updateFormulas();
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
	function drawSwapIcon(angle) {
		return "<svg width='100%' height='100%' viewBox='-2 -2 4 4'>"+
			"<g transform='rotate("+angle+")'>"+
			"<path d='M -1 1 V 0 A 1 1 0 0 1 1 0 V 1' fill='none' stroke='#000' stroke-width='0.25' />"+
			"<path d='M -1.4 0.25 L -1 1 L -0.6 0.25 L -1 1.25 Z' stroke='#000' stroke-width='0.15' />"+
			"<path d='M  1.4 0.25 L  1 1 L  0.6 0.25 L  1 1.25 Z' stroke='#000' stroke-width='0.15' />"+
			"</g>"+
		"</svg>";
	}
	function drawDiagram() {
		var lobe=rcDir?function(v,h){
			return 'M 0 0 V v2 C 0 v4 h4 v4 h5 v3 C h6 v2 h8 v2 h8 v4 C h8 v6 h6 v6 h5 v5 C h4 v4 0 v4 0 v6 V v8'
				.replace(/h/g,h?'':'-')
				.replace(/v/g,v?'':'-')
			;
		}:function(h,v){
			return 'M 0 0 H h4 C h6 0 h6 v2 h5 v3 C h4 v4 h4 v6 h6 v6 C h8 v6 h8 v4 h7 v3 C h6 v2 h6 0 h8 0 H h12'
				.replace(/h/g,h?'':'-')
				.replace(/v/g,v?'':'-')
			;
		};
		var close=rcDir?function(h){
			return ' H h12 V 0 Z'.replace(/h/g,h?'':'-');
		}:function(v){
			return ' V v8 H 0 Z'.replace(/v/g,v?'':'-');
		};
		var classifierEdge=rcDir?function(h){
			return 'M h0.2 -8 V 8'.replace(/h/g,h?'':'-');
		}:function(v){
			return 'M -12 v0.2 H 12'.replace(/v/g,v?'':'-');
		}
		var classifierCenter=rcDir?'M 0 -8 V 8':'M -12 0 H 12';
		return "<svg class='diagram' viewBox='-12 -8 24 16'>"+
			"<path class='actual-true' d='"+lobe(rcOrd[1],!rcOrd[0])+close(rcOrd[0])+"' />"+
			"<path class='actual-false' d='"+lobe(rcOrd[1],!rcOrd[0])+close(!rcOrd[0])+"' />"+
			"<path class='actual-true' d='"+lobe(!rcOrd[1],rcOrd[0])+close(rcOrd[0])+"' />"+
			"<path class='actual-false' d='"+lobe(!rcOrd[1],rcOrd[0])+close(!rcOrd[0])+"' />"+
			"<path class='predicted-true' d='"+classifierEdge(rcOrd[0])+"' fill='none' stroke-width='0.2' />"+
			"<path d='"+classifierCenter+"' fill='none' stroke-width='0.2' stroke='#000' />"+
			"<path class='predicted-false' d='"+classifierEdge(!rcOrd[0])+"' fill='none' stroke-width='0.2' />"+
		"</svg>";
	}
	tableNode.children('caption').append(drawDiagram()).append(
		$("<button type='button' class='swap-rc' title='swap rows and columns'>"+drawSwapIcon(-45)+"</button>").click(function(){
			rcDir^=1;
			tableNode.find('.diagram').replaceWith(drawDiagram());
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
		$("<button type='button' class='swap-c' title='swap columns'>"+drawSwapIcon(0)+"</button>").click(function(){
			rcOrd[rcDir^1]^=1;
			tableNode.find('.diagram').replaceWith(drawDiagram());
			tbodyNode.children().each(function(){
				swapChildren($(this),1);
				if (!isExpanded) return;
				swapChildren($(this),3);
			});
		})
	).append(
		$("<button type='button' class='add-c' title='expand table'>+</button>").click(expandTable)
	).append(
		$("<button type='button' class='swap-r' title='swap rows'>"+drawSwapIcon(-90)+"</button>").click(function(){
			rcOrd[rcDir]^=1;
			tableNode.find('.diagram').replaceWith(drawDiagram());
			swapChildren(tbodyNode,1);
			if (!isExpanded) return;
			swapChildren(tbodyNode,3);
		})
	).append(
		$("<button type='button' class='add-r' title='expand table'>+</button>").click(expandTable)
	);
	tableNode.on('mouseenter','.term',function(){
		$(this).addClass('highlight');
		tableNode.find("td[data-term='"+$(this).attr('data-term')+"']").addClass('highlight');
	}).on('mouseleave','.term',function(){
		tableNode.find("td[data-term='"+$(this).attr('data-term')+"']").removeClass('highlight');
		$(this).removeClass('highlight');
	});

	// number inputs
	var termInputs={
		'TP':false,
		'FP':false,
		'FN':false,
		'TN':false
	};
	// number input values as strings
	var termValues={
		'TP':'0',
		'FP':'0',
		'FN':'0',
		'TN':'0'
	};
	function updateFormulas() {
		// entered numbers
		var subs={};
		for (term in termInputs) {
			if (termInputs[term]) {
				subs[term]=makeNumber(termValues[term]);
			}
		}
		// hack for DLR
		if ('TP' in subs && 'FN' in subs) {
			subs.TPR=makeFraction(makeNumber(termValues.TP),makeSum([makeNumber(termValues.TP),makeNumber(termValues.FN)]));
			subs.FNR=makeFraction(makeNumber(termValues.FN),makeSum([makeNumber(termValues.TP),makeNumber(termValues.FN)]));
		}
		if ('FP' in subs && 'TN' in subs) {
			subs.FPR=makeFraction(makeNumber(termValues.FP),makeSum([makeNumber(termValues.FP),makeNumber(termValues.TN)]));
			subs.TNR=makeFraction(makeNumber(termValues.TN),makeSum([makeNumber(termValues.FP),makeNumber(termValues.TN)]));
		}
		// update html
		tableNode.find('.formula').each(function(){
			var formula=$(this);
			formula.html(convertExpressionToHtml(substituteIntoExpression(parseExpression(formula.attr('data-formula')),subs)));
		});
	}
	$.each(termInputs,function(term){
		var td=tableNode.find("td[data-term='"+term+"']");
		td.append(
			$("<div class='buttons' />").append(
				$("<input type='button' value='Set number' />").click(function(){
					if (!termInputs[term]) {
						termInputs[term]=true;
						var fi=td.children('.formula');
						fi.attr('class','input').html(
							"<label>"+
								"<span class='aux'>"+td.children('.label').eq(0).text()+"</span> "+
								"<input type='number' min='0' value='"+termValues[term]+"' required />"+
							"</label>"+
							"<span class='aux'>, current value:</span> <output>"+termValues[term]+"</output>"
						);
						fi.find('input').on('input',function(){
							if (this.validity.valid) {
								termValues[term]=this.value;
								fi.find('output').text(termValues[term]);
								updateFormulas();
							}
						});
						$(this).val('Remove number');
					} else {
						termInputs[term]=false;
						td.children('.input').attr('class','formula').html(convertExpressionToHtml(makeSymbol(term)));
						$(this).val('Set number');
					}
					updateFormulas();
				})
			)
		);
	});
});
