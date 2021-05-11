$(document).ready(function () {
    $('#teamMessage').hide();

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

    function AddNewUser() {

    };

    $("#teamInput").autocomplete({
        source: function (request, response) {
            console.log(request);
            
            $.ajax({
                url: "/FootballPlayers/GetTeamName",
                type: "POST",
                dataType: "json",
                data: { Prefix: request.term },
                success: function (data) {
                    response(data);
                }
            })
            console.log(response);
        },
        response: function (event, ui) {
            var IsRegisteredString = false;
            for (let i = 0; i < ui.content.length; i++) { // выведет 0, затем 1, затем 2
                if ($("#teamInput").val() == ui.content[i]["label"]) {
                    IsRegisteredString = true;
                }
            }
            if (IsRegisteredString) {
                $('#teamMessage').slideUp(300);
            }
            else {
                $('#teamMessage').slideDown(300);
            }
        },
        select: function (event, ui) {
            $('#teamMessage').slideUp(300);
        }
    });

    $("#mainForm").submit(function (event) {
        event.preventDefault();
        if ($("#mainForm")[0].checkValidity() === false) {
            event.stopPropagation();
        } else {
            $.ajax({
                url: "/FootballPlayers/RegisterNewPlayer",
                type: "POST",
                dataType: "json",
                data: {
                    firstName: $("#firstNameInput").val(),
                    lastName: $("#lastNameInput").val(),
                    sex: $("#sexInput").val(),
                    birthDate: $("#birthDateInput").val(),
                    country: $("#countryInput").val(),
                    team: $("#teamInput").val()
                },
                success: function (data) {
                    $("#resultMessage").show();
                    if (data[0] == "OK") {
                        $("#resultMessage").removeClass();
                        $("#resultMessage").addClass("text-success");
                        $("#resultMessage").text("Футболист успешно добавлен!");
                        console.log([data[1],
                        $("#firstNameInput").val(),
                        $("#lastNameInput").val(),
                        $("#sexInput").val(),
                        $("#birthDateInput").val(),
                        $("#countryInput").val(),
                            $("#teamInput").val()]);
                        var d = $("#birthDateInput").val().split("-");
                        var parsed = d[2] + "." + d[1] + "." + d[0];
                        
                        connection.invoke("RegisterNewPlayer",
                            data[1],
                            $("#firstNameInput").val(),
                            $("#lastNameInput").val(),
                            $("#sexInput").val(),
                            parsed,
                            $("#countryInput").val(),
                            $("#teamInput").val());
                    }
                    else {
                        $("#resultMessage").removeClass();
                        $("#resultMessage").addClass("text-danger");
                        $("#resultMessage").text("Произошла ошибка при добавлении: " + data);
                    }
                }
            });
        }
        $("#mainForm").addClass('was-validated');
        
    });
})