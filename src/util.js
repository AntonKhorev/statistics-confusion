function makeFormulaSubstitutions(e,subs) {
	return e; // TODO
}

function makeFormulaHtml(e) {
	return e
		.replace(/=/g,' = ')
		.replace(/(\(.*\)|\w+)\/(\(.*\)|\w+)/,function(match,p1,p2){
			function e(p) {
				if (p.charAt(0)=='(') {
					return "<span class='aux'>(</span>"+p.slice(1,-1)+"<span class='aux'>)</span>";
				} else {
					return p;
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
			return "<span class='term symbol' data-term='"+match+"'>"+vis+"</span>";
		})
	;
}

function makeWrappedFormulaHtml(e) {
	return "<div class='formula' data-formula='"+e+"'>"+makeFormulaHtml(e)+"</div>";
}
