import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import { chmodSync } from 'fs';
import mkdirp from 'mkdirp';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { secondsToFormatedDuration } from './SecondsToFormatedDuration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  await chmodSync(ffmpegPath, '775');
  await chmodSync(ffprobePath, '775');
} catch (err) {
  console.log(err);
}

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const generateScreenshots = async (
  m3u8: string,
  totalScreenshots: number = 10
) => {
  // const logsDir = resolve(__dirname, '../logs');
  // const probePath = resolve(logsDir, 'ffprobe.json');
  // await mkdirp(logsDir);

  const screenshotsDir = resolve(__dirname, '../screenshots');
  await mkdirp(screenshotsDir);

  const ffprobe = await promisify(ffmpeg.ffprobe);
  const metadata = (await ffprobe(m3u8)) as ffmpeg.FfprobeData;
  const duration = Math.floor(metadata.format.duration);
  const interval = Math.floor(duration / totalScreenshots);

  let timestamps = [];
  for (let index = 0; index < totalScreenshots; index++) {
    const timestamp = index === 0 ? 1 : index * interval;

    timestamps[index] = timestamp;

    ffmpeg(m3u8)
      .seekInput(`${secondsToFormatedDuration(timestamp)}.000`)
      .addOutput(resolve(screenshotsDir, `screenshot-${index + 1}.jpg`))
      .outputOptions('-frames', '1')
      .on('end', () => console.log(`[${index + 1}] Screenshot taken`))
      .run();
  }
};

generateScreenshots(
  'https://d1pd0pmhst5qqh.cloudfront.net/23c4edf4-8993-4185-afa6-b4487bf74f0d/137ad7f9-0b49-422b-a233-5a17ffa2b9bb/master/playlist.m3u8'
);
