/* =========================================================
   GYMTRACK
   allenamento.js

   FUNZIONE PRINCIPALE:
   Tracking dei carichi utilizzati negli esercizi.

   - Salvataggio ultimo carico
   - Salvataggio note
   - Storico degli allenamenti
   - Progressione dei carichi
   - Nessun sistema di "esercizio completato"
   ========================================================= */


/* =========================================================
   DATI DEGLI ALLENAMENTI
   ========================================================= */

const workouts = {

    A: {

        name: "PHA Upper + Lower",

        description:
            "Allenamento completo parte superiore e inferiore.",

        duration: "60 min",

        exercises: [

            {
                name: "Back Squat",
                muscle: "Gambe",
                sets: 5,
                reps: "5",
                rest: "120 sec"
            },

            {
                name: "Lento Avanti con Manubri su Panca 70°",
                muscle: "Spalle",
                sets: 3,
                reps: "12 - 10 - 8",
                rest: "90 sec"
            },

            {
                name: "Affondi Bulgari con Manubrio",
                muscle: "Gambe",
                sets: 3,
                reps: "8 per gamba",
                rest: "105 sec"
            },

            {
                name: "Chest Press",
                muscle: "Petto",
                sets: 3,
                reps: "10",
                rest: "90 sec"
            },

            {
                name: "Abductor Machine",
                muscle: "Glutei",
                sets: 3,
                reps: "20 - 15 - 12",
                rest: "105 sec"
            },

            {
                name: "Distensioni Sopra la Testa con Manubrio",
                muscle: "Tricipiti",
                sets: 3,
                reps: "8 per braccio",
                rest: "90 sec"
            },

            {
                name: "Calf su Step",
                muscle: "Polpacci",
                sets: 3,
                reps: "MAX",
                rest: "105 sec"
            }

        ]

    },


    B: {

        name: "Dorso + Bicipiti",

        description:
            "Riscaldamento: 10 minuti di tapis roulant, circonduzioni e mobilità. Conclusione: 5 minuti di tapis roulant con pendenza 12 e velocità 3.5.",

        duration: "60 min",

        exercises: [

            {
                name: "Pull Down Braccia Semi Tese con Corda",
                muscle: "Schiena",
                sets: 3,
                reps: "12",
                rest: "90 sec"
            },

            {
                name: "Rematore con Manubrio",
                muscle: "Schiena",
                sets: 3,
                reps: "8 per braccio",
                rest: "90 sec"
            },

            {
                name: "Trazioni EasyPower Presa Neutra",
                muscle: "Schiena",
                sets: 3,
                reps: "MAX, carico per 8-10 ripetizioni",
                rest: "90 sec"
            },

            {
                name: "Hyperextension",
                muscle: "Lombari",
                sets: 3,
                reps: "12",
                rest: "90 sec"
            },

            {
                name: "Curl Alternati con Manubri su Panca 60°",
                muscle: "Bicipiti",
                sets: 3,
                reps: "8 per braccio",
                rest: "60 sec"
            },

            {
                name: "Crunch alla Poliercolina",
                muscle: "Addominali",
                sets: 3,
                reps: "MAX",
                rest: "45 sec"
            }

        ]

    },


    C: {

        name: "Gambe",

        description:
            "Riscaldamento: 10 minuti di cyclette, circonduzioni e mobilità. Tra Pendulum Squat e Mezzi Stacchi: 3 minuti di tapis roulant con pendenza 12 e velocità 3.5. Conclusione: 5 minuti di cyclette orizzontale e 3-5 minuti di squadretta.",

        duration: "60 min",

        exercises: [

            {
                name: "Calf Raise su Pressa Orizzontale",
                muscle: "Polpacci",
                sets: 3,
                reps: "12",
                rest: "105 sec"
            },

            {
                name: "Step Up Monopodalico",
                muscle: "Gambe",
                sets: 3,
                reps: "8 per gamba",
                rest: "105 sec"
            },

            {
                name: "Pendulum Squat",
                muscle: "Gambe",
                sets: 3,
                reps: "8, discesa 3 sec + isometria 2 sec",
                rest: "105 sec"
            },

            {
                name: "Mezzi Stacchi con Bilanciere Dritto",
                muscle: "Femorali",
                sets: 3,
                reps: "8",
                rest: "105 sec"
            },

            {
                name: "Leg Curl Prono",
                muscle: "Femorali",
                sets: 3,
                reps: "10",
                rest: "105 sec"
            },

            {
                name: "Hyperextension in Cifosi con Punte Extraruotate",
                muscle: "Glutei",
                sets: 3,
                reps: "10-15",
                rest: "105 sec"
            }

        ]

    }

};


