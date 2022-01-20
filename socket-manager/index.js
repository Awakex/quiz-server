const history = [];
let onlineUsers = [];

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

        io.sockets.emit("update:usersOnline", onlineUsers.length);
    };

    const setUserOffline = () => {
        onlineUsers = onlineUsers.filter((user) => user.id !== userId);
        io.sockets.emit("update:usersOnline", onlineUsers.length);
    };

    setUserOnline();
    socket.on("get:history", sendHistory);
    socket.on("disconnect", setUserOffline);
};
