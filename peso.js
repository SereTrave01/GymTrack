/* =========================================================
   GYMTRACK
   PESO CORPOREO
   ========================================================= */


const weightForm =
    document.getElementById("weightForm");

const weightInput =
    document.getElementById("weight");

const dateInput =
    document.getElementById("weightDateInput");

const currentWeight =
    document.getElementById("currentWeight");

const weightDate =
    document.getElementById("weightDate");

const weightDifference =
    document.getElementById("weightDifference");

const totalEntries =
    document.getElementById("totalEntries");

const historyList =
    document.getElementById("historyList");



/* =========================================================
   DATA DI OGGI
   ========================================================= */

function setTodayDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;

}



/* =========================================================
   RECUPERA DATI
   ========================================================= */

function getWeights() {

    return JSON.parse(
        localStorage.getItem(
            "gymtrack_weights"
        )
    ) || [];

}



/* =========================================================
   SALVA DATI
   ========================================================= */

function saveWeights(weights) {

    localStorage.setItem(
        "gymtrack_weights",
        JSON.stringify(weights)
    );

}



/* =========================================================
   FORMATTA DATA
   ========================================================= */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "it-IT",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}



/* =========================================================
   AGGIORNA RIEPILOGO
   ========================================================= */

function updateOverview() {

    const weights =
        getWeights();


    totalEntries.textContent =
        weights.length;


    if (weights.length === 0) {

        currentWeight.textContent =
            "—";

        weightDate.textContent =
            "Nessuna registrazione";

        weightDifference.textContent =
            "—";

        return;

    }


    /*
       Ordina dal più recente
       al più vecchio
    */

    const sorted =
        [...weights].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    const latest =
        sorted[0];


    currentWeight.textContent =
        Number(latest.weight)
            .toFixed(1)
            .replace(".", ",");


    weightDate.textContent =
        formatDate(latest.date);


    /*
       Confronto con la registrazione
       precedente
    */

    if (sorted.length >= 2) {

        const previous =
            sorted[1];


        const difference =
            Number(latest.weight) -
            Number(previous.weight);


        const sign =
            difference > 0
                ? "+"
                : "";


        weightDifference.textContent =
            `${sign}${difference.toFixed(1).replace(".", ",")}`;

    } else {

        weightDifference.textContent =
            "—";

    }

}



/* =========================================================
   RENDER STORICO
   ========================================================= */

function renderHistory() {

    const weights =
        getWeights();


    if (weights.length === 0) {

        historyList.innerHTML = `

            <div class="empty-history">

                <i class="fa-solid fa-scale-balanced"></i>

                <h3>
                    Nessun peso registrato
                </h3>

                <p>
                    Inserisci il tuo primo peso
                    per iniziare a monitorare
                    i progressi.
                </p>

            </div>

        `;

        return;

    }


    const sorted =
        [...weights].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    historyList.innerHTML = "";


    sorted.forEach(
        (entry) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "history-row";


            row.innerHTML = `

                <div class="history-date">

                    <div class="history-icon">

                        <i class="fa-solid fa-weight-scale"></i>

                    </div>

                    <div>

                        <strong>
                            ${formatDate(entry.date)}
                        </strong>

                        <span>
                            Peso corporeo
                        </span>

                    </div>

                </div>


                <div class="history-weight">

                    <strong>
                        ${Number(entry.weight)
                            .toFixed(1)
                            .replace(".", ",")}
                        kg
                    </strong>

                    <button
                        class="delete-button"
                        data-id="${entry.id}"
                        aria-label="Elimina registrazione"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            `;


            historyList.appendChild(row);

        }
    );


    /*
       Pulsanti elimina
    */

    document
        .querySelectorAll(".delete-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteWeight(
                        button.dataset.id
                    );

                }
            );

        });

}



/* =========================================================
   ELIMINA PESO
   ========================================================= */

function deleteWeight(id) {

    const confirmed =
        confirm(
            "Vuoi eliminare questa registrazione?"
        );


    if (!confirmed) {
        return;
    }


    const weights =
        getWeights();


    const filtered =
        weights.filter(
            entry =>
                String(entry.id) !==
                String(id)
        );


    saveWeights(filtered);

    updateOverview();

    renderHistory();

}



/* =========================================================
   SALVATAGGIO FORM
   ========================================================= */

weightForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const weight =
            parseFloat(
                weightInput.value
            );


        const date =
            dateInput.value;


        if (!weight || !date) {

            return;

        }


        const weights =
            getWeights();


        /*
           Se esiste già una registrazione
           nella stessa data, la sostituiamo.
        */

        const existingIndex =
            weights.findIndex(
                entry =>
                    entry.date === date
            );


        const newEntry = {

            id:
                Date.now(),

            weight:
                weight,

            date:
                date

        };


        if (existingIndex !== -1) {

            weights[existingIndex] =
                newEntry;

        } else {

            weights.push(
                newEntry
            );

        }


        saveWeights(weights);


        /*
           Reset
        */

        weightInput.value =
            "";


        dateInput.value =
            date;


        updateOverview();

        renderHistory();

    }
);



/* =========================================================
   INIZIALIZZAZIONE
   ========================================================= */

setTodayDate();

updateOverview();

renderHistory();