/* =========================================================
   RECUPERO SCHEDA DALL'URL
   ========================================================= */

const params = new URLSearchParams(window.location.search);

let workoutId = params.get("id");

if (!workoutId || !workouts[workoutId]) {

    workoutId = "A";

}

const workout = workouts[workoutId];


/* =========================================================
   ELEMENTI HTML
   ========================================================= */

const workoutLetter =
    document.getElementById("workoutLetter");

const workoutTitle =
    document.getElementById("workoutTitle");

const workoutDescription =
    document.getElementById("workoutDescription");

const exerciseCount =
    document.getElementById("exerciseCount");

const exerciseTotal =
    document.getElementById("exerciseTotal");

const exerciseList =
    document.getElementById("exerciseList");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressText =
    document.getElementById("progressText");

const progressBar =
    document.getElementById("progressBar");

const finishWorkout =
    document.getElementById("finishWorkout");


/* =========================================================
   STORAGE
   =========================================================

   LAST WEIGHTS

   Contiene solamente l'ultimo carico utilizzato
   per ogni esercizio.

   Esempio:

   {
       "0": {
           weight: "80",
           notes: "Facile"
       }
   }

   HISTORY

   Contiene tutti gli allenamenti salvati.

   ========================================================= */

const latestStorageKey =
    `gymtrack_latest_${workoutId}`;

const historyStorageKey =
    "gymtrack_history";


/* =========================================================
   CARICA ULTIMI DATI
   ========================================================= */

let latestData = {};

try {

    latestData =
        JSON.parse(
            localStorage.getItem(latestStorageKey)
        ) || {};

} catch (error) {

    console.error(
        "Errore nel caricamento dei dati:",
        error
    );

    latestData = {};

}


/* =========================================================
   CARICA STORICO
   ========================================================= */

let workoutHistory = [];

try {

    workoutHistory =
        JSON.parse(
            localStorage.getItem(historyStorageKey)
        ) || [];

} catch (error) {

    console.error(
        "Errore nel caricamento dello storico:",
        error
    );

    workoutHistory = [];

}


/* =========================================================
   IMPOSTA INFORMAZIONI DELLA SCHEDA
   ========================================================= */

function loadWorkoutInfo() {

    if (workoutLetter) {

        workoutLetter.textContent =
            workoutId;

    }


    if (workoutTitle) {

        workoutTitle.textContent =
            workout.name;

    }


    if (workoutDescription) {

        workoutDescription.textContent =
            workout.description;

    }


    if (exerciseCount) {

        exerciseCount.textContent =
            workout.exercises.length;

    }


    if (exerciseTotal) {

        exerciseTotal.textContent =
            `${workout.exercises.length} esercizi`;

    }

}


/* =========================================================
   CREA GLI ESERCIZI
   ========================================================= */

