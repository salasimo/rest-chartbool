$(document).ready(function() {
    $.ajax({
        url: "http://157.230.17.132:4032/sales",
        method: "GET",
        success: function(data) {
            calcValues(data);

        },
        error: function(err) {
            alert("Errore AJAX");
        }

    });

    $("#aggiungi-fatturato").click(function(){
        var venditore = $(".box-aggiunta-dati .select-venditore").val();
        var fatturato = parseInt($(".box-aggiunta-dati .input-fatt").val());
        var periodo = moment($(".box-aggiunta-dati .input-data").val()).format("DD/MM/YYYY");


        $.ajax({
            url: "http://157.230.17.132:4032/sales",
            method: "POST",
            data:{
                salesman: venditore,
                amount: fatturato,
                date: periodo
            },
            success: function(data) {
            },
            error: function(err){
                alert("Errore aggiornamento dati")
            }
        });

        $.ajax({
            url: "http://157.230.17.132:4032/sales",
            method: "GET",
            success: function(data) {
                calcValues(data);

            },
            error: function(err) {
                alert("Errore AJAX");
            }

        });

    });



    // --------------- FUNCTIONS ---------------------

    function sortNumber(a, b) { // ordine discendente
        return b - a;
    };

    function calcValues(data){
        var datiOrganizzati = {}; // Torta
        var datiMensili = {};     // Linea
        for (var i = 0; i < data.length; i++) {
            var dato = data[i];
            var venditore = dato.salesman;
            var id = dato.id;
            var calendarioFornito = dato.date;
            var quantitativo = parseInt(dato.amount);
            var calendario = moment(calendarioFornito, "DD-MM-YYY");
            var mese = calendario.format("M");
            var arrayMesi = moment.months("MMMM");


            if (datiOrganizzati[venditore] === undefined) { //Torta
                datiOrganizzati[venditore] = 0;
            }
            datiOrganizzati[venditore] += quantitativo;

            if (datiMensili[mese] === undefined) { //Linea
                datiMensili[mese] = 0;
            }
            datiMensili[mese] += quantitativo;


        }

        var labels = [];// Torta
        var values = [];
        for (var key in datiOrganizzati) {
            labels.push(key);
            values.push(datiOrganizzati[key]);
        }
        values.sort(sortNumber);


        var labelsMesi = [];//Linea
        var valuesMesi = [];
        for (var key in datiMensili) {
            labelsMesi.push(key);
            valuesMesi.push(datiMensili[key]);
        }

        var ctx = $('#grafico-torta');
        var chart = new Chart(ctx, {

            type: 'pie',
            data: {
                datasets: [{
                    data: values,
                    backgroundColor: ["#5603ad", "#9567c6", "#ccb2e8", "#f7efff"]
                }],

                labels: labels
            }
        });

        var ctx = $('#grafico-mensile');
        var chart = new Chart(ctx, {

            type: 'line',
            data: {
                labels: arrayMesi,
                datasets: [{
                    label: 'Fatturato mensile',
                    borderColor: '#5603ad',
                    backgroundColor: '#f7efff90',
                    data: valuesMesi
                }]
            },
        });
    };




}); // fine document ready
