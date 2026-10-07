const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'dist');
const port = Number(process.env.PORT || 8080);

const build = spawnSync(process.execPath, [path.join(__dirname, 'build.js')], {
  stdio: 'inherit'
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

http.createServer((request, response) => {
  const requestPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
  const filePath = path.resolve(outputDir, relativePath);

  if (!filePath.startsWith(outputDir + path.sep) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream'
  });
  fs.createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`Previewing http://localhost:${port}`);
});
