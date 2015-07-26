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

function drawDiagram(rcDir,rcOrd) {
	function hr(h,s) { return s.replace(/h/g,h?'':'-'); }
	function vr(v,s) { return s.replace(/v/g,v?'':'-'); }
	var lobe=rcDir?function(v,h){
		return hr(h,vr(v,'M 0 0 V v2 C 0 v4 h4 v4 h5 v3 C h6 v2 h8 v2 h8 v4 C h8 v6 h6 v6 h5 v5 C h4 v4 0 v4 0 v6 V v8'));
	}:function(h,v){
		return hr(h,vr(v,'M 0 0 H h4 C h6 0 h6 v2 h5 v3 C h4 v4 h4 v6 h6 v6 C h8 v6 h8 v4 h7 v3 C h6 v2 h6 0 h8 0 H h12'));
	};
	var close=rcDir?function(h){
		return hr(h,' H h12 V 0 Z');
	}:function(v){
		return vr(v,' V v8 H 0 Z');
	};
	function tickPaths() {
		var s="";
		for (var i=-5;i<=5;i++) {
			s+="<path d='M -0.25 "+i+" H 0.25' fill='none' stroke='#000' stroke-width='0.05' />";
		}
		return s;
	}
	var textCoords=rcDir?function(h){
		return hr(h,"x='h9.35' y='0'");
	}:function(v){
		return vr(v,"x='0' y='v7.5'");
	}
	return "<svg class='diagram base' viewBox='-12 -8 24 16'>"+
		"<clipPath id='lobe1'><path d='"+lobe(rcOrd[1],!rcOrd[0])+close(rcOrd[0])+"' /></clipPath>"+
		"<path clip-path='url(#lobe1)' class='actual-true' d='"+lobe(rcOrd[1],!rcOrd[0])+"' fill='none' stroke-width='2' />"+
		"<clipPath id='lobe2'><path d='"+lobe(rcOrd[1],!rcOrd[0])+close(!rcOrd[0])+"' /></clipPath>"+
		"<path clip-path='url(#lobe2)' class='actual-false' d='"+lobe(rcOrd[1],!rcOrd[0])+"' fill='none' stroke-width='2' />"+
		"<clipPath id='lobe3'><path d='"+lobe(!rcOrd[1],rcOrd[0])+close(rcOrd[0])+"' /></clipPath>"+
		"<path clip-path='url(#lobe3)' class='actual-true' d='"+lobe(!rcOrd[1],rcOrd[0])+"' fill='none' stroke-width='2' />"+
		"<clipPath id='lobe4'><path d='"+lobe(!rcOrd[1],rcOrd[0])+close(!rcOrd[0])+"' /></clipPath>"+
		"<path clip-path='url(#lobe4)' class='actual-false' d='"+lobe(!rcOrd[1],rcOrd[0])+"' fill='none' stroke-width='2' />"+
		"<g transform='"+(rcDir?"matrix(0,1,1,0,0,0) ":"")+"scale("+vr(!rcOrd[0],'1,v1')+")'>"+
		"<path d='M 0 -6 V 6' fill='none' stroke-width='0.2' stroke='#000' />"+ // axis
		"<path d='M 0 -6 L -0.25 -5.75 L 0 -7 L 0.25 -5.75 Z' />"+
		tickPaths()+
		"<g class='threshold'>"+
			"<path class='predicted-true' d='M -12 -0.2 H 12' fill='none' stroke-width='0.2' />"+
			"<path d='M -12 0 H 12' fill='none' stroke-width='0.2' stroke='#000' />"+
			"<path class='predicted-false' d='M -12 0.2 H 12' fill='none' stroke-width='0.2' />"+
		"</g>"+
		"</g>"+
	"</svg>"+
	"<svg class='diagram labels' viewBox='-12 -8 24 16' pointer-events='none'>"+
		"<text class='higher-threshold' "+textCoords(rcOrd[0])+" text-anchor='middle' dy='.4em' font-size='0.7' font-family='sans-serif' pointer-events='all'>higher threshold</text>"+
		"<text class='lower-threshold' "+textCoords(!rcOrd[0])+" text-anchor='middle' dy='.4em' font-size='0.7' font-family='sans-serif' pointer-events='all'>lower threshold</text>"+
	"</svg>";
}

// TODO fn to output the whole table
