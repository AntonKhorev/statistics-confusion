var fs=require('fs');
eval(fs.readFileSync('../src/expr-symbolic.js')+'');
var assert=require('assert');

(function(){
	var o=makeNumber('555');
	assert.deepEqual(o,{type:'int',val:555});
})();

(function(){
	var o=makeNumber('55555555555555555555');
	assert.equal(o.type,'float');
})();

console.log('tests ok');
