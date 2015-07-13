QUnit.module('make symbol');

QUnit.test('',function(assert){
	var o=makeSymbol('TP');
	assert.deepEqual(o,{type:'sym',val:'TP'});
});


QUnit.module('make number');

QUnit.test('int',function(assert){
	var o=makeNumber('555');
	assert.deepEqual(o,{type:'int',val:555});
});

QUnit.test('float',function(assert){
	var o=makeNumber('55555555555555555555');
	assert.equal(o.type,'float');
	assert.equal(o.val,55555555555555555555);
});


QUnit.module('make sum');

QUnit.test('one symbol',function(assert){
	var o=makeSum([makeSymbol('FP')]);
	assert.deepEqual(o,{type:'sym',val:'FP'});
});

QUnit.test('two symbols',function(assert){
	var o=makeSum([makeSymbol('FP'),makeSymbol('FN')]);
	assert.deepEqual(o,{
		type:'sum',
		subs:[{type:'sym',val:'FP'},{type:'sym',val:'FN'}]
	});
});

QUnit.test('one number',function(assert){
	var o=makeSum([makeNumber('42')]);
	assert.deepEqual(o,{type:'int',val:42});
});

QUnit.test('two numbers',function(assert){
	var o=makeSum([makeNumber('20'),makeNumber('3')]);
	assert.deepEqual(o,{type:'int',val:23});
});

QUnit.test('int and float',function(assert){
	var o=makeSum([makeNumber('20'),makeNumber('55555555555555555555')]);
	assert.equal(o.type,'float');
});

QUnit.test('symbol and number',function(assert){
	var o=makeSum([makeSymbol('FP'),makeNumber('35')]);
	assert.deepEqual(o,{
		type:'sum',
		subs:[{type:'sym',val:'FP'},{type:'int',val:35}]
	});
});

QUnit.test('number and symbol',function(assert){
	var o=makeSum([makeNumber('34'),makeSymbol('FN')]);
	assert.deepEqual(o,{
		type:'sum',
		subs:[{type:'sym',val:'FN'},{type:'int',val:34}]
	});
});

QUnit.test('two numbers and symbol',function(assert){
	var o=makeSum([makeNumber('60'),makeNumber('8'),makeSymbol('TN')]);
	assert.deepEqual(o,{
		type:'sum',
		subs:[{type:'sym',val:'TN'},{type:'int',val:68}]
	});
});

QUnit.test('symbol and zero',function(assert){
	var o=makeSum([makeSymbol('FP'),makeNumber('0')]);
	assert.deepEqual(o,{type:'sym',val:'FP'});
});

