
import express, { Express, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'node:path';
import youtubedl from 'youtube-dl-exec';
import { glob } from 'glob'

const app: Express = express();
const port = 3000;


const INFO_FLAGS = {
	dumpSingleJson: true,
	skipDownload: true
}
const DOWNLOAD_FLAGS = {
	noWarnings: true,
	preferFreeFormats: true,
	writeThumbnail: true,
	format: 'mp4',
	output: 'videos/%(title)s-%(id)s.%(ext)s'
}


export interface Info {
	id: string;
	title: string;
	unique_title: string;
	duration: number;
	thumbnail: string;
	views: number;
	author: string;
	url: string;
	source: string;
	engine: import('stream').Readable;
}

export class Downloader {
	constructor() {
		return Downloader;
	}

	/**
	 * Downloads file through youtube-dl
	 * @param {string} url URL to download stream from
	 */
	static downloadFromUrl(url: string) {
		if (!url || typeof url !== 'string') throw new Error('Invalid url');

		const ytdlProcess = youtubedl.exec(url, DOWNLOAD_FLAGS);
		if (!ytdlProcess.stdout) throw new Error('No stdout');
		const stream = ytdlProcess.stdout;

		stream.on('error', () => {
			if (!ytdlProcess.killed) ytdlProcess.kill();
			stream.resume();
		});
		stream.pipe(fs.createWriteStream('videos/test.mp4'));
		return stream;
	}

	static download(info: Info) {
		youtubedl(info.url, DOWNLOAD_FLAGS);
	}

	/**
	 * Returns stream info
	 * @param {string} url stream url
	 */
	static getInfo(url: string) {
		// eslint-disable-next-line
		return new Promise<{ playlist: any; info: Info[] }>(async (resolve, reject) => {
			if (!url || typeof url !== 'string') {
				reject(new Error('Invalid url'));
			}

			const info = await youtubedl(url, INFO_FLAGS).catch(() => undefined);
			if (!info) {
				return resolve({ playlist: null, info: [] });
			}
			try {
				const data = {
					id: info.id,
					title: info.fulltitle || info.title || 'Attachment',
					unique_title: info.fulltitle + "-" + info.id,
					duration: (info.duration || 0) * 1000,
					thumbnail: info.thumbnails ? info.thumbnails[0].url : info.thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/2/2a/ITunes_12.2_logo.png',
					views: info.view_count || 0,
					author: info.uploader || info.channel || 'YouTubeDL Media',
					url: url,
					source: info.extractor,
					get engine() {
						return Downloader.downloadFromUrl(url);
					}
				} as Info;

				resolve({ playlist: null, info: [data] });
			} catch {
				resolve({ playlist: null, info: [] });
			}
		});
	}
}

app.get("/download", async (req: Request, res: Response) => {
	if (req.query.url == null) {
		res.send("No url query parameter provided");
		return;
	}
	const url = req.query.url.toString();
	const video_info = await Downloader.getInfo(url);
	console.log("video title: " + video_info.info[0].title);
	const file = path.join(__dirname, '../videos', video_info.info[0].unique_title + ".mp4");
	if (fs.existsSync(file)) {
		console.log("File exists");
		res.send("File exists");
		return;
	} else if (video_info.info[0] !== undefined) {
		Downloader.download(video_info.info[0]);
		console.log("Downloaded");
		res.send("Downloaded");
	} else {
		res.send("No video info");
	}
});

app.get('/file', (req: Request, res: Response) => {
	if (req.query.name == null) {
		res.send("No name query parameter provided");
		return;
	}
	const file = path.join(__dirname, '../videos', req.query.name.toString());
	console.log(file);
	try {
		res.sendFile(file);
	} catch (err) {
		res.send(err);
	}
});

app.get('/files', async (req: Request, res: Response) => {
	const directoryPath = path.join(__dirname, '../videos');

	try {
		const files = await glob('*.mp4', { cwd: directoryPath });

		const fileDetails = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(directoryPath, file);

				const stats = await fs.stat(filePath);
				const creationDate = stats.birthtime;

				const thumbnail_path = file.replace('.mp4', '.png');
				console.log(thumbnail_path);

				return {
					name: file,
					creationDate: creationDate,
					thumbnail: thumbnail_path,
				};
			})
		);

		const fileDetailsJSON = JSON.stringify({ files: fileDetails }, null, 2);

		res.header('Content-Type', 'application/json');
		res.send(fileDetailsJSON);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
