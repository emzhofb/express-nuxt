const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');

const app = express();
const port = 5000;
const delimiter = ' :v-|-:v ';

// Middleware
app.use(cors());
app.use(helmet());

// Ensure the "uploads" directory exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir);
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Multer configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadsDir),
	filename: (req, file, cb) => {
		const originalNameWithoutExt = path.parse(file.originalname).name;
		const fileId = Date.now();
		const extension = path.extname(file.originalname);
		cb(null, `${originalNameWithoutExt}${delimiter}${fileId}${extension}`);
	},
});
const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
		allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
	},
});

// Routes
app.get('/', (req, res) => res.send('Hello World!'));

app.post('/upload', upload.single('file'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded.' });
	}
	console.log(`File uploaded: ${req.file.filename}`);
	res.status(200).json({ filename: req.file.filename });
});

app.get('/files', (req, res) => {
	fs.readdir(uploadsDir, (err, files) => {
		if (err) {
			return res.status(500).json({ error: 'Unable to scan files.' });
		}
		const fileList = files.map(file => ({
			id: file.split(delimiter)[1],
			filename: file.split(delimiter)[0],
			path: `/uploads/${file}`,
		}));
		res.status(200).json(fileList);
	});
});

// Server
app.listen(port, () => console.log(`Server ready on http://localhost:${port}.`));

module.exports = app;