QUnit.test('number and nan',function(assert){
	var o=makeSum([makeNumber('3'),{type:'nan'}]);
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('number and infinity',function(assert){
	var o=makeSum([makeNumber('3'),{type:'inf'}]);
	assert.deepEqual(o,{type:'inf'});
});


QUnit.module('make product');

QUnit.test('empty',function(assert){
	var o=makeProduct([]);
	assert.deepEqual(o,{type:'int',val:1});
});

QUnit.test('one symbol',function(assert){
	var o=makeProduct([makeSymbol('FN')]);
	assert.deepEqual(o,{type:'sym',val:'FN'});
});

QUnit.test('two symbols',function(assert){
	var o=makeProduct([makeSymbol('FP'),makeSymbol('FN')]);
	assert.deepEqual(o,{
		type:'prod',
		subs:[{type:'sym',val:'FP'},{type:'sym',val:'FN'}]
	});
});

QUnit.test('one number',function(assert){
	var o=makeProduct([makeNumber('42')]);
	assert.deepEqual(o,{type:'int',val:42});
});

QUnit.test('two numbers',function(assert){
	var o=makeProduct([makeNumber('20'),makeNumber('3')]);
	assert.deepEqual(o,{type:'int',val:60});
});

QUnit.test('int and float',function(assert){
	var o=makeProduct([makeNumber('20'),makeNumber('55555555555555555555')]);
	assert.equal(o.type,'float');
});

QUnit.test('zero and float',function(assert){
	var o=makeProduct([makeNumber('0'),makeNumber('55555555555555555555')]);
	assert.deepEqual(o,{type:'int',val:0});
});

QUnit.test('float and zero',function(assert){
	var o=makeProduct([makeNumber('55555555555555555555'),makeNumber('0')]);
	assert.deepEqual(o,{type:'int',val:0});
});

QUnit.test('symbol and number',function(assert){
	var o=makeProduct([makeSymbol('FP'),makeNumber('35')]);
	assert.deepEqual(o,{
		type:'prod',
		subs:[{type:'int',val:35},{type:'sym',val:'FP'}]
	});
});

QUnit.test('number and symbol',function(assert){
	var o=makeProduct([makeNumber('34'),makeSymbol('FN')]);
	assert.deepEqual(o,{
		type:'prod',
		subs:[{type:'int',val:34},{type:'sym',val:'FN'}]
	});
});

QUnit.test('two numbers and symbol',function(assert){
	var o=makeProduct([makeNumber('6'),makeNumber('8'),makeSymbol('TN')]);
	assert.deepEqual(o,{
		type:'prod',
		subs:[{type:'int',val:48},{type:'sym',val:'TN'}]
	});
});

QUnit.test('symbol and zero',function(assert){
	var o=makeProduct([makeSymbol('TN'),makeNumber('0')]);
	assert.deepEqual(o,{
		type:'prod',
		subs:[{type:'int',val:0},{type:'sym',val:'TN'}]
	});
});

QUnit.test('symbol and one',function(assert){
	var o=makeProduct([makeSymbol('FP'),makeNumber('1')]);
	assert.deepEqual(o,{type:'sym',val:'FP'});
});

QUnit.test('number and nan',function(assert){
	var o=makeProduct([makeNumber('3'),{type:'nan'}]);
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('number and infinity',function(assert){
	var o=makeProduct([makeNumber('3'),{type:'inf'}]);
	assert.deepEqual(o,{type:'inf'});
});

QUnit.test('zero and infinity',function(assert){
	var o=makeProduct([makeNumber('0'),{type:'inf'}]);
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('symbol and nan',function(assert){
	var o=makeProduct([makeSymbol('X'),{type:'nan'}]);
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('symbol and infinity',function(assert){
	var o=makeProduct([makeSymbol('X'),{type:'inf'}]);
	assert.deepEqual(o,{
		type:'prod',
		subs:[{type:'inf'},{type:'sym',val:'X'}]
	});
});

QUnit.test('flatten product',function(assert){
	var o=makeProduct([
		makeProduct([makeSymbol('A'),makeSymbol('B')]),
		makeProduct([makeNumber('5'),makeSymbol('C')])
	]);
	assert.deepEqual(o,{
		type:'prod',
		subs:[{type:'int',val:5},{type:'sym',val:'A'},{type:'sym',val:'B'},{type:'sym',val:'C'}]
	});
});


QUnit.module('make fraction');

QUnit.test('zero over zero',function(assert){
	var o=makeFraction(makeNumber('0'),makeNumber('0'));
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('one over one',function(assert){
	var o=makeFraction(makeNumber('1'),makeNumber('1'));
	assert.deepEqual(o,{type:'int',val:1});
});

QUnit.test('number over number resulting in number',function(assert){
	var o=makeFraction(makeNumber('4'),makeNumber('2'));
	assert.deepEqual(o,{type:'int',val:2});
});

QUnit.test('number over number resulting in fraction',function(assert){
	var o=makeFraction(makeNumber('12'),makeNumber('16'));
	assert.deepEqual(o,{type:'frac',num:{type:'int',val:3},den:{type:'int',val:4}});
});

QUnit.test('number over zero',function(assert){
	var o=makeFraction(makeNumber('42'),makeNumber('0'));
	assert.deepEqual(o,{type:'inf'});
});

QUnit.test('zero over number',function(assert){
	var o=makeFraction(makeNumber('0'),makeNumber('42'));
	assert.deepEqual(o,{type:'int',val:0});
});

QUnit.test('symbol over one',function(assert){
	var o=makeFraction(makeSymbol('X'),makeNumber('1'));
	assert.deepEqual(o,{type:'sym',val:'X'});
});

QUnit.test('one over symbol',function(assert){
	var o=makeFraction(makeNumber('1'),makeSymbol('X'));
	assert.deepEqual(o,{type:'frac',num:{type:'int',val:1},den:{type:'sym',val:'X'}});
});

QUnit.test('product with over product with number',function(assert){
	var o=makeFraction(
		makeProduct([makeNumber('21'),makeSymbol('X')]),
		makeProduct([makeNumber('15'),makeSymbol('Y')])
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'prod',subs:[{type:'int',val:7},{type:'sym',val:'X'}]},
		den:{type:'prod',subs:[{type:'int',val:5},{type:'sym',val:'Y'}]}
	});
});

QUnit.test('nan over number',function(assert){
	var o=makeFraction({type:'nan'},makeNumber('4'));
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('number over nan',function(assert){
	var o=makeFraction(makeNumber('4'),{type:'nan'});
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('nan over symbol',function(assert){
	var o=makeFraction({type:'nan'},makeSymbol('X'));
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('symbol over nan',function(assert){
	var o=makeFraction(makeSymbol('X'),{type:'nan'});
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('infinity over number',function(assert){
	var o=makeFraction({type:'inf'},makeNumber('4'));
	assert.deepEqual(o,{type:'inf'});
});

QUnit.test('number over infinity',function(assert){
	var o=makeFraction(makeNumber('4'),{type:'inf'});
	assert.deepEqual(o,{type:'int',val:0});
});

QUnit.test('infinity over symbol',function(assert){
	var o=makeFraction({type:'inf'},makeSymbol('X'));
	assert.deepEqual(o,{type:'frac',num:{type:'inf'},den:{type:'sym',val:'X'}});
});

QUnit.test('symbol over infinity',function(assert){
	var o=makeFraction(makeSymbol('X'),{type:'inf'});
	assert.deepEqual(o,{type:'prod',subs:[{type:'int',val:0},{type:'sym',val:'X'}]});
});

QUnit.test('infinity*symbol over number*symbol',function(assert){
	var o=makeFraction(
		makeProduct([{type:'inf'},makeSymbol('X')]),
		makeProduct([makeNumber('4'),makeSymbol('Y')])
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'prod',subs:[{type:'inf'},{type:'sym',val:'X'}]},
		den:{type:'sym',val:'Y'}
	});
});

QUnit.test('number*symbol over infinity*symbol',function(assert){
	var o=makeFraction(
		makeProduct([makeNumber('4'),makeSymbol('Y')]),
		makeProduct([{type:'inf'},makeSymbol('X')])
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'prod',subs:[{type:'int',val:0},{type:'sym',val:'Y'}]},
		den:{type:'sym',val:'X'}
	});
});

QUnit.test('fraction over fraction',function(assert){
	var o=makeFraction(
		makeFraction(makeSymbol('A'),makeSymbol('B')),
		makeFraction(makeSymbol('C'),makeSymbol('D'))
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'prod',subs:[{type:'sym',val:'A'},{type:'sym',val:'D'}]},
		den:{type:'prod',subs:[{type:'sym',val:'B'},{type:'sym',val:'C'}]}
	});
});


QUnit.module('make definition');

QUnit.test('',function(assert){
	var o=makeDefinition(makeSymbol('A'),makeSymbol('B'));
	assert.deepEqual(o,{type:'def',lhs:{type:'sym',val:'A'},rhs:{type:'sym',val:'B'}});
});


QUnit.module('parse expression');

QUnit.test('single symbol',function(assert){
	var o=parseExpression('TP');
	assert.deepEqual(o,{type:'sym',val:'TP'});
});

QUnit.test('sum',function(assert){
	var o=parseExpression('TP+FP+FN+TN');
	assert.deepEqual(o,{type:'sum',subs:[
		{type:'sym',val:'TP'},{type:'sym',val:'FP'},{type:'sym',val:'FN'},{type:'sym',val:'TN'}
	]});
});

QUnit.test('definition',function(assert){
	var o=parseExpression('NPV=TN/(FN+TN)');
	assert.deepEqual(o,{
		type:'def',
		lhs:{type:'sym',val:'NPV'},
		rhs:{
			type:'frac',
			num:{type:'sym',val:'TN'},
			den:{type:'sum',subs:[
				{type:'sym',val:'FN'},{type:'sym',val:'TN'}
			]}
		}
	});
});


QUnit.module('substitute into expression');

QUnit.test('nothing',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TERM'),
		{}
	);
	assert.deepEqual(o,{type:'sym',val:'TERM'});
});

QUnit.test('number into single symbol',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TERM'),
		{TERM:makeNumber(23)}
	);
	assert.deepEqual(o,{type:'int',val:23});
});

QUnit.test('number into 1st term of sum',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TP+TN'),
		{TP:makeNumber(10)}
	);
	assert.deepEqual(o,{type:'sum',subs:[
		{type:'sym',val:'TN'},{type:'int',val:10}
	]});
});

QUnit.test('number into 2nd term of sum',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TP+TN'),
		{TN:makeNumber(7)}
	);
	assert.deepEqual(o,{type:'sum',subs:[
		{type:'sym',val:'TP'},{type:'int',val:7}
	]});
});

QUnit.test('number into both terms of sum',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TP+TN'),
		{TP:makeNumber(10),TN:makeNumber(7)}
	);
	assert.deepEqual(o,{type:'int',val:17});
});

