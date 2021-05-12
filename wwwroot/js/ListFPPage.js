const minPlayers = 10;
var available = 100;
var page = 1;
var searchToggle = false;

$(document).ready(function () {
    $("#Next").on("click", () => ButtonNext());
    $("#Back").on("click", () => ButtonBack());
    $("#ExpandSearch").on("click", () => {
        searchToggle = !searchToggle;
        if (searchToggle) {
            $("#search").slideDown(300);
        }
        else {
            $("#search").slideUp(300);
        }
    });

    $("#resetSearch").on("click", () => {
        page = 1;
        LoadPlayers(page, minPlayers);
        $("#searchInput").val("");
        $("#resetSearch").hide();
    });

    $("#searchInput").on("change", () => {
        $("#resetSearch").show();
    });

    $("#teamInput").autocomplete({
        appendTo: "#modalBody",
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
            if (ui.content.length > 0) {
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

    $("#submitEntry").on("click", () => {
        $("#mainForm").submit();
    });

    $("#mainForm").submit(function (event) {
        event.preventDefault();
        if ($("#mainForm")[0].checkValidity() === false) {
            event.stopPropagation();
        } else {
            var token = $('[name=__RequestVerificationToken]').val();
            $.ajax({
                url: "/FootballPlayers/UpdatePlayer",
                type: "POST",
                dataType: "json",
                data: {
                    __RequestVerificationToken: token,
                    id: $("#changeId").val(),
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
                        $("#resultMessage").text("Футболист успешно измене!");
                        var d = $("#birthDateInput").val().split("-");
                        var parsed = d[2] + "." + d[1] + "." + d[0];
                        $("#editModal").modal("hide");
                        connection.invoke("UpdatePlayer",
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

    $("#searchForm").submit(function (event) {
        event.preventDefault();
        if ($("#searchForm")[0].checkValidity() === false) {
            event.stopPropagation();
        } else {
            $("#back").prop('disabled', true);
            $("#next").prop('disabled', true);
            $("#playersData").empty();
            $("#loading").show();
            var token = $('[name=__RequestVerificationToken]').val();
            $.ajax({
                url: "/FootballPlayers/RequestPlayerByPartOfNameOrTeam",
                type: "POST",
                async: true,
                dataType: "json",
                data: {
                    __RequestVerificationToken: token,
                    searchText: $("#searchInput").val()
                },
                error: function (request, error) {
                    alert(" Can't do because: " + error);
                },
                success: function (data) {
                    $("#loading").hide();
                    ParseRecivedDataToTable(data);
                },
                fail: function () {
                    $("#loading").hide();
                    console.log("FAILD TO LOAD BL");
                }
            });
        }
    });

    $("#editModal").on("hide.bs.modal", () => {
        connection.invoke("UnlockPlayerForEdit", $("#changeId").val());
    });

    $("table").on("click", "#edit", function () {
        var data = $(this).data();
        $("#changeId").val(data["plid"]);
        connection.invoke("LockPlayerForEdit", $("#changeId").val());
        var tableRow = $(this).parent().parent();
        var cells = tableRow.find("td");
        $("#firstNameInput").val(cells[0].textContent.split(" ")[0]);
        $("#lastNameInput").val(cells[0].textContent.split(" ")[1]);
        $("#lastNameInput").val(cells[0].textContent.split(" ")[1]);
        $("#sexInput").val(cells[1].textContent);

        var slicedDate = cells[2].textContent.split(".");
        var parsedDate = slicedDate[2] + "-" + (slicedDate[1]) + "-" + (slicedDate[0]);

        $("#birthDateInput").val(parsedDate);
        $("#sexInput").val((cells[1].textContent == "Мужчина") ? 0 : 1);

        $("#countryInput").val(cells[4].textContent);
        $("#teamInput").val(cells[3].textContent);
    });

});
function LoadPlayers(page, minPlayers) {
        $("#back").prop('disabled', true);
        $("#next").prop('disabled', true);
        $("#playersData").empty();
        $("#loading").show();
        var token = $('[name=__RequestVerificationToken]').val();
        $.ajax({
            url: "/FootballPlayers/RequestPlayersPage",
            type: "POST",
            async: true,
            dataType: "json",
            data: {
                __RequestVerificationToken: token,
                page: page,
                min: minPlayers
            },
            error: function (request, error) {
                alert(" Can't do because: " + error);
            },
            success: function (data) {
                $("#loading").hide();
                $("#Back").prop('disabled',false);
                $("#Next").prop('disabled',false);
                ParseRecivedDataToTable(data);
            },
            fail: function () {
                $("#loading").hide();
            }
        });
    }

function ParseRecivedDataToTable(data) {
    var available = data["Available"];
    var result = data["Result"];
    for (var i = 0; i < result.length; i++) {

        var elementStr = "<tr data-plid=" + result[i]["id"] + ">\n\
            <td>"+ result[i]["firstName"] + " " + result[i]["lastName"] + " </td >\n\
            <td>"+ (result[i]["isMale"] ? "Мужчина" : "Женщина") + "</td>\n\
            <td>"+ new Date(result[i]["birthDate"]).toLocaleDateString() + "</td>\n\
            <td>"+ result[i]["team"]["name"] + "</td>\n\
            <td>"+ result[i]["country"]["name"] + "</td>\n\
            <td><button id='edit' class='btn btn-info' data-toggle='modal' data-target='#editModal' data-plid="+ result[i]["id"] + ">Изменить</button></td>\n\
        </tr >";
        var tableData = $("#playersData");
        $(elementStr).appendTo(tableData);
    }
    if (page == 1) {
        $("#Back").prop('disabled', true);
    }
    if ((page+1) * minPlayers >= available) {
        $("#Next").prop('disabled', true);
    }
    connection.invoke("RequestLockedPlayer");
}

function ButtonNext() {
    
    page++;
    LoadPlayers(page, minPlayers);
}

function ButtonBack() {
    page--;
    LoadPlayers(page, minPlayers);
}