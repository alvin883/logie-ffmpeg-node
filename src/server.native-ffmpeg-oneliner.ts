import ffmpeg from 'fluent-ffmpeg';
import { fastify } from 'fastify';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify();

const generateScreenshots = async (
  m3u8a: string,
  totalScreenshots: number = 9
) => {
  const m3u8 = pathResolve(__dirname, '../VID_20220420_220616.mp4');
  const screenshotsDir = pathResolve(__dirname, '../screenshots');
  const ffprobe = await promisify(ffmpeg.ffprobe);
  const metadata = (await ffprobe(m3u8)) as ffmpeg.FfprobeData;
  const duration = Math.floor(metadata.format.duration);
  const interval = Math.floor(duration / totalScreenshots);

  return new Promise((resolve, reject) => {
    const start = performance.now();
    ffmpeg(m3u8)
      .addOutput(pathResolve(screenshotsDir, `inline-in-%d.jpg`), {
        end: true,
      })

      // Where did I know all of this args? no that's not me, it's taken from
      // here: https://stackoverflow.com/a/24563686/6049731
      .outputOptions(
        '-vf',
        `fps=1/${interval}`,
        '-vframes',
        '10',
        '-qscale:v',
        '2'
      )

      .on('end', () => {
        console.log(`Screenshot taken`);
        const end = performance.now();
        console.log(`duration: ${end - start}`);
        console.log(`----------------------------------------`);
        resolve(true);
      })
      .on('error', (err) => {
        console.error(`Error`);
        reject(err);
      })
      .run();
  });
};

// Declare a route
server.get('/', async function (request, reply) {
  console.log('GET /');
  const start = performance.now();
  await generateScreenshots(
    'https://d1pd0pmhst5qqh.cloudfront.net/23c4edf4-8993-4185-afa6-b4487bf74f0d/137ad7f9-0b49-422b-a233-5a17ffa2b9bb/master/playlist.m3u8'
  );
  const end = performance.now();
  console.log(`TOTAL DURATION: ${end - start}`);
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