QUnit.test('number into middle of sum',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TP+FP+FN+TN'),
		{FP:makeNumber(3)}
	);
	assert.deepEqual(o,{type:'sum',subs:[
		{type:'sym',val:'TP'},{type:'sym',val:'FN'},{type:'sym',val:'TN'},{type:'int',val:3}
	]});
});

QUnit.test('two numbers into 4-term sum',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TP+FP+FN+TN'),
		{FP:makeNumber(3),FN:makeNumber(4)}
	);
	assert.deepEqual(o,{type:'sum',subs:[
		{type:'sym',val:'TP'},{type:'sym',val:'TN'},{type:'int',val:7}
	]});
});

QUnit.test('number into fraction',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TP/(TP+FP)'),
		{TP:makeNumber(40)}
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'int',val:40},
		den:{type:'sum',subs:[{type:'sym',val:'FP'},{type:'int',val:40}]}
	});
});

QUnit.test('two numbers into fraction',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TP/(TP+FP)'),
		{TP:makeNumber(40),FP:makeNumber(10)}
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'int',val:4},
                den:{type:'int',val:5}
	});
});

QUnit.test('number into definition lhs',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TPR=TP/(TP+FN)'),
		{TPR:makeNumber(50)}
	);
	assert.deepEqual(o,{
		type:'def',
		lhs:{type:'sym',val:'TPR'},
		rhs:{type:'frac',
			num:{type:'sym',val:'TP'},
			den:{type:'sum',subs:[{type:'sym',val:'TP'},{type:'sym',val:'FN'}]}
		}
	});
});

