const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/CalculatorRoute');
const mongoose = require('mongoose');

const app = express();
const port = process.env.port || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());

app.use('/api/calc/', routes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
})
