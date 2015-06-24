function parseFormula(e) {
	return e
		.replace(/\bTP\b/g,"<span class='actual-true'>T</span><span class='predicted-true'>P</span>")
		.replace(/\bFP\b/g,"<span class='actual-false'>F</span><span class='predicted-true'>P</span>")
		.replace(/\bFN\b/g,"<span class='actual-true'>F</span><span class='predicted-false'>N</span>")
		.replace(/\bTN\b/g,"<span class='actual-false'>T</span><span class='predicted-false'>N</span>")
	;
}
