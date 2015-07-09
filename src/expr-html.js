function makeFormulaHtml(formula) {
	return formula
		.replace(/=/g,' = ')
		.replace(/(\(.*\)|\w+)\/(\(.*\)|\w+)/,function(match,p1,p2){
			function e(formula) {
				if (formula.charAt(0)=='(') {
					return "<span class='aux'>(</span>"+formula.slice(1,-1)+"<span class='aux'>)</span>";
				} else {
					return formula;
				}
			}
			return "<span class='sfrac'>"+
				"<span class='num'>"+e(p1)+"</span>"+
				"<span class='aux'>/</span>"+
				"<span class='den'>"+e(p2)+"</span>"+
			"</span>";
		})
		.replace(/\b[A-Z]+\b/g,function(match){
			var vis=match;
			if (match=='PLR') {
				vis="LR<sub>+</sub>";
			} else if (match=='NLR') {
				vis="LR<sub>−</sub>";
			}
			return "<span class='term' data-term='"+match+"'>"+vis+"</span>";
		})
	;
}

function makeWrappedFormulaHtml(formula) {
	return "<div class='formula' data-formula='"+formula+"'>"+makeFormulaHtml(formula)+"</div>";
}

function makeEmptyFormulaHtml(formula) {
	return "<div class='formula' data-formula='"+formula+"' />";
}
