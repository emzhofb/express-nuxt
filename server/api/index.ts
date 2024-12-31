const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const port = 5000;
const app = express();

// Middleware
app.use(cors());
app.use(helmet());

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.listen(port, () => console.log('Server ready on port', port));

module.exports = app;
