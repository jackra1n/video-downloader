
const express = require('express');
const ytdl = require('ytdl-core')

const app = express();

app.get("/download", async (req, res) => {
	if (req.query.url == null) {
		res.send("No url query parameter provided");
		return;	
	}
	const v_id = req.query.url.split('v=')[1];
    const info = await ytdl.getInfo(req.query.url);
	console.log(info);
	console.log(info.formats);
	res.send({
        info: info.formats.sort((a, b) => {
            return a.mimeType < b.mimeType;
        }),
	});
});

app.get('/files', (req, res) => {
	console.log("TEST DATA");
	res.json({ "files" : { "name" : "test"}});
})

app.listen(3000, () => { console.log('Server is running...') })
