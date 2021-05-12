const connection = new signalR.HubConnectionBuilder()
    .withUrl("/FPlayersHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start().then(function () {
            connection.invoke("AddUserToEditGroup");
        });
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    };
};
connection.onclose(start);

start();