import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "https";
import fs from "fs";
import path from "path";

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;
  private data: Map<string, any>;
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
    this.data = new Map();
  }

  private handleRoutes(): void {
    this.app.get("/test", (req, res) => {
      res.send(`<h1>Hello World</h1>`);
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      let enteredKey: string
      let isFirstConnected = false

      socket.on("disconnect", () => {
        const data = this.data.get(enteredKey);
        if(isFirstConnected) {
          if(data?.isSecondConnected) {
            this.data.delete(enteredKey)
            socket.broadcast.emit("reconnect");
          } else {
            this.data.delete(enteredKey)
          }
        } else {
          if(data?.isSecondConnected) {
            this.data.delete(enteredKey)
            socket.broadcast.emit("reconnect");
          } else {
            this.data.delete(enteredKey)
          }
        }
      });

      socket.on("get-offer-by-key", ({chatKey}: {chatKey: string}) => {
        const data = this.data.get(chatKey)
        enteredKey = chatKey
        if (data) {
          socket.emit("offer-by-key-answer", {
            chatKey,
            offer: data.offer,
            offerIceCandidates: data.offerIceCandidates,
          });
        } else {
          socket.emit("offer-by-key-answer", {chatKey});
        }
      });

      socket.on("sent-offer-to-server", ({
        chatKey,
        offer,
        offerIceCandidates
      }: {
        chatKey: string,
        offer: any,
        offerIceCandidates: any,
      }) => {
        isFirstConnected = true
        this.data.set(chatKey, {
          offer,
          offerIceCandidates,
          isFirstConnected,
        })
      });

      socket.on("sent-answer-to-server", ({
        chatKey,
        answer,
        answerIceCandidates,
      }: {
        chatKey: string,
        answer: any,
        answerIceCandidates: any,
      }) => {
        const data = this.data.get(chatKey)
        isFirstConnected = false
        this.data.set(chatKey, {
          ...data,
          answer,
          answerIceCandidates,
          isSecondConnected: !isFirstConnected,
        })
        socket.broadcast.emit("sent-answer-to-initiator", {answer, answerIceCandidates});
      });
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
