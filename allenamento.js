/* =========================================================
   GYMTRACK
   allenamento.js
   ========================================================= */


/* =========================================================
   DATI DEGLI ALLENAMENTI
   ========================================================= */

const workouts = {

    A: {
        name: "PHA Upper + Lower",
        description: "Allenamento completo parte superiore e inferiore.",
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
        description: "Riscaldamento: 10 minuti di tapis roulant, circonduzioni e mobilità. Conclusione: 5 minuti di tapis roulant con pendenza 12 e velocità 3.5.",
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
            },

        ]
    },


    C: {
        name: "Gambe",
        description: "Riscaldamento: 10 minuti di cyclette, circonduzioni e mobilità. Tra Pendulum Squat e Mezzi Stacchi: 3 minuti di tapis roulant con pendenza 12 e velocità 3.5. Conclusione: 5 minuti di cyclette orizzontale e 3-5 minuti di squadretta.",
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
            },

        ]
    }

};


/* =========================================================
   RECUPERO DELLA SCHEDA DALL'URL
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
   STORAGE KEY
   ========================================================= */

const storageKey =
    `gymtrack_workout_${workoutId}`;



/* =========================================================
   CARICA DATI SALVATI
   ========================================================= */

let savedData =
    JSON.parse(localStorage.getItem(storageKey)) || {};



/* =========================================================
   IMPOSTA INFORMAZIONI DELLA SCHEDA
   ========================================================= */

function loadWorkoutInfo() {

    workoutLetter.textContent =
        workoutId;

    workoutTitle.textContent =
        workout.name;

    workoutDescription.textContent =
        workout.description;

    exerciseCount.textContent =
        workout.exercises.length;

    exerciseTotal.textContent =
        `${workout.exercises.length} esercizi`;

}



/* =========================================================
   CREA GLI ESERCIZI
   ========================================================= */

function renderExercises() {

    exerciseList.innerHTML = "";


    workout.exercises.forEach((exercise, index) => {

        const exerciseNumber =
            index + 1;


        const data =
            savedData[index] || {};


        const isCompleted =
            data.completed || false;


        const card =
            document.createElement("article");


        card.className =
            `exercise-card ${isCompleted ? "completed" : ""}`;


        card.innerHTML = `

            <div class="exercise-top">

                <div class="exercise-number">

                    ${exerciseNumber}

                </div>


                <div class="exercise-title">

                    <span class="exercise-muscle">

                        ${exercise.muscle}

                    </span>


                    <h3>

                        ${exercise.name}

                    </h3>

                </div>


                <button
                    class="complete-button"
                    data-index="${index}"
                    aria-label="Completa esercizio"
                >

                    <i class="fa-solid fa-check"></i>

                </button>

            </div>


            <div class="exercise-info">


                <div>

                    <span>
                        SERIE
                    </span>

                    <strong>
                        ${exercise.sets}
                    </strong>

                </div>


                <div>

                    <span>
                        RIPETIZIONI
                    </span>

                    <strong>
                        ${exercise.reps}
                    </strong>

                </div>


                <div>

                    <span>
                        RECUPERO
                    </span>

                    <strong>
                        ${exercise.rest}
                    </strong>

                </div>


            </div>


            <div class="weight-section">


                <label>

                    CARICO UTILIZZATO

                </label>


                <div class="weight-input-wrapper">


                    <input
                        type="number"
                        class="weight-input"
                        data-index="${index}"
                        value="${data.weight || ""}"
                        placeholder="0"
                        step="0.5"
                        min="0"
                    >


                    <span>
                        kg
                    </span>


                </div>


            </div>


            <div class="notes-section">


                <label>

                    NOTE

                </label>


                <input
                    type="text"
                    class="notes-input"
                    data-index="${index}"
                    value="${data.notes || ""}"
                    placeholder="Aggiungi una nota..."
                >


            </div>

        `;


        exerciseList.appendChild(card);

    });


    addExerciseListeners();

    updateProgress();

}



/* =========================================================
   EVENTI DEGLI ESERCIZI
   ========================================================= */

function addExerciseListeners() {


    /* -----------------------------
       PULSANTE COMPLETATO
    ------------------------------ */

    const completeButtons =
        document.querySelectorAll(".complete-button");


    completeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const index =
                Number(button.dataset.index);


            if (!savedData[index]) {

                savedData[index] = {};

            }


            savedData[index].completed =
                !savedData[index].completed;


            saveData();

            renderExercises();

        });

    });



    /* -----------------------------
       INPUT PESO
    ------------------------------ */

    const weightInputs =
        document.querySelectorAll(".weight-input");


    weightInputs.forEach(input => {

        input.addEventListener("input", () => {

            const index =
                Number(input.dataset.index);


            if (!savedData[index]) {

                savedData[index] = {};

            }


            savedData[index].weight =
                input.value;


            saveData();

        });

    });



    /* -----------------------------
       NOTE
    ------------------------------ */

    const notesInputs =
        document.querySelectorAll(".notes-input");


    notesInputs.forEach(input => {

        input.addEventListener("input", () => {

            const index =
                Number(input.dataset.index);


            if (!savedData[index]) {

                savedData[index] = {};

            }


            savedData[index].notes =
                input.value;


            saveData();

        });

    });

}



/* =========================================================
   SALVA DATI
   ========================================================= */

function saveData() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(savedData)
    );

}



/* =========================================================
   AGGIORNA PROGRESSO
   ========================================================= */

function updateProgress() {

    const total =
        workout.exercises.length;


    let completed =
        0;


    workout.exercises.forEach((exercise, index) => {

        if (
            savedData[index] &&
            savedData[index].completed
        ) {

            completed++;

        }

    });


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    progressPercentage.textContent =
        `${percentage}%`;


    progressText.textContent =
        `${completed} / ${total} esercizi`;


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

    }

}



/* =========================================================
   COMPLETA ALLENAMENTO
   ========================================================= */

finishWorkout.addEventListener(
    "click",
    () => {

        const total =
            workout.exercises.length;


        let completed =
            0;


        workout.exercises.forEach(
            (exercise, index) => {

                if (
                    savedData[index] &&
                    savedData[index].completed
                ) {

                    completed++;

                }

            }
        );


        if (completed < total) {

            const remaining =
                total - completed;


            const confirmFinish =
                confirm(
                    `Hai ancora ${remaining} esercizi da completare.\n\nVuoi comunque terminare l'allenamento?`
                );


            if (!confirmFinish) {

                return;

            }

        }


        /* Salva la data */

        const workoutHistory =
            JSON.parse(
                localStorage.getItem(
                    "gymtrack_history"
                )
            ) || [];


        workoutHistory.push({

            workout:
                workoutId,

            name:
                workout.name,

            date:
                new Date().toISOString(),

            completedExercises:
                completed,

            totalExercises:
                total

        });


        localStorage.setItem(
            "gymtrack_history",
            JSON.stringify(workoutHistory)
        );


        alert(
            "Allenamento salvato! 💪"
        );


        window.location.href =
            "allenamenti.html";

    }
);



/* =========================================================
   INIZIALIZZAZIONE
   ========================================================= */

loadWorkoutInfo();

renderExercises();
