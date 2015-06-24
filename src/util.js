function parseFormula(e) {
	return e
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
		.replace(/\bTP\b/g,"<span class='actual-true'>T</span><span class='predicted-true'>P</span>")
		.replace(/\bFP\b/g,"<span class='actual-false'>F</span><span class='predicted-true'>P</span>")
		.replace(/\bFN\b/g,"<span class='actual-true'>F</span><span class='predicted-false'>N</span>")
		.replace(/\bTN\b/g,"<span class='actual-false'>T</span><span class='predicted-false'>N</span>")
	;
}
