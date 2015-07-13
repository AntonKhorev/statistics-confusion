QUnit.module('convert expression to html');

QUnit.test('number',function(assert){
	var e=makeNumber('23');
	var t=$('#qunit-fixture').html(convertExpressionToHtml(e)).text();
	assert.equal(t,'23');
});
