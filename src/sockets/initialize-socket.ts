import { JwtPayload, verify } from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import http from "node:http";
import { Server } from "socket.io";

import { environment } from "../config";

export default function initializeSocket(server: http.Server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const userRole = socket.handshake.auth.role;
    try {
      if (!token) return next(new Error("Token is invalid"));
      const decodedToken = verify(
        token,
        environment.jwtSecret,
      ) as JwtPayload & { id: string };

      if (!isValidObjectId(decodedToken.id))
        return next(new Error("Token is invalid"));

      if (!["admin", "user"].includes(userRole))
        return next(new Error("Role are invalid"));

      next();
    } catch {
      return next(new Error("Token is invalid"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {});
  });

  return io;
}
