const workouts = {

    A: {
        name: "PHA Upper + Lower",

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
            }
        ]
    },

    B: {
        name: "Dorso + Bicipiti",

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
                reps: "MAX",
                rest: "90 sec"
            }
        ]
    },

    C: {
        name: "Gambe",

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
                reps: "8",
                rest: "105 sec"
            }
        ]
    }

};


/* =========================
   PRENDE A, B O C DALL'URL
========================= */

const params = new URLSearchParams(window.location.search);

const workoutId = (params.get("id") || "A").toUpperCase();

const workout = workouts[workoutId] || workouts.A;


/* =========================
   ELEMENTI HTML
========================= */

document.getElementById("workoutLetter").textContent = workoutId;

document.getElementById("workoutTitle").textContent = workout.name;

document.getElementById("exerciseCount").textContent =
    workout.exercises.length;

document.getElementById("exerciseTotal").textContent =
    `${workout.exercises.length} esercizi`;


/* =========================
   SALVATAGGIO PESI
========================= */

const storageKey = `gymtrack_${workoutId}`;

const savedData =
    JSON.parse(localStorage.getItem(storageKey)) || {};


/* =========================
   CREA ESERCIZI
========================= */

const exerciseList =
    document.getElementById("exerciseList");


workout.exercises.forEach((exercise, index) => {

    const data = savedData[index] || {};

    const card = document.createElement("article");

    card.className = "exercise-card";

    card.innerHTML = `

        <div class="exercise-top">

            <div class="exercise-number">
                ${index + 1}
            </div>

            <div class="exercise-title">

                <span class="exercise-muscle">
                    ${exercise.muscle}
                </span>

                <h3>
                    ${exercise.name}
                </h3>

            </div>

        </div>


        <div class="exercise-info">

            <div>
                <span>SERIE</span>
                <strong>${exercise.sets}</strong>
            </div>

            <div>
                <span>RIPETIZIONI</span>
                <strong>${exercise.reps}</strong>
            </div>

            <div>
                <span>RECUPERO</span>
                <strong>${exercise.rest}</strong>
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

                <span>kg</span>

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


/* =========================
   SALVA PESO E NOTE
========================= */

document.querySelectorAll(".weight-input").forEach(input => {

    input.addEventListener("input", () => {

        const index = input.dataset.index;

        if (!savedData[index]) {
            savedData[index] = {};
        }

        savedData[index].weight = input.value;

        localStorage.setItem(
            storageKey,
            JSON.stringify(savedData)
        );

    });

});


document.querySelectorAll(".notes-input").forEach(input => {

    input.addEventListener("input", () => {

        const index = input.dataset.index;

        if (!savedData[index]) {
            savedData[index] = {};
        }

        savedData[index].notes = input.value;

        localStorage.setItem(
            storageKey,
            JSON.stringify(savedData)
        );

    });

});
