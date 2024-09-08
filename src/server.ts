import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer as createHttpsServer, Server as HTTPSServer } from "https";
import { createServer as createHttpServer, Server as HTTPServer } from "http";
import fs from "fs";
import path from "path";

const IS_HTTPS_SERVER = false

export class Server {
  private server: HTTPSServer | HTTPServer;
  private app: Application;
  private io: SocketIOServer;
  private data: Map<string, any>;
  private readonly PORT = IS_HTTPS_SERVER ? 443 : 3000;

  constructor() {
    this.initialize();

    this.configureApp();
    this.handleRoutes();
    this.handleSocketConnection();
  }

  private initialize(): void {
    this.app = express();

    if (IS_HTTPS_SERVER) {
      const privateKey = fs.readFileSync("./3.70.45.17-key.pem", "utf8");
      const certificate = fs.readFileSync("./3.70.45.17.pem", "utf8");
      const credentials = { key: privateKey, cert: certificate };

      this.server = createHttpsServer(credentials, this.app);
    } else {
      console.log('createHttpServer(this.app)')
      this.server = createHttpServer(this.app);
    }
    this.io = new SocketIOServer(this.server);
    this.data = new Map();
  }

  private handleRoutes(): void {
    this.app.get("/test", (req, res) => {
      res.send(`<h1>Hello World</h1>`);
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      let enteredKey: string;

      socket.on("disconnect", () => {
        const data = this.data.get(enteredKey);
        this.data.delete(enteredKey);
        data?.firstConnectedSocket?.emit("reconnect");
        data?.secondConnectedSocket?.emit("reconnect");
      });

      socket.on("get-offer-by-key", ({ chatKey }: { chatKey: string }) => {
        const data = this.data.get(chatKey);

        if (data?.firstConnectedSocket && data?.secondConnectedSocket) {
          socket.emit("chat-with-chosen-key-exist");
          return;
        }

        enteredKey = chatKey;
        if (data) {
          socket.emit("offer-by-key-answer", {
            chatKey,
            offer: data.offer,
            offerIceCandidates: data.offerIceCandidates,
          });
        } else {
          socket.emit("offer-by-key-answer", { chatKey });
        }
      });

      socket.on("sent-offer-to-server", ({
        chatKey,
        offer,
        offerIceCandidates,
      }: {
        chatKey: string;
        offer: any;
        offerIceCandidates: any;
      }) => {
        this.data.set(chatKey, {
          offer,
          offerIceCandidates,
          firstConnectedSocket: socket,
        });
      });

      socket.on("sent-answer-to-server", ({
        chatKey,
        answer,
        answerIceCandidates,
      }: {
        chatKey: string;
        answer: any;
        answerIceCandidates: any;
      }) => {
        const data = this.data.get(chatKey);
        this.data.set(chatKey, {
          ...data,
          answer,
          answerIceCandidates,
          secondConnectedSocket: socket,
        });
        data?.firstConnectedSocket?.emit("sent-answer-to-initiator", {
          answer,
          answerIceCandidates,
        });
      });
    });
  }

  public listen(callback: (port: string) => void): void {
    this.server.listen(this.PORT, () =>
        callback(this.PORT.toString())
    );
  }

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }
}
