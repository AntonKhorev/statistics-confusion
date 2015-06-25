function parseFormula(e) {
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
		.replace(/\b(TP|FP|FN|TN)\b/g,"<span class='term $&'>$&</span>")
	;
}
