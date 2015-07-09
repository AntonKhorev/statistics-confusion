QUnit.test('make symbol',function(assert){
	var o=makeSymbol('TP');
	assert.deepEqual(o,{type:'sym',val:'TP'});
});

QUnit.test('make number int',function(assert){
	var o=makeNumber('555');
	assert.deepEqual(o,{type:'int',val:555});
});

QUnit.test('make number float',function(assert){
	var o=makeNumber('55555555555555555555');
	assert.equal(o.type,'float');
	assert.equal(o.val,55555555555555555555);
});

QUnit.test('make sum from one symbol',function(assert){
	var o=makeSum([makeSymbol('FP')]);
	assert.deepEqual(o,{type:'sym',val:'FP'});
});

QUnit.test('make sum from two symbols',function(assert){
	var o=makeSum([makeSymbol('FP'),makeSymbol('FN')]);
	assert.deepEqual(o,{
		type:'sum',
		terms:[{type:'sym',val:'FP'},{type:'sym',val:'FN'}]
	});
});

QUnit.test('make sum from one number',function(assert){
	var o=makeSum([makeNumber('42')]);
	assert.deepEqual(o,{type:'int',val:42});
});

QUnit.test('make sum from two numbers',function(assert){
	var o=makeSum([makeNumber('20'),makeNumber('3')]);
	assert.deepEqual(o,{type:'int',val:23});
});

QUnit.test('make sum from int and float',function(assert){
	var o=makeSum([makeNumber('20'),makeNumber('55555555555555555555')]);
	assert.equal(o.type,'float');
});

QUnit.test('make sum from symbol and number',function(assert){
	var o=makeSum([makeSymbol('FP'),makeNumber('35')]);
	assert.deepEqual(o,{
		type:'sum',
		terms:[{type:'sym',val:'FP'},{type:'int',val:35}]
	});
});

QUnit.test('make sum from number and symbol',function(assert){
	var o=makeSum([makeNumber('34'),makeSymbol('FN')]);
	assert.deepEqual(o,{
		type:'sum',
		terms:[{type:'sym',val:'FN'},{type:'int',val:34}]
	});
});

QUnit.test('make sum from two numbers and symbol',function(assert){
	var o=makeSum([makeNumber('60'),makeNumber('8'),makeSymbol('TN')]);
	assert.deepEqual(o,{
		type:'sum',
		terms:[{type:'sym',val:'TN'},{type:'int',val:68}]
	});
});

QUnit.test('make sum from symbol and zero',function(assert){
	var o=makeSum([makeSymbol('FP'),makeNumber('0')]);
	assert.deepEqual(o,{type:'sym',val:'FP'});
});
