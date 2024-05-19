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

    setInterval(() => {
      console.log(this.data.size)
    }, 2000)
  }

  private handleRoutes(): void {
    this.app.get("/test", (req, res) => {
      res.send(`<h1>Hello World</h1>`);
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      let enteredKey: string
      socket.on("disconnect", (a, b) => {
        this.data.delete(enteredKey)
      });

      socket.on("get-offer-by-key", ({chatKey}: {chatKey: string}) => {
        const data = this.data.get(chatKey)
        if (data) {
          enteredKey = chatKey
          console.log('enteredKey', enteredKey)
          socket.emit("offer-by-key-answer", {
            chatKey,
            offer: data.initiator.offer,
            offerIceCandidates: data.initiator.offerIceCandidates,
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
        this.data.set(chatKey, {
          initiator: {offer, offerIceCandidates},
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
        this.data.set(chatKey, {...data, recipient: {answer, answerIceCandidates}})
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