function renderExercises() {

    if (!exerciseList) {

        console.error(
            "Elemento #exerciseList non trovato."
        );

        return;

    }


    exerciseList.innerHTML = "";


    workout.exercises.forEach(
        (exercise, index) => {

            const data =
                latestData[index] || {};


            const hasWeight =
                data.weight !== undefined &&
                data.weight !== null &&
                data.weight !== "";


            const card =
                document.createElement("article");


            card.className =
                `exercise-card ${hasWeight ? "has-weight" : ""}`;


            card.dataset.index =
                index;


            card.innerHTML = `

                <!-- =====================================
                     TESTATA ESERCIZIO
                ====================================== -->

                <div class="exercise-top">

                    <div class="exercise-number">

                        ${index + 1}

                    </div>


                    <div class="exercise-title">

                        <span class="exercise-muscle">

                            ${escapeHTML(exercise.muscle)}

                        </span>


                        <h3>

                            ${escapeHTML(exercise.name)}

                        </h3>

                    </div>

                </div>


                <!-- =====================================
                     INFORMAZIONI ESERCIZIO
                ====================================== -->

                <div class="exercise-info">


                    <div>

                        <span>
                            SERIE
                        </span>

                        <strong>
                            ${escapeHTML(String(exercise.sets))}
                        </strong>

                    </div>


                    <div>

                        <span>
                            RIPETIZIONI
                        </span>

                        <strong>
                            ${escapeHTML(exercise.reps)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            RECUPERO
                        </span>

                        <strong>
                            ${escapeHTML(exercise.rest)}
                        </strong>

                    </div>


                </div>


                <!-- =====================================
                     CARICO
                ====================================== -->

                <div class="weight-section">

                    <label>

                        CARICO UTILIZZATO

                    </label>


                    <div class="weight-input-wrapper">


                        <input
                            type="number"
                            class="weight-input"
                            data-index="${index}"
                            value="${escapeAttribute(data.weight || "")}"
                            placeholder="0"
                            step="0.5"
                            min="0"
                            inputmode="decimal"
                            autocomplete="off"
                        >


                        <span>
                            kg
                        </span>


                    </div>


                    ${
                        hasWeight
                            ? `
                                <small class="last-weight">

                                    Ultimo carico:
                                    <strong>
                                        ${escapeHTML(String(data.weight))} kg
                                    </strong>

                                </small>
                              `
                            : `
                                <small class="last-weight">

                                    Nessun carico registrato

                                </small>
                              `
                    }


                </div>


                <!-- =====================================
                     NOTE
                ====================================== -->

                <div class="notes-section">

                    <label>

                        NOTE

                    </label>


                    <input
                        type="text"
                        class="notes-input"
                        data-index="${index}"
                        value="${escapeAttribute(data.notes || "")}"
                        placeholder="Aggiungi una nota..."
                        autocomplete="off"
                    >

                </div>


                <!-- =====================================
                     STATO
                ====================================== -->

                <div class="exercise-status">

                    ${
                        hasWeight
                            ? `
                                <span class="status-recorded">
                                    <i class="fa-solid fa-check"></i>
                                    Carico registrato
                                </span>
                              `
                            : `
                                <span class="status-empty">
                                    <i class="fa-solid fa-circle"></i>
                                    Inserisci il carico
                                </span>
                              `
                    }

                </div>

            `;


            exerciseList.appendChild(card);

        }
    );


    addExerciseListeners();

    updateProgress();

}


/* =========================================================
   SICUREZZA HTML
   =========================================================

   Evita che testo inserito nei dati venga interpretato
   come HTML.

   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   EVENTI DEGLI ESERCIZI
   ========================================================= */

function addExerciseListeners() {


    /* =============================================
       INPUT PESO
    ============================================== */

    const weightInputs =
        document.querySelectorAll(
            ".weight-input"
        );


    weightInputs.forEach(
        input => {

            input.addEventListener(
                "input",
                () => {

                    const index =
                        Number(
                            input.dataset.index
                        );


                    if (!latestData[index]) {

                        latestData[index] = {};

                    }


                    latestData[index].weight =
                        input.value;


                    saveLatestData();


                    updateExerciseVisualState(
                        index
                    );


                    updateProgress();

                }
            );

        }
    );


    /* =============================================
       NOTE
    ============================================== */

    const notesInputs =
        document.querySelectorAll(
            ".notes-input"
        );


    notesInputs.forEach(
        input => {

            input.addEventListener(
                "input",
                () => {

                    const index =
                        Number(
                            input.dataset.index
                        );


                    if (!latestData[index]) {

                        latestData[index] = {};

                    }


                    latestData[index].notes =
                        input.value;


                    saveLatestData();

                }
            );

        }
    );

}


/* =========================================================
   AGGIORNA ASPETTO ESERCIZIO
   ========================================================= */

function updateExerciseVisualState(index) {

    const card =
        document.querySelector(
            `.exercise-card[data-index="${index}"]`
        );


    if (!card) {

        return;

    }


    const input =
        card.querySelector(
            ".weight-input"
        );


    if (!input) {

        return;

    }


    const hasWeight =
        input.value !== "";


    if (hasWeight) {

        card.classList.add(
            "has-weight"
        );

    } else {

        card.classList.remove(
            "has-weight"
        );

    }


    const status =
        card.querySelector(
            ".exercise-status"
        );


    const lastWeight =
        card.querySelector(
            ".last-weight"
        );


    if (status) {

        status.innerHTML =
            hasWeight

                ? `
                    <span class="status-recorded">

                        <i class="fa-solid fa-check"></i>

                        Carico registrato

                    </span>
                  `

                : `
                    <span class="status-empty">

                        <i class="fa-solid fa-circle"></i>

                        Inserisci il carico

                    </span>
                  `;

    }


    if (lastWeight) {

        lastWeight.innerHTML =
            hasWeight

                ? `
                    Ultimo carico:
                    <strong>
                        ${escapeHTML(input.value)} kg
                    </strong>
                  `

                : `
                    Nessun carico registrato
                  `;

    }

}


