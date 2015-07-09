$(function(){function t(t,n){function e(t){function n(t){return"("==t.charAt(0)?t.slice(1,-1):t}var a=t.match(/(\(.*\)|\w+)\/(\(.*\)|\w+)/);return a?{type:"frac",num:e(n(a[1])),den:e(n(a[2]))}:{type:"sum",terms:t.split("+")}}function a(t){var n=t.match(/^(.*)=(.*)$/);return n?{type:"def",lhs:n[1],rhs:e(n[2])}:e(t)}function r(t){function e(t,n){function e(t,n){return n?e(n,t%n):t}function a(t,n){var e=Math.pow(10,n||0);return String(Math.round(t*e)/e)}var r=parseInt(t),i=parseInt(n);if(0==i)return""+r+"/0";var s=e(r,i);return 1==parseInt(i/s)?""+parseInt(r/s):""+parseInt(r/s)+"/"+parseInt(i/s)+"="+a(r/i,6)}if("def"==t.type)return t.lhs+"="+r(t.rhs);if("frac"==t.type){var a=r(t.num),i=r(t.den);return a.indexOf("+")>=0&&(a="("+a+")"),i.indexOf("+")>=0&&(i="("+i+")"),a.match(/^\d+$/)&&i.match(/^\d+$/)?e(a,i):a+"/"+i}if("sum"==t.type){var s=0,l=0;return t.terms.forEach(function(t){t in n&&(s++,l+=n[t])}),1>=s?t.terms.map(function(t){return t in n?n[t]:t}).join("+"):s<t.terms.length?t.terms.filter(function(t){return!(t in n)}).join("+")+"+"+l:""+l}}var i=a(t);return r(i)}function n(t){return t.replace(/=/g," = ").replace(/(\(.*\)|\w+)\/(\(.*\)|\w+)/,function(t,n,e){function a(t){return"("==t.charAt(0)?"<span class='aux'>(</span>"+t.slice(1,-1)+"<span class='aux'>)</span>":t}return"<span class='sfrac'><span class='num'>"+a(n)+"</span><span class='aux'>/</span><span class='den'>"+a(e)+"</span></span>"}).replace(/\b[A-Z]+\b/g,function(t){var n=t;return"PLR"==t?n="LR<sub>+</sub>":"NLR"==t&&(n="LR<sub>−</sub>"),"<span class='term' data-term='"+t+"'>"+n+"</span>"})}function e(t){return"<div class='formula' data-formula='"+t+"' />"}$("table.statistics-confusion").each(function(){function a(t){return url="https://en.wikipedia.org/wiki/"+t.replace(/ /g,"_"),"<a href='"+url+"'>"+t+"</a>"}function r(t,n){return 1==n||2==n?1&(n-1^p[0]^p[1]):1&p[f^t]}function i(){function t(t,n,e,a,i){function s(){var a=e;1!=a&&2!=a||!p[f^n^1]?t&&(3==a||4==a)&&p[f^n^1]&&(a^=7):a^=3;var r=v[f^n][a],i=$("<td>").html(r[1]);return null!==r[0]&&i.attr("data-term",r[0]),i}var l=s();r(n,e)?i(l):a(l)}function n(n){d.children().each(function(e){var a=$(this);t(n,1,e,function(t){a.append(t)},function(t){a.children().eq(-1).before(t)})})}function e(n){var e=$("<tr>");d.append(e),d.children().eq(-2).children().each(function(a){var r=$(this);t(n,0,a,function(t){e.append(t)},function(t){r.before(t),e.append(r)})})}f?(n(0),e(1)):(e(0),n(1)),h=!0,o.find("button.add-r, button.add-c").text("−").attr("title","contract table").off().click(s),u()}function s(){function t(){d.children().each(function(t){var n=$(this);n.children().eq(r(1,t)?-2:-1).remove()})}function n(){var t=d.children().eq(-2),n=d.children().eq(-1);n.children().each(function(n){if(r(0,n)){var e=$(this),a=t.children().eq(n);a.after(e).remove()}}),n.remove()}f?(n(),t()):(t(),n()),h=!1,o.find("button.add-r, button.add-c").text("+").attr("title","expand table").off().click(i)}function l(t,n){var e=t.children().eq(n),a=t.children().eq(n+1);e.before(a)}function c(t){return"<svg width='100%' height='100%' viewBox='-2 -2 4 4'><g transform='rotate("+t+")'><path d='M -1 1 V 0 A 1 1 0 0 1 1 0 V 1' fill='none' stroke='#000' stroke-width='0.25' /><path d='M -1.4 0.25 L -1 1 L -0.6 0.25 L -1 1.25 Z' stroke='#000' stroke-width='0.15' /><path d='M  1.4 0.25 L  1 1 L  0.6 0.25 L  1 1.25 Z' stroke='#000' stroke-width='0.15' /></g></svg>"}function u(){var e={};for(term in m)m[term]&&(e[term]=b[term]);o.find(".formula").each(function(){var a=$(this);a.html(n(t(a.attr("data-formula"),e)))})}var o=$(this),d=o.children("tbody"),f=0,p=[0,0],h=!1,v=[[[null,e("(FN+TN)/(TP+FP+FN+TN)")],["FNR","<div class='label'>"+a("False negative rate")+"</div>"+e("FNR=FN/(TP+FN)")],["FPR","<div class='label'>"+a("False positive rate")+"</div>"+e("FPR=FP/(FP+TN)")],[null,"<div class='label'>Overall error rate</div>"+e("(FP+FN)/(TP+FP+FN+TN)")],[null,""]],[[null,e("(FP+TN)/(TP+FP+FN+TN)")],["FDR","<div class='label'>"+a("False discovery rate")+"</div>"+e("FDR=FP/(TP+FP)")],["FOR","<div class='label'>"+a("False omission rate")+"</div>"+e("FOR=FN/(FN+TN)")],["PLR","<div class='label'>"+a("Positive likelihood ratio")+"</div>"+e("PLR=TPR/FPR")],["NLR","<div class='label'>"+a("Negative likelihood ratio")+"</div>"+e("NLR=FNR/TNR")]]];o.children("caption").append($("<button type='button' class='swap-rc' title='swap rows and columns'>"+c(-45)+"</button>").click(function(){f^=1;for(var t=d.children().length,n=0;t>n;n++)for(var e=0;n>e;e++){var a=d.children().eq(n).children().eq(e),r=d.children().eq(e).children().eq(n),i=r.prev();a.after(r),i.after(a)}})).append($("<button type='button' class='swap-c' title='swap columns'>"+c(0)+"</button>").click(function(){p[1^f]^=1,d.children().each(function(){l($(this),1),h&&l($(this),3)})})).append($("<button type='button' class='add-c' title='expand table'>+</button>").click(i)).append($("<button type='button' class='swap-r' title='swap rows'>"+c(-90)+"</button>").click(function(){p[f]^=1,l(d,1),h&&l(d,3)})).append($("<button type='button' class='add-r' title='expand table'>+</button>").click(i)),o.on("mouseenter",".term",function(){$(this).addClass("highlight"),o.find("td[data-term='"+$(this).attr("data-term")+"']").addClass("highlight")}).on("mouseleave",".term",function(){o.find("td[data-term='"+$(this).attr("data-term")+"']").removeClass("highlight"),$(this).removeClass("highlight")});var m={TP:!1,FP:!1,FN:!1,TN:!1},b={TP:0,FP:0,FN:0,TN:0};$.each(m,function(t){var e=o.find("td[data-term='"+t+"']");e.append($("<div class='buttons' />").append($("<input type='button' value='Set number' />").click(function(){if(m[t])m[t]=!1,e.children(".input").attr("class","formula").html(n(t)),$(this).val("Set number");else{m[t]=!0;var a=e.children(".formula");a.attr("class","input").html("<label><span class='aux'>"+e.children(".label").eq(0).text()+"</span> <input type='number' min='0' value='"+b[t]+"' required /></label><span class='aux'>, current value:</span> <output>"+b[t]+"</output>"),a.find("input").on("input",function(){this.validity.valid&&(b[t]=parseInt(this.value),a.find("output").text(b[t]),u())}),$(this).val("Remove number")}u()})))})})});
//# sourceMappingURL=index.js.map