import { io, socketMap } from "./initialize-socket";

const clientSocket = {
  changeStatus: (clientId: string, active: boolean) => {
    if (!socketMap.has(`user:${clientId}`)) return;

    const clientSocket = socketMap.get(`user:${clientId}`)!;
    io.to(clientSocket).emit("client:status", { active });
  },
};

export default clientSocket;
