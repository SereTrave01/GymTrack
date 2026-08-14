/* =========================================================
   GYMTRACK - ALLENAMENTI
   ========================================================= */


/* =========================================================
   DATI DELLE SCHEDE
   ========================================================= */

const workouts = {

    A: {
        name: "PHA Upper + Lower",
        description: "Scheda A",
        exercises: 7,
        duration: "60 min",
        color: "purple"
    },

    B: {
        name: "Dorso + Bicipiti",
        description: "Scheda B",
        exercises: 6,
        duration: "60 min",
        color: "blue"
    },

    C: {
        name: "Gambe",
        description: "Scheda C",
        exercises: 6,
        duration: "60 min",
        color: "pink"
    }

};


/* =========================================================
   ELEMENTI HTML
   ========================================================= */

const workoutGrid =
    document.getElementById("workoutGrid");

const completedWorkouts =
    document.getElementById("completedWorkouts");

const lastWorkout =
    document.getElementById("lastWorkout");


/* =========================================================
   CREA LE CARD DELLE SCHEDE
   ========================================================= */

function renderWorkouts() {

    if (!workoutGrid) {
        return;
    }

    workoutGrid.innerHTML = "";


    Object.entries(workouts).forEach(
        ([id, workout]) => {

            const card =
                document.createElement("article");

            card.className =
                "workout-card";


            card.innerHTML = `

                <div class="workout-card-top">

                    <div class="workout-letter ${workout.color}-bg">
                        ${id}
                    </div>

                    <span class="workout-status">
                        Pronta
                    </span>

                </div>


                <div class="workout-card-content">

                    <h3>
                        ${workout.name}
                    </h3>

                    <p>
                        ${workout.description}
                    </p>


                    <div class="workout-details">

                        <span>

                            <i class="fa-solid fa-dumbbell"></i>

                            ${workout.exercises} esercizi

                        </span>


                        <span>

                            <i class="fa-regular fa-clock"></i>

                            ${workout.duration}

                        </span>

                    </div>

                </div>


                <a
                    href="allenamento.html?id=${id}"
                    class="workout-button"
                >

                    Vedi scheda

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            `;


            workoutGrid.appendChild(card);

        }
    );

}


/* =========================================================
   STORICO ALLENAMENTI
   ========================================================= */

function getWorkoutHistory() {

    return JSON.parse(
        localStorage.getItem(
            "gymtrack_history"
        )
    ) || [];

}


/* =========================================================
   AGGIORNA STATISTICHE
   ========================================================= */

function updateStats() {

    const history =
        getWorkoutHistory();


    /* -----------------------------
       ALLENAMENTI COMPLETATI
    ------------------------------ */

    if (completedWorkouts) {

        completedWorkouts.textContent =
            history.length;

    }


    /* -----------------------------
       ULTIMA SEDUTA
    ------------------------------ */

    if (lastWorkout) {

        if (history.length === 0) {

            lastWorkout.textContent =
                "—";

        } else {

            const latest =
                history[history.length - 1];


            const date =
                new Date(latest.date);


            lastWorkout.textContent =
                date.toLocaleDateString(
                    "it-IT",
                    {
                        day: "2-digit",
                        month: "2-digit"
                    }
                );

        }

    }

}


/* =========================================================
   INIZIALIZZAZIONE
   ========================================================= */

function init() {

    renderWorkouts();

    updateStats();

}


init();
