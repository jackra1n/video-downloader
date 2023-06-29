
import express, { Express, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import youtubedl from 'youtube-dl-exec';

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
	title: string;
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
		const ytdlProcess = youtubedl.exec(info.url, DOWNLOAD_FLAGS);
		if (!ytdlProcess.stdout) throw new Error('No stdout');
		const stream = ytdlProcess.stdout;

		stream.on('error', () => {
			if (!ytdlProcess.killed) ytdlProcess.kill();
			stream.resume();
		});
		stream.pipe(fs.createWriteStream('videos/' + info.title + '-' + info.author + '.mp4'));
		return stream;
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
			console.log("info: " + info);
			if (info) console.log("info.fulltitle: " + info.fulltitle);

			if (!info) {
				return resolve({ playlist: null, info: [] });
			}
			try {
				const data = {
					title: info.fulltitle || info.title || 'Attachment',
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
	console.log("video_info: " + video_info.info[0]);
	if (video_info != undefined) {
		Downloader.download(video_info.info[0]);
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
		const files = await fs.readdir(directoryPath);

		const fileDetails = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(directoryPath, file);

				const stats = await fs.stat(filePath);
				const creationDate = stats.birthtime;

				// Get thumbnail from file
				const thumbnail = await getThumbnail(filePath); // Custom function to retrieve thumbnail

				return {
					name: file,
					creationDate: creationDate,
					thumbnail: thumbnail,
				};
			})
		);

		res.json(fileDetails);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

async function getThumbnail(filePath: string): Promise<string> {
	const thumbnailPath = path.join(path.dirname(filePath), 'thumbnails', `${path.basename(filePath)}.thumb.jpg`);

	try {
		await fs.ensureDir(path.dirname(thumbnailPath));

		// Read the file contents and create a base64-encoded thumbnail
		const fileContents = await fs.readFile(filePath);
		const thumbnail = `data:image/jpeg;base64,${fileContents.toString('base64')}`;

		return thumbnail;
	} catch (err) {
		console.error(`Error generating thumbnail for ${filePath}`, err);
		throw err;
	}
}

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
