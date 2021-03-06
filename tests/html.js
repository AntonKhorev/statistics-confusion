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

testConvertExpressionToHtml(
	'decimal fraction',
	makeFraction(makeNumber('4'),makeNumber('5')),
	'4/5 ≈ 0.8'
);

testConvertExpressionToHtml(
	'number in e-format',
	makeNumber('5000000000000000000000000'),
	'5·1024' // 5*10^24
);

testConvertExpressionToHtml(
	'infinite decimal fraction',
	makeFraction(makeNumber('1'),makeNumber('3')),
	'1/3 ≈ 0.333333'
);

testConvertExpressionToHtml(
	'fraction with sum',
	makeFraction(makeSymbol('A'),makeSum([makeSymbol('B'),makeSymbol('C')])),
	'A/(B+C)'
);

testConvertExpressionToHtml(
	'PLR',
	makeSymbol('PLR'),
	'LR+'
);

testConvertExpressionToHtml(
	'PLR definition',
	makeDefinition(makeSymbol('PLR'),makeNumber(42)),
	'LR+ = 42'
);

testConvertExpressionToHtml(
	'nan',
	{type:'nan'},
	'undefined'
);

testConvertExpressionToHtml(
	'nan in definition',
	makeDefinition(makeSymbol('X'),{type:'nan'}),
	'X is undefined'
);

testConvertExpressionToHtml(
	'infinity',
	{type:'inf'},
	'∞'
);

testConvertExpressionToHtml(
	'product',
	makeProduct([makeSymbol('A'),makeSymbol('B'),makeSymbol('C')]),
	'A·B·C'
);
