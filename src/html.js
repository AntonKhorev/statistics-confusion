function convertExpressionToHtml(expr,inner) {
	function rec(e) {
		return convertExpressionToHtml(e,true);
	}
	function toFixed(value) { // http://stackoverflow.com/a/661757
		var precision=6;
		var power=Math.pow(10,precision||0);
		return String(Math.round(value*power)/power);
	}
	function isAtom(e) {
		return e.type=='int' || e.type=='float' || e.type=='sym';
	}
	if (expr.type=='int') {
		return String(expr.val);
	} else if (expr.type=='float') {
		return toFixed(expr.val); // TODO markup for e+nn
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
			s+=' = '+toFixed(expr.num.val/expr.den.val);
		}
		return s;
	} else if (expr.type=='def') {
		return rec(expr.lhs)+(expr.rhs.type=='nan'?' is ':' = ')+convertExpressionToHtml(expr.rhs,inner);
	}
}

function makeWrappedFormulaHtml(formula) {
	return "<div class='formula' data-formula='"+formula+"'>"+convertExpressionToHtml(parseExpression(formula))+"</div>";
}

function makeEmptyFormulaHtml(formula) {
	return "<div class='formula' data-formula='"+formula+"' />";
}

// TODO fn to output the whole table
