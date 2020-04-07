$(document).ready(function() {

    $.ajax({
        url: "http://157.230.17.132:4032/sales",
        method: "GET",
        success: function(data) {
            var datiOrganizzati = {};
            for (var i = 0; i < data.length; i++) {
                var dato = data[i];
                var venditore = dato.salesman;
                var id = dato.id;
                var calendario = dato.date;
                var quantitativo = dato.amount;

                if (datiOrganizzati[venditore] === undefined) {
                    datiOrganizzati[venditore] = 0;
                }
                datiOrganizzati[venditore] += quantitativo;

            }
            var labels = [];
            var values = [];


            for (var key in datiOrganizzati) {
                labels.push(key);
                values.push(datiOrganizzati[key]);
            }

            values.sort(sortNumber);
            console.log(values);

            var ctx = $('#grafico');
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

        },
        error: function(err) {
            alert("Errore AJAX");
        }

    });









    // ----------- FUNCTIONS -----------------------

    function sortNumber(a, b) {
        return b - a;
    }




}); // fine document ready
