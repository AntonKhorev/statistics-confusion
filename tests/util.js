var fs=require('fs');
eval(fs.readFileSync('../src/util.js')+'');
var assert=require('assert');

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

console.log('tests ok');
