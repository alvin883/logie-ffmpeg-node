import ffmpeg from 'fluent-ffmpeg';
import { fastify } from 'fastify';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { secondsToFormatedDuration } from './SecondsToFormatedDuration.js';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify();

const generateScreenshots = async (
  m3u8: string,
  totalScreenshots: number = 10
) => {
  // const logsDir = resolve(__dirname, '../logs');
  // const probePath = resolve(logsDir, 'ffprobe.json');
  // await mkdirp(logsDir);

  const screenshotsDir = pathResolve(__dirname, '../screenshots');

  const ffprobe = await promisify(ffmpeg.ffprobe);
  const metadata = (await ffprobe(m3u8)) as ffmpeg.FfprobeData;
  const duration = Math.floor(metadata.format.duration);
  // const duration = 4574;
  const interval = Math.floor(duration / totalScreenshots);

  // const start = performance.now();
  // const end = performance.now();
  // console.log(end - start, duration);

  let promises = [];

  for (let index = 0; index < totalScreenshots; index++) {
    const timestamp = index === 0 ? 1 : index * interval;

    const promise = new Promise((resolve, reject) => {
      const start = performance.now();
      ffmpeg(m3u8)
        .seekInput(`${secondsToFormatedDuration(timestamp)}.000`)
        .addOutput(pathResolve(screenshotsDir, `screenshot-${index + 1}.jpg`))
        .outputOptions('-frames', '1')
        .on('end', () => {
          console.log(`[${index + 1}] Screenshot taken`);
          const end = performance.now();
          console.log(`[${index + 1}] duration: ${end - start}`);
          console.log(`----------------------------------------`);
          resolve(true);
        })
        .on('error', (err) => {
          console.error(`[${index + 1}] Error`);
          reject(err);
        })
        .run();
    });

    promises.push(promise);
  }

  return Promise.resolve(true);
  // return Promise.all(promises);
};

// Declare a route
server.get('/', async function (request, reply) {
  console.log('GET /');
  await generateScreenshots(
    'https://d1pd0pmhst5qqh.cloudfront.net/23c4edf4-8993-4185-afa6-b4487bf74f0d/137ad7f9-0b49-422b-a233-5a17ffa2b9bb/master/playlist.m3u8'
  );
  reply.send({ hello: 'hore' });
});

// Run the server!
server.listen({ host: '0.0.0.0', port: 3000 }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  console.log(`------\nServer listening on: ${address}\n------`);

  // Server is now listening on ${address}
});
