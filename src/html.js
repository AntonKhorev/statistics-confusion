function convertExpressionToHtml(expr,inner) {
	function rec(e) {
		return convertExpressionToHtml(e,true);
	}
	function toFixed(value) { // http://stackoverflow.com/a/661757
		var precision=6;
		var power=Math.pow(10,precision||0);
		return String(Math.round(value*power)/power);
	}
	function formatFloat(value) {
		var ss=value.toExponential().split(/e\+?/);
		var e=parseInt(ss[1]);
		if (e<-2 || e>7) {
			return toFixed(ss[0])+'·10<sup>'+ss[1].replace('-','−')+'</sup>';
		} else {
			return toFixed(value);
		}
	}
	function isAtom(e) {
		return e.type=='int' || e.type=='float' || e.type=='sym';
	}
	function isExact(e) {
		if (e.type=='float') {
			return false;
		} else if (e.type=='sum' || e.type=='prod') {
			return e.subs.every(isExact);
		} else if (e.type=='frac') {
			return isExact(e.num)&&isExact(e.den);
		} else {
			return true;
		}
	}
	function defJoin(rhs) {
		if (rhs.type=='nan') {
			return ' is ';
		} else if (isExact(rhs)) {
			return ' = ';
		} else {
			return ' ≈ ';
		}
	}
	if (expr.type=='int') {
		return String(expr.val);
	} else if (expr.type=='float') {
		return formatFloat(expr.val);
	} else if (expr.type=='inf') {
		return '∞';
	} else if (expr.type=='nan') {
		return 'undefined';
	} else if (expr.type=='sym') {
		var vis=expr.val;
		if (expr.val=='PLR') {
			vis="LR<sub>+</sub>";
		} else if (expr.val=='NLR') {
			vis="LR<sub>−</sub>";
		}
		return "<span class='term' data-term='"+expr.val+"'>"+vis+"</span>";
	} else if (expr.type=='sum') {
		return expr.subs.map(rec).join('+');
	} else if (expr.type=='prod') {
		return expr.subs.map(function(e){
			if (isAtom(e)) {
				return rec(e);
			} else {
				return '('+rec(e)+')'; // TODO span='aux' for e.type=='frac' (but not for e.type=='sum')
			}
		}).join('·');
	} else if (expr.type=='frac') {
		var numdenHtml=function(e){
			if (isAtom(e)) {
				return rec(e);
			} else {
				return "<span class='aux'>(</span>"+rec(e)+"<span class='aux'>)</span>";
			}
		}
		var s="<span class='sfrac'>"+
			"<span class='num'>"+numdenHtml(expr.num)+"</span>"+
			"<span class='aux'>/</span>"+
			"<span class='den'>"+numdenHtml(expr.den)+"</span>"+
		"</span>";
		if (!inner && expr.num.type=='int' && expr.den.type=='int') {
			s+=' ≈ '+formatFloat(expr.num.val/expr.den.val);
		}
		return s;
	} else if (expr.type=='def') {
		return rec(expr.lhs)+defJoin(expr.rhs)+convertExpressionToHtml(expr.rhs,inner);
	}
}

function makeWrappedFormulaHtml(formula) {
	return "<div class='formula' data-formula='"+formula+"'>"+convertExpressionToHtml(parseExpression(formula))+"</div>";
}

function makeEmptyFormulaHtml(formula) {
	return "<div class='formula' data-formula='"+formula+"' />";
}

// TODO fn to output the whole table
