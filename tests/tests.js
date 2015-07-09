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

QUnit.module('make fraction');

function testIntFraction(num1,den1,num2,den2) {
	QUnit.test(''+num1+'/'+den1,function(assert){
		var o=makeFraction({type:'int',val:num1},{type:'int',val:den1});
		assert.deepEqual(o,{type:'frac',num:{type:'int',val:num2},den:{type:'int',val:den2}});
	});
}

testIntFraction(
	0,0,
	0,0
);

testIntFraction(
	1,1,
	1,1
);

testIntFraction(
	4,2,
	2,1
);

testIntFraction(
	12,16,
	3,4
);

testIntFraction(
	42,0,
	1,0
);

testIntFraction(
	0,42,
	0,1
);
