function makeSymbol(s) {
	return {type:'sym',val:s};
	// technically need two types of symbols:
	//   finite x: 0*x can be transformed into 0
	//   possibly infinite x: 0*x has to be kept
	// currently playing safe and considering all symbols possibly infinite
	// also all symbols are considered nonnegative, otherwise will need two more types
}

// accepts string, not number - this is violated in code below
function makeNumber(s) {
	//if (typeof(s)=='string' && s.indexOf('e')>=0) {
	//	return {type:'float',val:parseFloat(s)};
	//}
	var v=parseInt(s);
	//var maxSafeInt=9007199254740991; // Number.MAX_SAFE_INTEGER, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
	var maxSafeInt=1000000000000; // use floats for numbers that are too large
	if (v<=maxSafeInt) {
		return {type:'int',val:v};
	} else {
		return {type:'float',val:v};
	}
}

function makeSum(ss) {
	var acc=makeNumber(0);
	var hasNan=false;
	var hasInf=false;
	var subs=[];
	// TODO flatten sum? - don't need it here
	ss.forEach(function(s){
		if (s.type=='int') {
			acc.val+=s.val; // TODO check if safe int
		} else if (s.type=='float') {
			acc.val+=s.val;
			acc.type='float';
		} else if (s.type=='nan') {
			hasNan=true;
		} else if (s.type=='inf') {
			hasInf=true;
		} else {
			subs.push(s);
		}
	});
	if (hasNan) {
		return {type:'nan'};
	} else if (hasInf) {
		return {type:'inf'};
	}
	if (acc.val) {
		subs.push(acc);
	}
	if (subs.length>1) {
		return {type:'sum',subs:subs};
	} else if (subs.length==1) {
		return subs[0];
	} else {
		return makeNumber(0);
	}
}

function makeProduct(ss) {
	var acc=makeNumber(1);
	var hasNan=false;
	var hasInf=false;
	var subs=[];
	function handleNumber(s) {
		if (s.type=='int') {
			acc.val*=s.val; // TODO check if safe int
			if (s.val==0) acc.type='int';
			return true;
		} else if (s.type=='float') {
			if (!(acc.type=='int' && acc.val==0)) {
				acc.val*=s.val;
				acc.type='float';
			}
			return true;
		} else {
			return false;
		}
	}
	ss.forEach(function(s){
		if (handleNumber(s)) {
			// done by handleNumber(s)
		} else if (s.type=='prod') {
			s.subs.forEach(function(s){
				if (handleNumber(s)) {
					// done by handleNumber(s)
				} else {
					subs.push(s);
				}
			});
		} else if (s.type=='nan') {
			hasNan=true;
		} else if (s.type=='inf') {
			hasInf=true;
		} else {
			subs.push(s);
		}
	});
	if (hasNan || (acc.val==0 && hasInf)) {
		return {type:'nan'};
	}
	if (acc.val!=1 && !hasInf) {
		subs.unshift(acc);
	}
	if (hasInf) {
		subs.unshift({type:'inf'});
	}
	if (subs.length>1) {
		return {type:'prod',subs:subs}; // number can only be a first subexpression
	} else if (subs.length==1) {
		return subs[0];
	} else {
		return makeNumber(1);
	}
}

