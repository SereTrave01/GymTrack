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
                name: "Esercizio 1",
                muscle: "Gambe",
                sets: 4,
                reps: "8-10",
                rest: "120 sec"
            },

            {
                name: "Esercizio 2",
                muscle: "Glutei",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 3",
                muscle: "Schiena",
                sets: 3,
                reps: "8-10",
                rest: "90 sec"
            },

            {
                name: "Esercizio 4",
                muscle: "Spalle",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 5",
                muscle: "Gambe",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 6",
                muscle: "Schiena",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 7",
                muscle: "Core",
                sets: 3,
                reps: "12-15",
                rest: "60 sec"
            }

        ]
    },


    B: {
        name: "Scheda B",
        description: "Secondo allenamento della settimana.",
        duration: "60 min",

        exercises: [

            {
                name: "Esercizio 1",
                muscle: "Gambe",
                sets: 4,
                reps: "8-10",
                rest: "120 sec"
            },

            {
                name: "Esercizio 2",
                muscle: "Glutei",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 3",
                muscle: "Petto",
                sets: 3,
                reps: "8-10",
                rest: "90 sec"
            },

            {
                name: "Esercizio 4",
                muscle: "Spalle",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 5",
                muscle: "Schiena",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 6",
                muscle: "Bicipiti",
                sets: 3,
                reps: "10-12",
                rest: "60 sec"
            },

            {
                name: "Esercizio 7",
                muscle: "Tricipiti",
                sets: 3,
                reps: "10-12",
                rest: "60 sec"
            }

        ]
    },


    C: {
        name: "Scheda C",
        description: "Terzo allenamento della settimana.",
        duration: "60 min",

        exercises: [

            {
                name: "Esercizio 1",
                muscle: "Gambe",
                sets: 4,
                reps: "8-10",
                rest: "120 sec"
            },

            {
                name: "Esercizio 2",
                muscle: "Glutei",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 3",
                muscle: "Schiena",
                sets: 3,
                reps: "8-10",
                rest: "90 sec"
            },

            {
                name: "Esercizio 4",
                muscle: "Petto",
                sets: 3,
                reps: "8-10",
                rest: "90 sec"
            },

            {
                name: "Esercizio 5",
                muscle: "Spalle",
                sets: 3,
                reps: "10-12",
                rest: "90 sec"
            },

            {
                name: "Esercizio 6",
                muscle: "Bicipiti",
                sets: 3,
                reps: "10-12",
                rest: "60 sec"
            },

            {
                name: "Esercizio 7",
                muscle: "Core",
                sets: 3,
                reps: "12-15",
                rest: "60 sec"
            }

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