/* =========================================================
   SALVA ULTIMI DATI
   ========================================================= */

function saveLatestData() {

    try {

        localStorage.setItem(

            latestStorageKey,

            JSON.stringify(latestData)

        );

    } catch (error) {

        console.error(
            "Impossibile salvare i dati:",
            error
        );

    }

}


/* =========================================================
   AGGIORNA PROGRESSO
   =========================================================

   Il progresso non indica più "esercizi completati".

   Indica:

   esercizi con un carico registrato
   /
   esercizi totali

   ========================================================= */

function updateProgress() {

    const total =
        workout.exercises.length;


    let recorded =
        0;


    workout.exercises.forEach(
        (exercise, index) => {

            if (
                latestData[index] &&
                latestData[index].weight !== undefined &&
                latestData[index].weight !== null &&
                latestData[index].weight !== ""
            ) {

                recorded++;

            }

        }
    );


    const percentage =
        total > 0

            ? Math.round(
                (recorded / total) * 100
            )

            : 0;


    if (progressPercentage) {

        progressPercentage.textContent =
            `${percentage}%`;

    }


    if (progressText) {

        progressText.textContent =
            `${recorded} / ${total} carichi registrati`;

    }


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

    }

}


/* =========================================================
   CREA SNAPSHOT DELL'ALLENAMENTO
   =========================================================

   Quando premi "Salva allenamento", non salviamo
   solamente un riferimento alla scheda.

   Salviamo una fotografia completa dei carichi
   utilizzati in quella sessione.

   ========================================================= */

function createWorkoutSnapshot() {

    return workout.exercises.map(
        (exercise, index) => {

            const data =
                latestData[index] || {};


            return {

                exerciseIndex:
                    index,

                name:
                    exercise.name,

                muscle:
                    exercise.muscle,

                sets:
                    exercise.sets,

                reps:
                    exercise.reps,

                rest:
                    exercise.rest,

                weight:
                    data.weight || "",

                notes:
                    data.notes || ""

            };

        }
    );

}


/* =========================================================
   SALVA NELLO STORICO
   ========================================================= */

function saveWorkoutToHistory() {

    const snapshot =
        createWorkoutSnapshot();


    const recordedExercises =
        snapshot.filter(
            exercise =>
                exercise.weight !== ""
        );


    const historyEntry = {

        id:
            Date.now(),

        workout:
            workoutId,

        name:
            workout.name,

        date:
            new Date().toISOString(),

        exercises:
            snapshot,

        recordedExercises:
            recordedExercises.length,

        totalExercises:
            workout.exercises.length

    };


    workoutHistory.push(
        historyEntry
    );


    try {

        localStorage.setItem(

            historyStorageKey,

            JSON.stringify(
                workoutHistory
            )

        );

    } catch (error) {

        console.error(
            "Errore nel salvataggio dello storico:",
            error
        );

        return false;

    }


    return true;

}


/* =========================================================
   SALVA ALLENAMENTO
   ========================================================= */

