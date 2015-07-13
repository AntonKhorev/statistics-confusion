function makeSymbol(s) {
	return {type:'sym',val:s};
	// technically need two types of symbols:
	//   finite x: 0*x can be transformed into 0
	//   possibly infinite x: 0*x has to be kept
	// currently playing safe and considering all symbols possibly infinite
	// also all symbols are considered nonnegative, otherwise will need two more types
}

function makeNumber(s) {
	var v=parseInt(s);
	var maxSafeInt=9007199254740991; // Number.MAX_SAFE_INTEGER, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
	if (v<=maxSafeInt) {
		return {type:'int',val:v};
	} else {
		return {type:'float',val:v};
	}
}

// TODO sum with inf and nan
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

// TODO prod with inf and nan
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
	var n=(np.type=='prod'?np.subs[0]:np);
	var d=(dp.type=='prod'?dp.subs[0]:dp);
	if (n.type=='int' && d.type=='int') {
		if (n.val!=0 && d.val!=0) {
			var g=gcd(n.val,d.val);
			n.val/=g;
			d.val/=g;
		} else if (d.val==0 && n.val==0) {
			return {type:'nan'};
		}
	}
	// at this point products may no longer be valid, need to recompute them
	if (np.type=='prod') np=makeProduct(np.subs);
	if (dp.type=='prod') dp=makeProduct(dp.subs);
        if (dp.type=='int' && dp.val==1) {
		return np;
	}
	if (np.type=='int' && dp.type=='int') {
		if (np.val==0) {
			return makeNumber(0);
		} else if (dp.val==0) {
			return {type:'inf'};
		}
	}
	return {type:'frac',num:np,den:dp};
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

function substituteIntoExpression(expr,subs) {
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
