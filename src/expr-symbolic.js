function makeNumericFraction(num,den) {
	function gcd(a,b) {
		if (!b) {
			return a;
		} else {
			return gcd(b,a%b);
		}
	};
	var n=parseInt(num);
	var d=parseInt(den);
	if (d==0) {
		if (n==0) {
			return {num:0,den:0};
		} else {
			return {num:1,den:0};
		}
	} else {
		var g=gcd(n,d);
		return {num:parseInt(n/g),den:parseInt(d/g)};
	}
}

function makeFormulaSubstitutions(formula,subs) {
	// parse
	function expr(formula) {
		function stripParentheses(formula) {
			if (formula.charAt(0)=='(') {
				return formula.slice(1,-1);
			} else {
				return formula;
			}
		}
		var match=formula.match(/(\(.*\)|\w+)\/(\(.*\)|\w+)/);
		if (match) {
			return {
				type:'frac',
				num:expr(stripParentheses(match[1])),
				den:expr(stripParentheses(match[2]))
			}
		} else {
			return {
				type:'sum',
				terms:formula.split('+')
			}
		}
	}
	function root(formula) {
		var match=formula.match(/^(.*)=(.*)$/);
		if (match) {
			return {
				type:'def',
				lhs:match[1],
				rhs:expr(match[2])
			};
		} else {
			return expr(formula);
		}
	}
	var tree=root(formula);

	// substitute
	function synth(node) {
		function numericFraction(num,den) {
			// http://stackoverflow.com/a/661757
			function toFixed(value,precision) {
				var power=Math.pow(10,precision||0);
				return String(Math.round(value*power)/power);
			}
			var frac=makeNumericFraction(num,den);
			if (frac.den==0) {
				return ''+frac.num+'/'+frac.den;
			} else if (frac.den==1) {
				return ''+frac.num;
			} else {
				return ''+frac.num+'/'+frac.den+'='+toFixed(frac.num/frac.den,6);
			}
		}
		if (node.type=='def') {
			return node.lhs+'='+synth(node.rhs);
		} else if (node.type=='frac') {
			var num=synth(node.num);
			var den=synth(node.den);
			if (num.indexOf('+')>=0) num='('+num+')';
			if (den.indexOf('+')>=0) den='('+den+')';
			if (num.match(/^\d+$/) && den.match(/^\d+$/)) {
				return numericFraction(num,den);
			} else {
				return num+'/'+den;
			}
		} else if (node.type=='sum') {
			var nMatches=0;
			var sum=0;
			node.terms.forEach(function(term){
				if (term in subs) {
					nMatches++;
					sum+=subs[term];
				}
			});
			if (nMatches<=1) {
				return node.terms.map(function(term){
					return (term in subs) ? subs[term] : term;
				}).join('+');
			} else if (nMatches<node.terms.length) {
				return node.terms.filter(function(term){
					return !(term in subs)
				}).join('+')+'+'+sum;
			} else {
				return ''+sum;
			}
		}
	}
	return synth(tree);
}
