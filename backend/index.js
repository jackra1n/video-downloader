
const express = require('express');
const youtubedl = require('youtube-dl-exec')

const app = express();

app.get('/files', (req, res) => {
	console.log("TEST DATA");
	res.json({ "files" : {}});
})

app.listen(3000, () => { console.log('Server is running...') })
