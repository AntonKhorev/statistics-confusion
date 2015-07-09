// TODO replace with newtest.js

var fs=require('fs');
eval(fs.readFileSync('../src/expr-symbolic.js')+'');
var assert=require('assert');

function testFraction(num1,den1,num2,den2) {
	var frac=makeNumericFraction(num1,den1);
	assert.deepEqual([frac.num,frac.den],[num2,den2]);
}

testFraction(
	0,0,
	0,0
);

testFraction(
	1,1,
	1,1
);

testFraction(
	4,2,
	2,1
);

testFraction(
	12,16,
	3,4
);

testFraction(
	42,0,
	1,0
);

testFraction(
	0,42,
	0,1
);

function testSubstitutions(subs,f1,f2) {
	assert.equal(makeFormulaSubstitutions(f1,subs),f2);
}

testSubstitutions(
	{},
	'TERM',
	'TERM'
);

testSubstitutions(
	{TERM:23},
	'TERM',
	'23'
);

testSubstitutions(
	{},
	'TP+TN',
	'TP+TN'
);

testSubstitutions(
	{TP:10},
	'TP+TN',
	'10+TN'
);

testSubstitutions(
	{TN:7},
	'TP+TN',
	'TP+7'
);

testSubstitutions(
	{},
	'TP+FP+FN+TN',
	'TP+FP+FN+TN'
);

testSubstitutions(
	{FP:3},
	'TP+FP+FN+TN',
	'TP+3+FN+TN'
);

testSubstitutions(
	{FP:3,FN:4},
	'TP+FP+FN+TN',
	'TP+TN+7'
);

testSubstitutions(
	{TP:10,TN:7},
	'TP+TN',
	'17'
);

testSubstitutions(
	{},
	'TP/(TP+FP)',
	'TP/(TP+FP)'
);

testSubstitutions(
	{TP:40},
	'TP/(TP+FP)',
	'40/(40+FP)'
);

testSubstitutions(
	{TP:40,FP:10},
	'TP/(TP+FP)',
	'4/5=0.8'
);

testSubstitutions(
	{},
	'TPR=TP/(TP+FN)',
	'TPR=TP/(TP+FN)'
);

testSubstitutions(
	{TPR:50},
	'TPR=TP/(TP+FN)',
	'TPR=TP/(TP+FN)'
);

testSubstitutions(
	{TPR:50,FN:5},
	'TPR=TP/(TP+FN)',
	'TPR=TP/(TP+5)'
);

testSubstitutions(
	{A:3,B:1},
	'A/B',
	'3'
);

testSubstitutions(
	{A:1,B:3},
	'A/B',
	'1/3=0.333333'
);

testSubstitutions(
	{A:0,B:0},
	'A/B',
	'0/0'
);

testSubstitutions(
	{TPR:makeNumericFraction(1,1)},
	'TPR/FPR',
	'1/FPR'
);

testSubstitutions(
	{TPR:makeNumericFraction(1,2)},
	'TPR/FPR',
	'1/(2*FPR)'
);

testSubstitutions(
	{TPR:makeNumericFraction(2,1)},
	'TPR/FPR',
	'2/FPR'
);

testSubstitutions(
	{FPR:makeNumericFraction(1,1)},
	'TPR/FPR',
	'TPR'
);

testSubstitutions(
	{FPR:makeNumericFraction(2,1)},
	'TPR/FPR',
	'TPR/2'
);

testSubstitutions(
	{FPR:makeNumericFraction(1,2)},
	'TPR/FPR',
	'2*TPR'
);

testSubstitutions(
	{TPR:makeNumericFraction(5,7),FPR:makeNumericFraction(7,10)},
	'TPR/FPR',
	'1/2=0.5'
);

testSubstitutions(
	{TPR:makeNumericFraction(1,0),FPR:makeNumericFraction(7,10)},
	'TPR/FPR',
	'1/0'
);

testSubstitutions(
	{TPR:makeNumericFraction(1,0)},
	'TPR/FPR',
	'1/(0*FPR)'
);

console.log('tests ok');
