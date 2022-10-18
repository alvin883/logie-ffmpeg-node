import ffmpeg from 'fluent-ffmpeg';
import { fastify } from 'fastify';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify();

const generateScreenshots = async (
  m3u8: string,
  totalScreenshots: number = 10
) => {
  const screenshotsDir = pathResolve(__dirname, '../screenshots');

  return new Promise((resolve, reject) => {
    const start = performance.now();
    ffmpeg(pathResolve(__dirname, '../VID_20220420_183943.mp4'))
      .screenshots({
        count: 10,
        folder: screenshotsDir,
        fastSeek: true,
      })
      .on('end', () => {
        console.log(`Screenshot taken`);
        const end = performance.now();
        console.log(`duration: ${end - start}`);
        console.log(`----------------------------------------`);
        resolve(true);
      });
  });
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
