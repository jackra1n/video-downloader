
const express = require('express');
const fs = require('fs');
const path = require('path');
const youtubedl = require('youtube-dl-exec')

const app = express();

app.get("/download", async (req, res) => {
	if (req.query.url == null) {
		res.send("No url query parameter provided");
		return;	
	}
	youtubedl(req.query.url, {
		noWarnings: true,
		preferFreeFormats: true,
        format: 'mp4',
        output: 'videos/%(title)s-%(id)s.%(ext)s',
		addHeader: [
		'referer:youtube.com',
		'user-agent:googlebot'
		]
	
	})
});

app.get('/files', (req, res) => {
	let files = fs.readdirSync(path.join(__dirname, 'videos'));
	res.send(files);
});

app.listen(3000, () => { console.log('Server is running...') })