QUnit.test('number into definition lhs and rhs',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TPR=TP/(TP+FN)'),
		{TPR:makeNumber(50),FN:makeNumber(5)}
	);
	assert.deepEqual(o,{
		type:'def',
		lhs:{type:'sym',val:'TPR'},
		rhs:{type:'frac',
			num:{type:'sym',val:'TP'},
			den:{type:'sum',subs:[{type:'sym',val:'TP'},{type:'int',val:5}]}
		}
	});
});

QUnit.test('number/1',function(assert){
	var o=substituteIntoExpression(
		parseExpression('A/B'),
		{A:makeNumber(3),B:makeNumber(1)}
	);
	assert.deepEqual(o,{type:'int',val:3});
});

QUnit.test('1/number',function(assert){
	var o=substituteIntoExpression(
		parseExpression('A/B'),
		{A:makeNumber(1),B:makeNumber(3)}
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'int',val:1},
		den:{type:'int',val:3}
	});
});

QUnit.test('0/0',function(assert){
	var o=substituteIntoExpression(
		parseExpression('A/B'),
		{A:makeNumber(0),B:makeNumber(0)}
	);
	assert.deepEqual(o,{type:'nan'});
});

QUnit.test('1 into numerator',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TPR/FPR'),
		{TPR:makeNumber(1)}
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'int',val:1},
		den:{type:'sym',val:'FPR'}
	});
});

QUnit.test('1/2 into numerator',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TPR/FPR'),
		{TPR:makeFraction(makeNumber(1),makeNumber(2))}
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'int',val:1},
		den:{type:'prod',subs:[
			{type:'int',val:2},{type:'sym',val:'FPR'}
		]}
	});
});

QUnit.test('1 into denominator',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TPR/FPR'),
		{FPR:makeNumber(1)}
	);
	assert.deepEqual(o,{type:'sym',val:'TPR'});
});

QUnit.test('1/2 into denominator',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TPR/FPR'),
		{FPR:makeFraction(makeNumber(1),makeNumber(2))}
	);
	assert.deepEqual(o,{type:'prod',subs:[
		{type:'int',val:2},{type:'sym',val:'TPR'}
	]});
});

QUnit.test('fractions into fraction',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TPR/FPR'),
		{TPR:makeFraction(makeNumber(5),makeNumber(7)),FPR:makeFraction(makeNumber(10),makeNumber(7))}
	);
	assert.deepEqual(o,{type:'frac',
		num:{type:'int',val:1},
		den:{type:'int',val:2}
	});
});

QUnit.test('inf and fraction into fraction',function(assert){
	var o=substituteIntoExpression(
		parseExpression('TPR/FPR'),
		{TPR:makeFraction(makeNumber(1),makeNumber(0)),FPR:makeFraction(makeNumber(7),makeNumber(10))}
	);
	assert.deepEqual(o,{type:'inf'});
});

/*
testSubstitutions(
	{TPR:makeFraction(makeNumber(1),makeNumber(0))},
	'TPR/FPR',
	'1/(0*FPR)' // or inf/FPR?
);
*/
