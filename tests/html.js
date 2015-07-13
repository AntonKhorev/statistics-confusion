QUnit.module('convert expression to html');

function testConvertExpressionToHtml(name,expr,text){
	QUnit.test(name,function(assert){
		var el=document.getElementById('qunit-fixture');
		el.innerHTML=convertExpressionToHtml(expr);
		assert.equal(el.textContent,text);
	});
}

testConvertExpressionToHtml(
	'number',
	makeNumber('23'),
	'23'
);