function makeFraction(num,den) {
	function gcd(a,b) {
		if (!b) {
			return a;
		} else {
			return gcd(b,a%b);
		}
	};
	(function(){
		var np=makeProduct([]);
		var dp=makeProduct([]);
		if (num.type=='frac') {
			np=makeProduct([np,num.num]);
			dp=makeProduct([dp,num.den]);
		} else {
			np=makeProduct([np,num]);
		}
		if (den.type=='frac') {
			np=makeProduct([np,den.den]);
			dp=makeProduct([dp,den.num]);
		} else {
			dp=makeProduct([dp,den]);
		}
		num=np;
		den=dp;
	})();
	function leadFactor(numden) {
		return numden.type=='prod'?numden.subs[0]:numden;
	}
	function replaceLeadFactor(numden,lead) {
		if (numden.type=='prod') {
			return makeProduct([lead,makeProduct(numden.subs.slice(1))]);
		} else {
			return lead;
		}
	}
	// gcd simplification
	(function(){
		var n=leadFactor(num);
		var d=leadFactor(den);
		if (n.type=='int' && d.type=='int' && n.val!=0 && d.val!=0) {
			var g=gcd(n.val,d.val);
			num=replaceLeadFactor(num,makeNumber(n.val/g));
			den=replaceLeadFactor(den,makeNumber(d.val/g));
		}
	})();
	// first try to move stuff to numerator when makes sense
	(function(){
		var n=leadFactor(num);
		var d=leadFactor(den);
		if (n.type=='int' && n.val==0) {
			if ((d.type=='int'||d.type=='float') && d.val!=0) {
				den=replaceLeadFactor(den,makeNumber(1));
			}
		} else if (n.type=='inf') {
			if (d.type=='int'||d.type=='float') {
				den=replaceLeadFactor(den,makeNumber(1));
			}
		} else if (n.type=='float') {
			if ((d.type=='int'||d.type=='float') && d.val!=0) {
				num=replaceLeadFactor(num,{type:'float',val:n.val/d.val});
				den=replaceLeadFactor(den,makeNumber(1));
			}
		}
	})();
	// then clean up denominator
	(function(){
		var d=leadFactor(den);
		if (d.type=='int' && d.val==0) {
			num=makeProduct([{type:'inf'},num]);
			den=replaceLeadFactor(den,makeNumber(1));
		} else if (d.type=='inf') {
			num=makeProduct([makeNumber(0),num]);
			den=replaceLeadFactor(den,makeNumber(1));
		} else if (d.type=='float') {
			num=makeProduct([{type:'float',val:1/d.val},num]);
			den=replaceLeadFactor(den,makeNumber(1));
		}
	})();
	if (num.type=='nan' || den.type=='nan') {
		return {type:'nan'};
	}
	if (den.type=='int' && den.val==1) {
		return num;
	}
	return {type:'frac',num:num,den:den};
}

function makeDefinition(lhs,rhs) {
	return {type:'def',lhs:lhs,rhs:rhs};
}

function parseExpression(str) {
	function expr(str) {
		function stripParentheses(str) {
			if (str.charAt(0)=='(') {
				return str.slice(1,-1);
			} else {
				return str;
			}
		}
		var match=str.match(/(\(.*\)|\w+)\/(\(.*\)|\w+)/);
		if (match) {
			return makeFraction(
				expr(stripParentheses(match[1])),
				expr(stripParentheses(match[2]))
			);
		} else {
			return makeSum(
				str.split('+').map(function(s){
					return makeSymbol(s);
				})
			);
		}
	}
	function root(str) {
		var match=str.match(/^(.*)=(.*)$/);
		if (match) {
			return makeDefinition(
				makeSymbol(match[1]),
				expr(match[2])
			);
		} else {
			return expr(str);
		}
	}
	return root(str);
}

function substituteIntoExpression(expr,subs) { // FIXME both subexpressions and substitutions are called 'subs'
	function rec(expr) {
		return substituteIntoExpression(expr,subs);
	}
	if (expr.type=='sym') {
		if (expr.val in subs) {
			return subs[expr.val];
		} else {
			return expr;
		}
	} else if (expr.type=='sum') {
		return makeSum(expr.subs.map(rec));
	} else if (expr.type=='prod') {
		return makeProduct(expr.subs.map(rec));
	} else if (expr.type=='frac') {
		return makeFraction(rec(expr.num),rec(expr.den));
	} else if (expr.type=='def') {
		return makeDefinition(expr.lhs,rec(expr.rhs)); // don't substitute in lhs
	} else {
		return expr;
	}
}
