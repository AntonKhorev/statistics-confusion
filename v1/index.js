$(function(){function t(t){return{type:"sym",val:t}}function n(t){var n=parseInt(t),e=1e12;return e>=n?{type:"int",val:n}:{type:"float",val:n}}function e(t){var e=n(0),a=!1,r=!1,i=[];return t.forEach(function(t){"int"==t.type?e.val+=t.val:"float"==t.type?(e.val+=t.val,e.type="float"):"nan"==t.type?a=!0:"inf"==t.type?r=!0:i.push(t)}),a?{type:"nan"}:r?{type:"inf"}:(e.val&&i.push(e),i.length>1?{type:"sum",subs:i}:1==i.length?i[0]:n(0))}function a(t){function e(t){return"int"==t.type?(a.val*=t.val,0==t.val&&(a.type="int"),!0):"float"==t.type?(("int"!=a.type||0!=a.val)&&(a.val*=t.val,a.type="float"),!0):!1}var a=n(1),r=!1,i=!1,l=[];return t.forEach(function(t){e(t)||("prod"==t.type?t.subs.forEach(function(t){e(t)||l.push(t)}):"nan"==t.type?r=!0:"inf"==t.type?i=!0:l.push(t))}),r||0==a.val&&i?{type:"nan"}:(1==a.val||i||l.unshift(a),i&&l.unshift({type:"inf"}),l.length>1?{type:"prod",subs:l}:1==l.length?l[0]:n(1))}function r(t,e){function r(t,n){return n?r(n,t%n):t}function i(t){return"prod"==t.type?t.subs[0]:t}function l(t,n){return"prod"==t.type?a([n,a(t.subs.slice(1))]):n}return function(){var n=a([]),r=a([]);"frac"==t.type?(n=a([n,t.num]),r=a([r,t.den])):n=a([n,t]),"frac"==e.type?(n=a([n,e.den]),r=a([r,e.num])):r=a([r,e]),t=n,e=r}(),function(){var a=i(t),s=i(e);if("int"==a.type&&"int"==s.type&&0!=a.val&&0!=s.val){var o=r(a.val,s.val);t=l(t,n(a.val/o)),e=l(e,n(s.val/o))}}(),function(){var a=i(t),r=i(e);"int"==a.type&&0==a.val?"int"!=r.type&&"float"!=r.type||0==r.val||(e=l(e,n(1))):"inf"==a.type?("int"==r.type||"float"==r.type)&&(e=l(e,n(1))):"float"==a.type&&("int"!=r.type&&"float"!=r.type||0==r.val||(t=l(t,{type:"float",val:a.val/r.val}),e=l(e,n(1))))}(),function(){var r=i(e);"int"==r.type&&0==r.val?(t=a([{type:"inf"},t]),e=l(e,n(1))):"inf"==r.type?(t=a([n(0),t]),e=l(e,n(1))):"float"==r.type&&(t=a([{type:"float",val:1/r.val},t]),e=l(e,n(1)))}(),"nan"==t.type||"nan"==e.type?{type:"nan"}:"int"==e.type&&1==e.val?t:{type:"frac",num:t,den:e}}function i(t,n){return{type:"def",lhs:t,rhs:n}}function l(n){function a(n){function i(t){return"("==t.charAt(0)?t.slice(1,-1):t}var l=n.match(/(\(.*\)|\w+)\/(\(.*\)|\w+)/);return l?r(a(i(l[1])),a(i(l[2]))):e(n.split("+").map(function(n){return t(n)}))}function l(n){var e=n.match(/^(.*)=(.*)$/);return e?i(t(e[1]),a(e[2])):a(n)}return l(n)}function s(t,n){function l(t){return s(t,n)}return"sym"==t.type?t.val in n?n[t.val]:t:"sum"==t.type?e(t.subs.map(l)):"prod"==t.type?a(t.subs.map(l)):"frac"==t.type?r(l(t.num),l(t.den)):"def"==t.type?i(t.lhs,l(t.rhs)):t}function o(t,n){function e(t){return o(t,!0)}function a(t){var n=6,e=Math.pow(10,n||0);return String(Math.round(t*e)/e)}function r(t){var n=t.toExponential().split(/e\+?/),e=parseInt(n[1]);return-2>e||e>7?a(n[0])+"·10<sup>"+n[1].replace("-","−")+"</sup>":a(t)}function i(t){return"int"==t.type||"float"==t.type||"sym"==t.type}function l(t){return"float"==t.type?!1:"sum"==t.type||"prod"==t.type?t.subs.every(l):"frac"==t.type?l(t.num)&&l(t.den):!0}function s(t){return"nan"==t.type?" is ":l(t)?" = ":" ≈ "}if("int"==t.type)return String(t.val);if("float"==t.type)return r(t.val);if("inf"==t.type)return"∞";if("nan"==t.type)return"undefined";if("sym"==t.type){var u=t.val;return"PLR"==t.val?u="LR<sub>+</sub>":"NLR"==t.val&&(u="LR<sub>−</sub>"),"<span class='term' data-term='"+t.val+"'>"+u+"</span>"}if("sum"==t.type)return t.subs.map(e).join("+");if("prod"==t.type)return t.subs.map(function(t){return i(t)?e(t):"("+e(t)+")"}).join("·");if("frac"==t.type){var c=function(t){return i(t)?e(t):"<span class='aux'>(</span>"+e(t)+"<span class='aux'>)</span>"},d="<span class='sfrac'><span class='num'>"+c(t.num)+"</span><span class='aux'>/</span><span class='den'>"+c(t.den)+"</span></span>";return n||"int"!=t.num.type||"int"!=t.den.type||(d+=" ≈ "+r(t.num.val/t.den.val)),d}return"def"==t.type?e(t.lhs)+s(t.rhs)+o(t.rhs,n):void 0}function u(t){return"<div class='formula' data-formula='"+t+"' />"}$("table.statistics-confusion").each(function(){function a(t){return url="https://en.wikipedia.org/wiki/"+t.replace(/ /g,"_"),"<a href='"+url+"'>"+t+"</a>"}function i(t,n){return 1==n||2==n?1&(n-1^N[0]^N[1]):1&N[F^t]}function c(){function t(t,n,e,a,r){function l(){var a=e;1!=a&&2!=a||!N[F^n^1]?t&&(3==a||4==a)&&N[F^n^1]&&(a^=7):a^=3;var r=T[F^n][a],i=$("<td>").html(r[1]);return null!==r[0]&&i.attr("data-term",r[0]),i}var s=l();i(n,e)?r(s):a(s)}function n(n){g.children().each(function(e){var a=$(this);t(n,1,e,function(t){a.append(t)},function(t){a.children().eq(-1).before(t)})})}function e(n){var e=$("<tr>");g.append(e),g.children().eq(-2).children().each(function(a){var r=$(this);t(n,0,a,function(t){e.append(t)},function(t){r.before(t),e.append(r)})})}F?(n(0),e(1)):(e(0),n(1)),P=!0,b.find("button.add-r, button.add-c").text("−").attr("title","contract table").off().click(d),y()}function d(){function t(){g.children().each(function(t){var n=$(this);n.children().eq(i(1,t)?-2:-1).remove()})}function n(){var t=g.children().eq(-2),n=g.children().eq(-1);n.children().each(function(n){if(i(0,n)){var e=$(this),a=t.children().eq(n);a.after(e).remove()}}),n.remove()}F?(n(),t()):(t(),n()),P=!1,b.find("button.add-r, button.add-c").text("+").attr("title","expand table").off().click(c)}function f(t,n){var e=t.children().eq(n),a=t.children().eq(n+1);e.before(a)}function p(t){return"<svg width='100%' height='100%' viewBox='-2 -2 4 4'><g transform='rotate("+t+")'><path d='M -1 1 V 0 A 1 1 0 0 1 1 0 V 1' fill='none' stroke='#000' stroke-width='0.25' /><path d='M -1.4 0.25 L -1 1 L -0.6 0.25 L -1 1.25 Z' stroke='#000' stroke-width='0.15' /><path d='M  1.4 0.25 L  1 1 L  0.6 0.25 L  1 1.25 Z' stroke='#000' stroke-width='0.15' /></g></svg>"}function h(){function t(t,n){return n.replace(/h/g,t?"":"-")}function n(t,n){return n.replace(/v/g,t?"":"-")}function e(){for(var t="",n=-5;5>=n;n++)t+="<path d='M -0.25 "+n+" H 0.25' fill='none' stroke='#000' stroke-width='0.05' />";return t}var a=F?function(e,a){return t(a,n(e,"M 0 0 V v2 C 0 v4 h4 v4 h5 v3 C h6 v2 h8 v2 h8 v4 C h8 v6 h6 v6 h5 v5 C h4 v4 0 v4 0 v6 V v8"))}:function(e,a){return t(e,n(a,"M 0 0 H h4 C h6 0 h6 v2 h5 v3 C h4 v4 h4 v6 h6 v6 C h8 v6 h8 v4 h7 v3 C h6 v2 h6 0 h8 0 H h12"))},r=F?function(n){return t(n," H h12 V 0 Z")}:function(t){return n(t," V v8 H 0 Z")},i=F?function(n){return t(n,"x='h9.35' y='0'")}:function(t){return n(t,"x='0' y='v7.5'")};return"<svg class='diagram base' viewBox='-12 -8 24 16'><path class='actual-true' d='"+a(N[1],!N[0])+r(N[0])+"' /><path class='actual-false' d='"+a(N[1],!N[0])+r(!N[0])+"' /><path class='actual-true' d='"+a(!N[1],N[0])+r(N[0])+"' /><path class='actual-false' d='"+a(!N[1],N[0])+r(!N[0])+"' /><g transform='"+(F?"matrix(0,1,1,0,0,0) ":"")+"scale("+n(!N[0],"1,v1")+")'><path d='M 0 -6 V 6' fill='none' stroke-width='0.2' stroke='#000' /><path d='M 0 -6 L -0.25 -5.75 L 0 -7 L 0.25 -5.75 Z' />"+e()+"<g class='threshold'><path class='predicted-true' d='M -12 -0.2 H 12' fill='none' stroke-width='0.2' /><path d='M -12 0 H 12' fill='none' stroke-width='0.2' stroke='#000' /><path class='predicted-false' d='M -12 0.2 H 12' fill='none' stroke-width='0.2' /></g></g></svg><svg class='diagram labels' viewBox='-12 -8 24 16' pointer-events='none'><text class='higher-threshold' "+i(N[0])+" text-anchor='middle' dy='.4em' font-size='0.7' font-family='sans-serif' pointer-events='all'>higher threshold</text><text class='lower-threshold' "+i(!N[0])+" text-anchor='middle' dy='.4em' font-size='0.7' font-family='sans-serif' pointer-events='all'>lower threshold</text></svg>"}function v(){var t=b.find("td[data-term='TP'] .formula, td[data-term='FP'] .formula"),n=b.find("td[data-term='FN'] .formula, td[data-term='TN'] .formula");b.find(".diagram.labels .higher-threshold").hover(function(){b.find(".diagram.base .threshold").attr("transform","translate(0,-3)"),t.addClass("smaller"),n.addClass("larger")},function(){b.find(".diagram.base .threshold").removeAttr("transform"),t.removeClass("smaller"),n.removeClass("larger")}),b.find(".diagram.labels .lower-threshold").hover(function(){b.find(".diagram.base .threshold").attr("transform","translate(0,3)"),t.addClass("larger"),n.addClass("smaller")},function(){b.find(".diagram.base .threshold").removeAttr("transform"),t.removeClass("larger"),n.removeClass("smaller")})}function m(){b.find(".diagram.labels").remove(),b.find(".diagram").replaceWith(h()),v()}function y(){var t={};for(term in w)w[term]&&(t[term]=n(k[term]));"TP"in t&&"FN"in t&&(t.TPR=r(n(k.TP),e([n(k.TP),n(k.FN)])),t.FNR=r(n(k.FN),e([n(k.TP),n(k.FN)]))),"FP"in t&&"TN"in t&&(t.FPR=r(n(k.FP),e([n(k.FP),n(k.TN)])),t.TNR=r(n(k.TN),e([n(k.FP),n(k.TN)]))),b.find(".formula").each(function(){var n=$(this);n.html(o(s(l(n.attr("data-formula")),t)))})}var b=$(this),g=b.children("tbody"),F=0,N=[0,0],P=!1,T=[[[null,u("(FN+TN)/(TP+FP+FN+TN)")],["FNR","<div class='label'>"+a("False negative rate")+"</div>"+u("FNR=FN/(TP+FN)")],["FPR","<div class='label'>"+a("False positive rate")+"</div>"+u("FPR=FP/(FP+TN)")],[null,"<div class='label'>Overall error rate</div>"+u("(FP+FN)/(TP+FP+FN+TN)")],[null,""]],[[null,u("(FP+TN)/(TP+FP+FN+TN)")],["FDR","<div class='label'>"+a("False discovery rate")+"</div>"+u("FDR=FP/(TP+FP)")],["FOR","<div class='label'>"+a("False omission rate")+"</div>"+u("FOR=FN/(FN+TN)")],["PLR","<div class='label'>"+a("Positive likelihood ratio")+"</div>"+u("PLR=TPR/FPR")],["NLR","<div class='label'>"+a("Negative likelihood ratio")+"</div>"+u("NLR=FNR/TNR")]]];b.children("caption").append(h()).append($("<button type='button' class='swap-rc' title='swap rows and columns'>"+p(-45)+"</button>").click(function(){F^=1,m();for(var t=g.children().length,n=0;t>n;n++)for(var e=0;n>e;e++){var a=g.children().eq(n).children().eq(e),r=g.children().eq(e).children().eq(n),i=r.prev();a.after(r),i.after(a)}})).append($("<button type='button' class='swap-c' title='swap columns'>"+p(0)+"</button>").click(function(){N[1^F]^=1,m(),g.children().each(function(){f($(this),1),P&&f($(this),3)})})).append($("<button type='button' class='add-c' title='expand table'>+</button>").click(c)).append($("<button type='button' class='swap-r' title='swap rows'>"+p(-90)+"</button>").click(function(){N[F]^=1,m(),f(g,1),P&&f(g,3)})).append($("<button type='button' class='add-r' title='expand table'>+</button>").click(c)),v(),b.on("mouseenter",".term",function(){$(this).addClass("highlight"),b.find("td[data-term='"+$(this).attr("data-term")+"']").addClass("highlight")}).on("mouseleave",".term",function(){b.find("td[data-term='"+$(this).attr("data-term")+"']").removeClass("highlight"),$(this).removeClass("highlight")});var w={TP:!1,FP:!1,FN:!1,TN:!1},k={TP:"0",FP:"0",FN:"0",TN:"0"};$.each(w,function(n){var e=b.find("td[data-term='"+n+"']");e.append($("<div class='buttons' />").append($("<input type='button' value='Set number' />").click(function(){if(w[n])w[n]=!1,e.children(".input").attr("class","formula").html(o(t(n))),$(this).val("Set number");else{w[n]=!0;var a=e.children(".formula");a.attr("class","input").html("<label><span class='aux'>"+e.children(".label").eq(0).text()+"</span> <input type='number' min='0' value='"+k[n]+"' required /></label><span class='aux'>, current value:</span> <output>"+k[n]+"</output>"),a.find("input").on("input",function(){this.validity.valid&&(k[n]=this.value,a.find("output").text(k[n]),y())}),$(this).val("Remove number")}y()})))})})});
//# sourceMappingURL=index.js.map