var fs=require('fs');
eval(fs.readFileSync('../src/expr-symbolic.js')+'');
var assert=require('assert');

(function(){
	var o=makeSymbol('TP');
	assert.deepEqual(o,{type:'sym',val:'TP'});
})();

(function(){
	var o=makeNumber('555');
	assert.deepEqual(o,{type:'int',val:555});
})();

(function(){
	var o=makeNumber('55555555555555555555');
	assert.equal(o.type,'float');
	assert.equal(o.val,55555555555555555555);
})();

(function(){
	var o=makeSum([makeSymbol('FP')]);
	assert.deepEqual(o,{type:'sym',val:'FP'});
})();

(function(){
	var o=makeSum([makeSymbol('FP'),makeSymbol('FN')]);
	assert.deepEqual(o,{
		type:'sum',
		terms:[{type:'sym',val:'FP'},{type:'sym',val:'FN'}]
	});
})();

(function(){
	var o=makeSum([makeNumber('42')]);
	assert.deepEqual(o,{type:'int',val:42});
})();

(function(){
	var o=makeSum([makeNumber('20'),makeNum('3')]);
	assert.deepEqual(o,{type:'int',val:23});
})();

(function(){
	var o=makeSum([makeNumber('20'),makeNum('55555555555555555555')]);
	assert.equal(o.type,'float');
})();

console.log('tests ok');
