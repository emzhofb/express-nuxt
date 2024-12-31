const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const port = 5000;
const app = express();

// Middleware
app.use(cors());
app.use(helmet());

// Ensure the "uploads" directory exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir);
}

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.listen(port, () => console.log('Server ready on port', port));

module.exports = app;
