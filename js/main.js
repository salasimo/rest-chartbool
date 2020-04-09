$(document).ready(function() {

    var baseUrl = "http://157.230.17.132:4032/sales";
    /* Milestone 1:
    Andamento vendite mensili azienda con grafiico line;
    fatturato annuo singolo venditore con grafico a torta e percentuale.
    */
    stampaGrafici();
    /* Milestone 2:
    Crearare possibilità di inserire nuovo fatturato per venditore, importo data,
    e aggiornare i grafici di conseguenza.
    */
    aggiungiFatturato();


    // ----------------- FUNZIONI ---------------

    function stampaGrafici(){
        $(".charts").empty(); // questo .empty e .append è fdatto per problema di aggioramento grafici di ChartJS
        $(".charts").append('<canvas id="line-chart"></canvas><canvas id="pie-chart"></canvas>');
        $.ajax ({
            url: baseUrl,
            method: "GET",
            success: function (data) {
                //console.log(data)
                //Elaboro i dati ricevuti dal server per farne due array
                //Dò in pasto a ChartJS i due array
                var datiMensili = costruttoreDatiMensili(data); // elaboriamo i dati di GET per renderli digeribili da ChartJS (ritorna un oggetto)
                createLineChart(datiMensili.mese, datiMensili.vendita); //Diamo in pasto a ChartJS le labels e data ricavati
                var fatturato = fatturatoTotale(data);
                var datiVenditori = costruttoreDatiVenditori(data, fatturato);
                createPieChart(datiVenditori.venditori, datiVenditori.vendite);

            },
            error: function (err) {
                alert("Errore API: " + err);
            }
        });
    }

    function aggiungiFatturato(){
        $("#btn-invia").click(function (){
            var nomeVenditore = $("#sel-venditore").val();
            var dataVendita = moment($("#input-data").val(), "YYYY-MM-DD").format("DD/MM/YYYY");
            var vendita = $("#input-vendita").val();

            $.ajax({
                url: baseUrl,
                method: "POST",
                data: {
                    salesman: nomeVenditore,
                    amount: vendita,
                    date: dataVendita
                },
                success: function (data){
                    stampaGrafici();
                },
                error: function (err){
                    alert("Errore aggiornamento dati: " + err);
                }
            });
        });
    }

    function sortNumber(a, b) { // ordine discendente
        return b - a;
    };

    function costruttoreDatiMensili(vendite) {
        var venditeMensili = {
            gennaio: 0,
            febbraio: 0,
            marzo: 0,
            aprile: 0,
            maggio: 0,
            giugno: 0,
            luglio: 0,
            agosto: 0,
            settembre: 0,
            ottobre: 0,
            novembre: 0,
            dicembre: 0,
        };
        // var arrayMonths = moment.months(); //---> array dei mesi ottenuto con MomentJS
        for (var i = 0; i < vendite.length; i++) { // Ciclo nelle vendite ricevute dal GET per aggiungere .amount all'oggetto venditeMensili
            var vendita = vendite[i]; //valuto ogni singola vendita
            var dataVendita  = vendita.date; // estrapolo data da oggetto vendita come "DD/MM/YYYY"
            var meseVendita = moment(dataVendita, "DD/MM/YYYY").format("MMMM"); //trasformo la data nel relativo nome mese, es. "gennaio"
            venditeMensili[meseVendita] += parseInt(vendita.amount); //uso il nome del mese per riconoscere la chiave nell'oggetto venditeMensili e aggiungere l'amount a quel mese

        }
        var arrayMesi = []; //inizializzo i due array da usare in ChartJS
        var arrayVendite = [];
        for (var nomeMese in venditeMensili) { //Ciclo in oggetto venditeMensili per inserire la coppia key-value in due array, uno con chiave e uno con valore
            arrayMesi.push(nomeMese); // inserisco il nome del mese nell'array
            arrayVendite.push(venditeMensili[nomeMese]); // inserisco in arrayVendite la somma delle vendite del mese
        }
        //console.log(arrayMesi, arrayVendite)
        return {
            mese: arrayMesi,
            vendita: arrayVendite
        };
    }

    function fatturatoTotale(vendite){
        var fatturato = 0;
        for (var i = 0; i < vendite.length; i++) {
            var vendita = vendite[i];
            fatturato += parseInt(vendita.amount);
        }
        return fatturato;
    }

    function costruttoreDatiVenditori(vendite, fatturatoAziendale){
        var venditeVenditori = {}; //creazione oggetto vuoto che assumerà la somma delle vendite annuali di ogni singolo venditore
        for (var i = 0; i < vendite.length; i++) { //ciclo for nell'arrey della GET
            var vendita = vendite[i]; //considero il singolo oggetto dell'array
            var nomeVenditore = vendita.salesman; //associo a una var il nome del venditore
            if (venditeVenditori[nomeVenditore] === undefined) { //se non esiste una chiave con quel nome del venditore, la inizializzo con valore 0
                venditeVenditori[nomeVenditore] = 0;
            }
            venditeVenditori[nomeVenditore] += parseInt(vendita.amount); // sommo la vendita dell'oggetto i-esimo a quel venditore
        }
        var arrayVenditori = []; //inizializzo i due array da usare in ChartJS
        var arrayVendite = [];
        for (var nomeVenditore in venditeVenditori) { //idem come per l'altro grafico
            arrayVenditori.push(nomeVenditore);
            var fatturatoPercentualeVenditore = ((venditeVenditori[nomeVenditore] / fatturatoAziendale) * 100).toFixed(2);
            arrayVendite.push(fatturatoPercentualeVenditore);
            arrayVendite.sort(sortNumber);
        }
        return {
            venditori: arrayVenditori,
            vendite: arrayVendite
        }
    }

    function createLineChart(labels, data){
        var ctx = $('#line-chart');
        var chart = new Chart(ctx, {

            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Fatturato 2017",
                    borderColor: '#5603ad',
                    backgroundColor: '#f7efff90',
                    lineTension: "0",
                    data: data
                }]
            },
        });
    }

    function createPieChart(arrayLabels, arrayData){
        var ctx = $('#pie-chart');
        var chart = new Chart(ctx, {

            type: 'pie',
            data: {
                datasets: [{
                    data: arrayData,
                    backgroundColor: ["#5603ad", "#9567c6", "#ccb2e8", "#f7efff"],

                }],

                labels: arrayLabels
            }
        });


    }
















}); // fine document ready
