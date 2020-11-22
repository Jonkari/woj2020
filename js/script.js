const { update } = require("../customerController");

$(document).ready(function () {

    var $valinnat = $("select");
    $("#asty").append("<option> </option>");
    var asty_avain = asty_avain;
    var selite = selite;
    $.get({
        url: ("http://127.0.0.1:3002/Types"),
        data: {
            AVAIN: asty_avain,
            SELITE: selite
        },
        success: function (valinnat) {
            $.each(valinnat, function (i, av) {
                $valinnat.append("<option>" + av.AVAIN + " - " + av.SELITE + "</option>");
            })
        }
    });

    function fetch() {
        $("table td").remove();
        var $lista = $("table");
        var nimi = $("#nimiIn").val();
        var osoite = $("#osoiteIn").val();
        var asTyyp = $("select").val().substring(0, 1);
        var avain = avain;
        var postnum = postnum;
        var posttoim = posttoim;

        
        if ($("#nimiIn").val() == "" && $("#osoiteIn").val() == "" && $("select").val() == " ") {
            $.get({
                url: ("http://127.0.0.1:3002/Asiakas"),
                data: {
                    AVAIN: avain,
                    NIMI: nimi,
                    OSOITE: osoite,
                    POSTINRO: postnum,
                    POSTITMP: posttoim,
                    ASTY_AVAIN: asTyyp
                },
                success: function (lista) {
                    $.each(lista, function (i, hlo) {
                        $lista.append("<tr> <td>" + hlo.AVAIN + "<td>"
                            + hlo.NIMI + "<td>" + hlo.OSOITE + "<td>"
                            + hlo.POSTINRO + "<td>" + hlo.POSTITMP + "<td>"
                            + hlo.ASTY_AVAIN + `<td><button onclick="poista(${hlo.AVAIN});" id="poista">Poista</button></td>`
                            + `<td><button onclick="muokkaa(${hlo.AVAIN});" id="muokkaabtn">Muokkaa</button></td>` + "</tr>");
                    });
                },
                error: function () {
                    alert("Haku epäonnistui!");
                }
            })
        }
        else {
            $.get({
                url: ("http://127.0.0.1:3002/Haku"),
                data: {
                    AVAIN: avain,
                    NIMI: nimi,
                    OSOITE: osoite,
                    POSTINRO: postnum,
                    POSTITMP: posttoim,
                    ASTY_AVAIN: asTyyp
                },
                success: function (lista) {
                    $.each(lista, function (i, hlo) {
                        $lista.append("<tr> <td>" + hlo.AVAIN + "<td>"
                            + hlo.NIMI + "<td>" + hlo.OSOITE + "<td>"
                            + hlo.POSTINRO + "<td>" + hlo.POSTITMP + "<td>"
                            + hlo.ASTY_AVAIN + `<td><button onclick="poista(${hlo.AVAIN});" id="poista">Poista</button></td>`
                            + `<td><button onclick="muokkaa(${hlo.AVAIN});" id="muokkaabtn">Muokkaa</button></td>` + "</tr>");
                    })
                },
                error: function () {
                    alert("Haku epäonnistui!");
                }
            });
        }
    }

    poista = (key) => {
        if (isNaN(key)) {
            return;
        }

        $.ajax({
            type: "DELETE",
            url: 'http://127.0.0.1:3002/Asiakas/:id',
            data: { AVAIN: key },
            success: (result) => {
                fetch();
                alert("Tiedot poistettu onnistuneesti!");
            },
            error: (result) => {
                alert("Poisto epäonnistui!");
            }
        });
    }

    muokkaa = (key) => {
        var $formi = $("#muokkaaAsiakas");
        var nimi = nimi;
        var osoite = osoite;
        var postinro = postinro;
        var postitmp = postitmp;
        var asty_avain = asty_avain;

        if (isNaN(key)) {
            return;
        }
        $.get({
            url: 'http://127.0.0.1:3002/Asiakas/:id',
            data: {
                AVAIN: key,
                NIMI: nimi,
                OSOITE: osoite,
                POSTINRO: postinro,
                POSTITMP: postitmp,
                ASTY_AVAIN: asty_avain
            },
            success: (formi) => {
                
                $("#muokkaatiedot").dialog("open");
                $.each($formi, function (i, hlo) {
                        $formi.append("Nimi:<input id='nimiMuokkaa' value="+ hlo.NIMI +">"
                            + "<br>Osoite:<input id='osoiteMuokkaa' value="+ hlo.OSOITE +">"
                            + "<br>Postinumero:<input id='postinroMuokkaa' value="+ hlo.POSTINRO +">"                                    
                            + "<br>Postitoimipaikka:<input id='postToimMuokkaa' value=" + hlo.POSTITMP + ">"
                            + "<br>Asiakastyyppi:<input id='astyMuokkaa' value=" + hlo.ASTY_AVAIN + ">");
                    })
                
            },
            error: (result) => {
                alert("Haku epäonnistui");
            }
        });

    }
    $("#muokkaatiedot").dialog({
        autoOpen: false,
        modal: true,
        width: 450,
        buttons: {
            "Tallenna": function (key) {
                var asty = $("#astyMuokkaa").val().substring(0, 1);
                asty = parseInt(asty);
                $.ajax({
                    type: "PUT",
                    url: 'http://127.0.0.1:3002/Asiakas/:id',
                    data: {
                        AVAIN: key,
                        NIMI: ($("#nimiMuokkaa").val()),
                        OSOITE: ($("#osoiteMuokkaa").val()),
                        POSTINRO: ($("#postnumMuokkaa").val()),
                        POSTITMP: ($("#postToimMuokkaa").val()),
                        ASTY_AVAIN: asty
                    },
                    success: function (data) {
                        $("#muokkaatiedot").dialog("close");
                        fetch();
                        alert("Tiedot päivitetty onnistuneesti!");
                    },
                    error: function () {
                        alert("Päivitys epäonnistui!");
                    }
                });
            },
            "Peruuta": function () {
                $("#muokkaatiedot").dialog("close");
            }
        }
    })

    $("#btnHae").click(function () {
        fetch();
    });

    $("#lisaa").dialog({
        autoOpen: false,
        modal: true,
        width: 450,
        buttons: {
            "Lisää asiakas": function () {
                if ($("#nimiLisaa").val() != "" || $("#osoiteLisaa").val() != "" ||
                    $("#postnumLisaa").val() != "" || $("#postToimLisaa").val() != "") {
                    var asty = $("#astyLisaa").val().substring(0, 1);
                    asty = parseInt(asty);
                    $.ajax({
                        type: "POST",
                        url: "http://127.0.0.1:3002/Asiakas",
                        data: {
                            NIMI: ($("#nimiLisaa").val()),
                            OSOITE: ($("#osoiteLisaa").val()),
                            POSTINRO: ($("#postnumLisaa").val()),
                            POSTITMP: ($("#postToimLisaa").val()),
                            ASTY_AVAIN: asty
                        },
                        success: function (data) {
                            $("#lisaa").dialog("close");
                            fetch();
                            alert("Tiedot lisätty onnistuneesti!");
                        },
                        error: function () {
                            alert("Tietojen lisääminen epäonnistui");
                        }
                    })

                }
                
                else {
                    alert("Älä jätä tyhjiä tekstikenttiä!");
                }
            },
            "Peruuta": function () {
                $("#lisaa").dialog("close");
            }
        }
    });

    $("#btnlisaa").click(function () {
        $("#lisaa").dialog("open");
    })
});