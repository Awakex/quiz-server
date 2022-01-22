const history = [];
let onlineUsers = [];

let counter = 0;

module.exports = (io, socket) => {
    let userId = socket?.handshake?.query?.userId;
    if (!userId) {
        socket.disconnect();
        return;
    }

    const sendHistory = () => {
        socket.emit("history", { history });
    };

    const setUserOnline = () => {
        let userIndex = onlineUsers.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
            onlineUsers.push({ id: userId });
        }
        console.log("online", counter++);
        io.sockets.emit("update:usersOnline", onlineUsers.length);
    };

    const setUserOffline = () => {
        console.log("offline", counter++);
        onlineUsers = onlineUsers.filter((user) => user.id !== userId);
        io.sockets.emit("update:usersOnline", onlineUsers.length);
    };

    setUserOnline();
    socket.on("get:history", sendHistory);
    socket.on("disconnect", setUserOffline);
};
