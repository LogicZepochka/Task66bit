const connection = new signalR.HubConnectionBuilder()
    .withUrl("/FPlayersHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start().then(function () {
            connection.invoke("AddUserToListGroup");
            LoadPlayers(page, minPlayers);
        });
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    };
};
connection.onclose(start);

start();

connection.on("updatePlayer", (id, firstName, secondName, sex, birthDate, teamName, country) => {
    var tableData = $("#playersData");
    editRow = $("tr").find(`[data-plid=` + id + `]`).parent().parent();
    console.log(editRow);
    var cells = editRow.find("td");
    console.log(cells);
    cells[0].innerText = (firstName + " " + secondName);
    cells[1].innerText = (sex);
    cells[2].innerText = (birthDate);
    cells[3].innerText = (country);
    cells[4].innerText = (teamName);
    editRow.animate({ backgroundColor: "rgb( 50, 50, 50 )" }, 0).animate({ backgroundColor: "rgb( 255, 255, 255 )" }, 1000);
});

connection.on("lockPlayer", (id, lock) => {
    var tableData = $("#playersData");
    if (lock) {
        editRow = $("tr").find(`[data-plid=` + id + `]`).prop("disabled", true).parent().parent();
        console.log(editRow);
        editRow.animate({ backgroundColor: "rgb( 90, 90, 90 )" }, 1000);
    }
    else {
        editRow = $("tr").find(`[data-plid=` + id + `]`).prop("disabled", false).parent().parent();
        console.log(editRow);
        editRow.animate({ backgroundColor: "rgb( 50, 50, 50 )" }, 0).animate({ backgroundColor: "rgb( 255, 255, 255 )" }, 1000);
    }
});

connection.on("reciveLockedPlayers", (ids) => {
    var tableData = $("#playersData");
    console.log("Recived locked players: ");
    console.log(ids);
    for (var i = 0; i < ids.length; i++) {
        if ($("tr").find(`[data-plid="` + ids[i]["Value"]+ `"]`).length > 0) {
            editRow = $("tr").find(`[data-plid="` + ids[i]["Value"] + `"]`).prop("disabled", true).parent().parent();
            editRow.animate({ backgroundColor: "rgb( 90, 90, 90 )" }, 1000);
        }
    }
});

connection.on("showNewPlayer", (id, firstName, secondName, sex, birthDate, teamName, country) => {
    var tableData = $("#playersData");
    var slicedDate = birthDate.split("-");
    console.log(slicedDate);
    var parsedDate = slicedDate[2] + "." + (slicedDate[1]) + "." + (slicedDate[0]);
    console.log(parsedDate);
    var elementStr = "<tr data-plid=" + id + ">\n\
            <td>"+ firstName + " " + secondName + " </td >\n\
            <td>"+ sex + "</td>\n\
            <td>"+ parsedDate + "</td>\n\
            <td>"+ country + "</td>\n\
            <td>"+ teamName + "</td>\n\
            <td><button id='edit' class='btn btn-info' data-toggle='modal' data-target='#editModal' data-plid="+ id + ">Изменить</button></td>\n\
        </tr >";
    $(elementStr).prependTo(tableData).animate({ backgroundColor: "rgb( 50, 50, 50 )" }, 0).animate({ backgroundColor: "rgb( 255, 255, 255 )" }, 300);
});