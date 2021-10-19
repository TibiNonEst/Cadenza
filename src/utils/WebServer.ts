import express from 'express';
import http from 'http';

export default class WebServer {
  app: express.Express;
  server: http.Server;

  constructor() {
    this.app = express();
    this.server = new http.Server(this.app);

    this.app.use((req, res) => res.send('foo'));

    const port = process.env.PORT || 3000;
    this.server.listen(port, () => console.log('HTTP server running on port', port));
  }
}
