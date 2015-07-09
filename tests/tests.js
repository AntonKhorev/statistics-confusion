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
	var o=makeSum([makeNumber('20'),makeNum('3')]);
	assert.deepEqual(o,{type:'int',val:23});
});

QUnit.test('make sum from int and float',function(assert){
	var o=makeSum([makeNumber('20'),makeNum('55555555555555555555')]);
	assert.equal(o.type,'float');
});
