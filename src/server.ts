import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "https";
import fs from "fs";
import path from "path";

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private readonly HTTPS_PORT = 443;

  constructor() {
    this.initialize();

    this.configureApp();
    this.handleRoutes();
    this.handleSocketConnection();
  }

  private initialize(): void {
    this.app = express();

    const privateKey = fs.readFileSync("./localhost-key.pem", "utf8");
    const certificate = fs.readFileSync("./localhost.pem", "utf8");
    const credentials = { key: privateKey, cert: certificate };

    this.httpServer = createServer(credentials, this.app);
    this.io = new SocketIOServer(this.httpServer);
  }

  private handleRoutes(): void {
    this.app.get("/test", (req, res) => {
      res.send(`<h1>Hello World</h1>`);
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      socket.on("disconnect", () => {});
    });
  }

  public listen(callback: (port: string) => void): void {
    this.httpServer.listen(this.HTTPS_PORT, () =>
        callback(this.HTTPS_PORT.toString())
    );
  }

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }
}
