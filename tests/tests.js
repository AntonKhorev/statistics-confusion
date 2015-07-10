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
