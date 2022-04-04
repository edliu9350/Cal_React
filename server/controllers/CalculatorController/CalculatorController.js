const Big = require('big.js');

//calculate from [total operation next]
const calcMain = (req, res) => {
	const { total, next, operation } = req.query;
	
	let totalNum = isNaN(total) ? null : Big(total);
	let nextNum = isNaN(next) ? null : Big(next);

	if(nextNum == null){
		res.send(totalNum ? totalNum : "0");
		return;
	}

	switch(operation) {
		case 'plus':
			res.send(totalNum.plus(nextNum));
		case 'minus':
			res.send(totalNum.minus(nextNum));
		case 'times':
			res.send(totalNum.times(nextNum));
		case 'divide':
			res.send(totalNum.div(nextNum));
		default: {
			res.send(nextNum);
		}
	}
};

//calculate (-1 * num)
const calcInverse = (req, res) => {
	const { num } = req.query;
	res.send(Big(num).times(-1));
}

//calculate (0.01 * num)
const calcPercent = (req, res) => {
	const { num } = req.query;
	res.send(Big(num).times(0.01));
}

module.exports = {
	calcMain,
	calcInverse,
	calcPercent
}