function finishCurrentWorkout() {

    const total =
        workout.exercises.length;


    let recorded =
        0;


    workout.exercises.forEach(
        (exercise, index) => {

            if (
                latestData[index] &&
                latestData[index].weight !== undefined &&
                latestData[index].weight !== null &&
                latestData[index].weight !== ""
            ) {

                recorded++;

            }

        }
    );


    /* =============================================
       CONTROLLO DATI
    ============================================== */

    if (recorded === 0) {

        alert(
            "Inserisci almeno un carico prima di salvare l'allenamento."
        );

        return;

    }


    /* =============================================
       CONFERMA SE MANCANO ALCUNI CARICHI
    ============================================== */

    if (recorded < total) {

        const remaining =
            total - recorded;


        const confirmSave =
            confirm(

                `Hai registrato il carico di ${recorded} esercizi su ${total}.\n\n` +

                `Mancano ${remaining} esercizi.\n\n` +

                `Vuoi comunque salvare l'allenamento?`

            );


        if (!confirmSave) {

            return;

        }

    }


    /* =============================================
       SALVATAGGIO
    ============================================== */

    const saved =
        saveWorkoutToHistory();


    if (!saved) {

        alert(
            "Si è verificato un errore durante il salvataggio."
        );

        return;

    }


    /* =============================================
       CONFERMA
    ============================================== */

    alert(
        "Allenamento salvato! 💪\n\n" +
        `${recorded} carichi registrati su ${total}.`
    );


    /* =============================================
       RITORNO ALLA PAGINA ALLENAMENTI
    ============================================== */

    window.location.href =
        "allenamenti.html";

}


/* =========================================================
   EVENTO SALVATAGGIO ALLENAMENTO
   ========================================================= */

if (finishWorkout) {

    finishWorkout.addEventListener(
        "click",
        finishCurrentWorkout
    );

}


/* =========================================================
   RECUPERA ULTIMO CARICO DI UN ESERCIZIO
   =========================================================

   Funzione utile anche per altre pagine
   dell'applicazione.

   Esempio:

   getLastWeight("A", 0)

   restituisce l'ultimo peso registrato
   per il Back Squat della scheda A.

   ========================================================= */

function getLastWeight(
    workoutId,
    exerciseIndex
) {

    const key =
        `gymtrack_latest_${workoutId}`;


    let data = {};


    try {

        data =
            JSON.parse(
                localStorage.getItem(key)
            ) || {};

    } catch (error) {

        console.error(error);

    }


    if (
        !data[exerciseIndex] ||
        data[exerciseIndex].weight === undefined
    ) {

        return null;

    }


    return data[exerciseIndex].weight;

}


/* =========================================================
   STORICO DI UN ESERCIZIO
   =========================================================

   Restituisce tutti i carichi precedentemente
   utilizzati per un determinato esercizio.

   Esempio:

   getExerciseHistory("A", 0)

   ========================================================= */

function getExerciseHistory(
    selectedWorkoutId,
    exerciseIndex
) {

    const history =
        getWorkoutHistory();


    return history

        .filter(
            entry =>
                entry.workout ===
                selectedWorkoutId
        )

        .map(
            entry => {

                if (
                    !entry.exercises ||
                    !entry.exercises[exerciseIndex]
                ) {

                    return null;

                }


                const exercise =
                    entry.exercises[exerciseIndex];


                return {

                    date:
                        entry.date,

                    weight:
                        exercise.weight,

                    notes:
                        exercise.notes

                };

            }
        )

        .filter(
            item =>
                item &&
                item.weight !== ""
        );

}


/* =========================================================
   RECUPERA TUTTO LO STORICO
   ========================================================= */

function getWorkoutHistory() {

    try {

        return JSON.parse(

            localStorage.getItem(
                historyStorageKey
            )

        ) || [];

    } catch (error) {

        console.error(
            "Errore lettura storico:",
            error
        );

        return [];

    }

}


/* =========================================================
   FORMATTA DATA
   ========================================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return "";

    }


    return date.toLocaleDateString(
        "it-IT",
        {

            day: "2-digit",

            month: "2-digit",

            year: "numeric"

        }
    );

}


/* =========================================================
   OTTIENI ULTIMO ALLENAMENTO
   ========================================================= */

function getLastWorkout() {

    const history =
        getWorkoutHistory();


    const workoutsForCurrentId =
        history.filter(
            entry =>
                entry.workout === workoutId
        );


    if (
        workoutsForCurrentId.length === 0
    ) {

        return null;

    }


    return workoutsForCurrentId[
        workoutsForCurrentId.length - 1
    ];

}


/* =========================================================
   DEBUG / CONSOLE
   =========================================================

   Queste funzioni possono essere utilizzate dalla
   console del browser durante lo sviluppo.

   Esempio:

   getExerciseHistory("A", 0)

   ========================================================= */

window.GymTrack = {

    getLastWeight,

    getExerciseHistory,

    getWorkoutHistory,

    getLastWorkout,

    formatDate

};


/* =========================================================
   INIZIALIZZAZIONE
   ========================================================= */

loadWorkoutInfo();

renderExercises();
