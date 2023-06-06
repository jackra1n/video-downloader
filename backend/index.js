
const express = require('express');
const youtubedl = require('youtube-dl-exec')

const app = express();

app.get("/download", async (req, res) => {
	if (req.query.url == null) {
		res.send("No url query parameter provided");
		return;	
	}
	youtubedl(req.query.url, {
		dumpSingleJson: true,
		noCheckCertificates: true,
		noWarnings: true,
		preferFreeFormats: true,
		addHeader: [
		'referer:youtube.com',
		'user-agent:googlebot'
		]
	
	}).then(output => console.log(output))
});

app.get('/files', (req, res) => {
	console.log("TEST DATA");
	res.json({ "files" : { "name" : "test"}});
})

app.listen(3000, () => { console.log('Server is running...') })
