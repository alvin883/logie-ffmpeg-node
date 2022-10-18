import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const generateScreenshots = (m3u8: string) =>
  ffmpeg(m3u8)
    .on('error', console.log)
    .screenshots({
      count: 10,
      folder: resolve(__dirname, 'screenshots'),
      size: '320x240',
    });
// exec(
//   `${ffprobePath} -i ${m3u8} -v quiet -show_entries format=duration -hide_banner`
// );
generateScreenshots(
  'https://d1pd0pmhst5qqh.cloudfront.net/23c4edf4-8993-4185-afa6-b4487bf74f0d/137ad7f9-0b49-422b-a233-5a17ffa2b9bb/master/playlist.m3u8'
);

console.log(
  generateScreenshots(
    'https://d1pd0pmhst5qqh.cloudfront.net/23c4edf4-8993-4185-afa6-b4487bf74f0d/137ad7f9-0b49-422b-a233-5a17ffa2b9bb/master/playlist.m3u8'
  )
);
