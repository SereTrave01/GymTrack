/* =========================================================
   GYMTRACK
   progressi.js

   Legge:

   gymtrack_history

   creato da allenamento.js

   e costruisce:

   - statistiche generali
   - lista esercizi
   - progressione
   - grafico
   - storico
   - record personali
   ========================================================= */


/* =========================================================
   STORAGE
   ========================================================= */

const HISTORY_KEY =
    "gymtrack_history";


/* =========================================================
   ELEMENTI HTML
   ========================================================= */

const totalWorkouts =
    document.getElementById("totalWorkouts");

const trackedExercises =
    document.getElementById("trackedExercises");

const personalRecords =
    document.getElementById("personalRecords");

const lastWorkoutDate =
    document.getElementById("lastWorkoutDate");

const lastWorkoutName =
    document.getElementById("lastWorkoutName");


const exerciseSelect =
    document.getElementById("exerciseSelect");


const workoutFilters =
    document.querySelectorAll(
        ".workout-filter"
    );


const emptyProgress =
    document.getElementById("emptyProgress");


const progressContent =
    document.getElementById("progressContent");


const selectedMuscle =
    document.getElementById("selectedMuscle");


const selectedExerciseName =
    document.getElementById(
        "selectedExerciseName"
    );


const selectedWorkout =
    document.getElementById(
        "selectedWorkout"
    );


const lastWeight =
    document.getElementById(
        "lastWeight"
    );


const recordWeight =
    document.getElementById(
        "recordWeight"
    );


const weightVariation =
    document.getElementById(
        "weightVariation"
    );


const sessionCount =
    document.getElementById(
        "sessionCount"
    );


const chartPeriod =
    document.getElementById(
        "chartPeriod"
    );


const progressChart =
    document.getElementById(
        "progressChart"
    );


const chartEmpty =
    document.getElementById(
        "chartEmpty"
    );


const historyList =
    document.getElementById(
        "historyList"
    );


const historyCount =
    document.getElementById(
        "historyCount"
    );


const recordsGrid =
    document.getElementById(
        "recordsGrid"
    );


const emptyRecords =
    document.getElementById(
        "emptyRecords"
    );


/* =========================================================
   STATO
   ========================================================= */

let history = [];

let currentWorkoutFilter =
    "all";

let currentExercise =
    "";


/* =========================================================
   CARICA STORICO
   ========================================================= */

function loadHistory() {

    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    HISTORY_KEY
                )
            ) || [];

    } catch (error) {

        console.error(
            "Errore caricamento storico:",
            error
        );

        history = [];

    }


    /* Ordine cronologico */

    history.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );

}


/* =========================================================
   UTILITY
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   CONVERSIONE PESO
   ========================================================= */

function parseWeight(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return null;

    }


    const number =
        parseFloat(
            String(value)
                .replace(",", ".")
        );


    if (isNaN(number)) {

        return null;

    }


    if (number < 0) {

        return null;

    }


    return number;

}


/* =========================================================
   FORMATTA PESO
   ========================================================= */

function formatWeight(weight) {

    if (
        weight === null ||
        weight === undefined ||
        isNaN(weight)
    ) {

        return "—";

    }


    if (
        Number.isInteger(weight)
    ) {

        return `${weight} kg`;

    }


    return `${weight.toFixed(1)} kg`;

}


/* =========================================================
   FORMATTA DATA
   ========================================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "—";

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
   FORMATTA DATA BREVE
   ========================================================= */

function formatShortDate(dateString) {

    const date =
        new Date(dateString);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleDateString(
        "it-IT",
        {
            day: "2-digit",
            month: "2-digit"
        }
    );

}


/* =========================================================
   NOME MESE
   ========================================================= */

function formatMonth(dateString) {

    const date =
        new Date(dateString);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        "it-IT",
        {
            month: "short"
        }
    );

}


/* =========================================================
   ESTRAI TUTTI GLI ESERCIZI
   ========================================================= */

function getAllExercises() {

    const exercises = new Map();


    history.forEach(
        workout => {

            if (
                !Array.isArray(
                    workout.exercises
                )
            ) {

                return;

            }


            workout.exercises.forEach(
                (exercise, index) => {

                    const weight =
                        parseWeight(
                            exercise.weight
                        );


                    if (
                        weight === null
                    ) {

                        return;

                    }


                    const name =
                        exercise.name ||
                        `Esercizio ${index + 1}`;


                    const key =
                        normalizeName(name);


                    if (
                        !exercises.has(key)
                    ) {

                        exercises.set(
                            key,
                            {
                                name: name,
                                muscle:
                                    exercise.muscle || "",
                                workout:
                                    workout.workout || "",
                                workouts:
                                    new Set()
                            }
                        );

                    }


                    const data =
                        exercises.get(key);


                    if (
                        workout.workout
                    ) {

                        data.workouts.add(
                            workout.workout
                        );

                    }

                }
            );

        }
    );


    return Array.from(
        exercises.values()
    ).sort(
        (a, b) =>
            a.name.localeCompare(
                b.name,
                "it"
            )
    );

}


/* =========================================================
   NORMALIZZA NOME
   ========================================================= */

function normalizeName(name) {

    return String(name)
        .trim()
        .toLowerCase();

}


/* =========================================================
   ESERCIZI FILTRATI
   ========================================================= */

function getFilteredExercises() {

    const all =
        getAllExercises();


    if (
        currentWorkoutFilter === "all"
    ) {

        return all;

    }


    return all.filter(
        exercise => {

            return exercise.workouts.has(
                currentWorkoutFilter
            );

        }
    );

}


/* =========================================================
   POPOLA SELECT
   ========================================================= */

function populateExerciseSelect(
    preserveSelection = true
) {

    const previous =
        preserveSelection
            ? currentExercise
            : "";


    const exercises =
        getFilteredExercises();


    exerciseSelect.innerHTML = `

        <option value="">
            Seleziona esercizio
        </option>

    `;


    exercises.forEach(
        exercise => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                normalizeName(
                    exercise.name
                );


            option.textContent =
                exercise.name;


            exerciseSelect.appendChild(
                option
            );

        }
    );


    const exists =
        exercises.some(
            exercise =>
                normalizeName(
                    exercise.name
                ) === previous
        );


    if (exists) {

        currentExercise =
            previous;

        exerciseSelect.value =
            previous;

    } else {

        currentExercise = "";

        exerciseSelect.value = "";

    }


    updateProgressView();

}


/* =========================================================
   DATI ESERCIZIO
   ========================================================= */

function getExerciseHistory(
    exerciseName
) {

    const normalized =
        normalizeName(
            exerciseName
        );


    const result = [];


    history.forEach(
        workout => {

            if (
                !Array.isArray(
                    workout.exercises
                )
            ) {

                return;

            }


            workout.exercises.forEach(
                exercise => {

                    if (
                        normalizeName(
                            exercise.name
                        ) !== normalized
                    ) {

                        return;

                    }


                    const weight =
                        parseWeight(
                            exercise.weight
                        );


                    if (
                        weight === null
                    ) {

                        return;

                    }


                    result.push({

                        date:
                            workout.date,

                        workout:
                            workout.workout || "",

                        workoutName:
                            workout.name || "",

                        name:
                            exercise.name,

                        muscle:
                            exercise.muscle || "",

                        sets:
                            exercise.sets || "",

                        reps:
                            exercise.reps || "",

                        weight:
                            weight,

                        notes:
                            exercise.notes || ""

                    });

                }
            );

        }
    );


    result.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );


    return result;

}


/* =========================================================
   FILTRA STORICO ESERCIZIO PER SCHEDA
   ========================================================= */

function getSelectedExerciseHistory() {

    if (!currentExercise) {

        return [];

    }


    let result =
        getExerciseHistory(
            currentExercise
        );


    if (
        currentWorkoutFilter !== "all"
    ) {

        result =
            result.filter(
                item =>
                    item.workout ===
                    currentWorkoutFilter
            );

    }


    return result;

}


/* =========================================================
   STATISTICHE GENERALI
   ========================================================= */

function updateGeneralStats() {

    const uniqueExercises =
        new Set();


    const records =
        new Map();


    history.forEach(
        workout => {

            if (
                !Array.isArray(
                    workout.exercises
                )
            ) {

                return;

            }


            workout.exercises.forEach(
                exercise => {

                    const weight =
                        parseWeight(
                            exercise.weight
                        );


                    if (
                        weight === null
                    ) {

                        return;

                    }


                    const key =
                        normalizeName(
                            exercise.name
                        );


                    uniqueExercises.add(
                        key
                    );


                    if (
                        !records.has(key)
                    ) {

                        records.set(
                            key,
                            weight
                        );

                    } else if (
                        weight >
                        records.get(key)
                    ) {

                        records.set(
                            key,
                            weight
                        );

                    }

                }
            );

        }
    );


    totalWorkouts.textContent =
        history.length;


    trackedExercises.textContent =
        uniqueExercises.size;


    personalRecords.textContent =
        records.size;


    if (
        history.length > 0
    ) {

        const latest =
            history[
                history.length - 1
            ];


        lastWorkoutDate.textContent =
            formatDate(
                latest.date
            );


        lastWorkoutName.textContent =
            latest.name ||
            `Scheda ${latest.workout || ""}`;

    } else {

        lastWorkoutDate.textContent =
            "—";


        lastWorkoutName.textContent =
            "Nessun dato";

    }

}


/* =========================================================
   VIEW PROGRESSI
   ========================================================= */

function updateProgressView() {

    if (!currentExercise) {

        emptyProgress.classList.remove(
            "hidden"
        );

        progressContent.classList.add(
            "hidden"
        );

        return;

    }


    const data =
        getSelectedExerciseHistory();


    if (
        data.length === 0
    ) {

        emptyProgress.classList.remove(
            "hidden"
        );

        progressContent.classList.add(
            "hidden"
        );

        return;

    }


    emptyProgress.classList.add(
        "hidden"
    );

    progressContent.classList.remove(
        "hidden"
    );


    renderExerciseHeader(
        data
    );


    renderExerciseStats(
        data
    );


    renderChart(
        data
    );


    renderHistory(
        data
    );

}


/* =========================================================
   HEADER ESERCIZIO
   ========================================================= */

function renderExerciseHeader(
    data
) {

    const first =
        data[0];


    selectedExerciseName.textContent =
        first.name;


    selectedMuscle.textContent =
        first.muscle ||
        "Esercizio";


    if (
        currentWorkoutFilter === "all"
    ) {

        const workouts =
            Array.from(
                new Set(
                    data
                        .map(
                            item =>
                                item.workout
                        )
                        .filter(Boolean)
                )
            );


        selectedWorkout.textContent =
            workouts.length === 1
                ? workouts[0]
                : "A/B/C";

    } else {

        selectedWorkout.textContent =
            currentWorkoutFilter;

    }

}


/* =========================================================
   STATISTICHE ESERCIZIO
   ========================================================= */

function renderExerciseStats(
    data
) {

    const firstWeight =
        data[0].weight;


    const latestWeight =
        data[
            data.length - 1
        ].weight;


    const bestWeight =
        Math.max(
            ...data.map(
                item =>
                    item.weight
            )
        );


    const variation =
        latestWeight -
        firstWeight;


    lastWeight.textContent =
        formatWeight(
            latestWeight
        );


    recordWeight.textContent =
        formatWeight(
            bestWeight
        );


    sessionCount.textContent =
        data.length;


    weightVariation.classList.remove(
        "negative"
    );


    if (
        data.length < 2
    ) {

        weightVariation.textContent =
            "—";

        return;

    }


    if (
        variation > 0
    ) {

        weightVariation.textContent =
            `+${formatWeight(
                variation
            )}`;

    } else if (
        variation < 0
    ) {

        weightVariation.classList.add(
            "negative"
        );

        weightVariation.textContent =
            formatWeight(
                variation
            );

    } else {

        weightVariation.textContent =
            "0 kg";

    }

}


/* =========================================================
   GRAFICO
   ========================================================= */

function renderChart(
    data
) {

    const canvas =
        progressChart;


    const wrapper =
        canvas.parentElement;


    const rect =
        wrapper.getBoundingClientRect();


    const width =
        Math.max(
            300,
            Math.floor(
                rect.width -
                36
            )
        );


    const height =
        Math.max(
            180,
            Math.floor(
                rect.height -
                33
            )
        );


    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        width * dpr;


    canvas.height =
        height * dpr;


    canvas.style.width =
        `${width}px`;


    canvas.style.height =
        `${height}px`;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    if (
        data.length < 2
    ) {

        chartEmpty.style.display =
            "flex";

        chartPeriod.textContent =
            "1 sessione";

        return;

    }


    chartEmpty.style.display =
        "none";


    chartPeriod.textContent =
        `${data.length} sessioni`;


    const padding = {

        left: 45,

        right: 20,

        top: 20,

        bottom: 35

    };


    const chartWidth =
        width -
        padding.left -
        padding.right;


    const chartHeight =
        height -
        padding.top -
        padding.bottom;


    const weights =
        data.map(
            item =>
                item.weight
        );


    let minWeight =
        Math.min(
            ...weights
        );


    let maxWeight =
        Math.max(
            ...weights
        );


    if (
        minWeight === maxWeight
    ) {

        minWeight -= 5;

        maxWeight += 5;

    } else {

        const range =
            maxWeight -
            minWeight;


        minWeight -=
            range * 0.15;


        maxWeight +=
            range * 0.15;

    }


    /* =========================================
       GRID
    ========================================== */

    ctx.strokeStyle =
        "#f0eef5";

    ctx.lineWidth =
        1;


    ctx.fillStyle =
        "#a1a1aa";

    ctx.font =
        "9px Inter, sans-serif";


    const gridLines =
        4;


    for (
        let i = 0;
        i <= gridLines;
        i++
    ) {

        const y =
            padding.top +
            (
                chartHeight /
                gridLines
            ) * i;


        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width -
            padding.right,
            y
        );

        ctx.stroke();


        const value =
            maxWeight -
            (
                (
                    maxWeight -
                    minWeight
                ) /
                gridLines
            ) * i;


        ctx.fillText(
            formatAxisWeight(
                value
            ),
            5,
            y + 3
        );

    }


    /* =========================================
       POINTS
    ========================================== */

    const points =
        data.map(
            (item, index) => {

                const x =
                    data.length === 1

                        ? padding.left +
                          chartWidth / 2

                        : padding.left +
                          (
                            index /
                            (data.length - 1)
                          ) *
                          chartWidth;


                const normalized =
                    (
                        item.weight -
                        minWeight
                    ) /
                    (
                        maxWeight -
                        minWeight
                    );


                const y =
                    padding.top +
                    chartHeight -
                    normalized *
                    chartHeight;


                return {
                    x,
                    y,
                    item
                };

            }
        );


    /* =========================================
       AREA
    ========================================== */

    const gradient =
        ctx.createLinearGradient(
            0,
            padding.top,
            0,
            padding.top +
            chartHeight
        );


    gradient.addColorStop(
        0,
        "rgba(124,58,237,0.18)"
    );


    gradient.addColorStop(
        1,
        "rgba(124,58,237,0)"
    );


    ctx.beginPath();


    ctx.moveTo(
        points[0].x,
        padding.top +
        chartHeight
    );


    points.forEach(
        point => {

            ctx.lineTo(
                point.x,
                point.y
            );

        }
    );


    ctx.lineTo(
        points[
            points.length - 1
        ].x,
        padding.top +
        chartHeight
    );


    ctx.closePath();


    ctx.fillStyle =
        gradient;


    ctx.fill();


    /* =========================================
       LINE
    ========================================== */

    ctx.beginPath();


    points.forEach(
        (point, index) => {

            if (
                index === 0
            ) {

                ctx.moveTo(
                    point.x,
                    point.y
                );

            } else {

                ctx.lineTo(
                    point.x,
                    point.y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#7c3aed";

    ctx.lineWidth =
        2.5;

    ctx.lineJoin =
        "round";

    ctx.lineCap =
        "round";

    ctx.stroke();


    /* =========================================
       POINTS
    ========================================== */

    points.forEach(
        point => {

            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                4,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ffffff";

            ctx.fill();


            ctx.strokeStyle =
                "#7c3aed";

            ctx.lineWidth =
                2;

            ctx.stroke();

        }
    );


    /* =========================================
       DATE
    ========================================== */

    ctx.fillStyle =
        "#a1a1aa";

    ctx.font =
        "8px Inter, sans-serif";


    points.forEach(
        (point, index) => {

            let label =
                formatShortDate(
                    point.item.date
                );


            if (
                data.length > 8 &&
                index %
                Math.ceil(
                    data.length / 6
                ) !== 0 &&
                index !==
                data.length - 1
            ) {

                return;

            }


            ctx.textAlign =
                "center";


            ctx.fillText(
                label,
                point.x,
                height - 10
            );

        }
    );


    ctx.textAlign =
        "start";


    /* =========================================
       VALORE SULL'ULTIMO PUNTO
    ========================================== */

    const last =
        points[
            points.length - 1
        ];


    ctx.font =
        "700 9px Inter, sans-serif";


    ctx.fillStyle =
        "#7c3aed";


    ctx.textAlign =
        "center";


    ctx.fillText(
        formatWeight(
            last.item.weight
        ),
        last.x,
        last.y - 11
    );


    ctx.textAlign =
        "start";

}


/* =========================================================
   FORMATTA PESO ASSE
   ========================================================= */

function formatAxisWeight(
    value
) {

    if (
        Math.abs(
            value -
            Math.round(value)
        ) < 0.01
    ) {

        return `${Math.round(value)}`;

    }


    return value.toFixed(1);

}


/* =========================================================
   STORICO
   ========================================================= */

function renderHistory(
    data
) {

    const reversed =
        [...data].reverse();


    historyCount.textContent =
        `${data.length} ${
            data.length === 1
                ? "sessione"
                : "sessioni"
        }`;


    historyList.innerHTML =
        "";


    reversed.forEach(
        item => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "history-row";


            const note =
                item.notes
                    ? escapeHTML(
                        item.notes
                    )
                    : "Nessuna nota";


            row.innerHTML = `

                <div class="history-date">

                    <strong>
                        ${formatDate(item.date)}
                    </strong>

                    <span>
                        Scheda ${escapeHTML(
                            item.workout || "—"
                        )}
                    </span>

                </div>


                <div class="history-column">

                    <span>
                        SERIE
                    </span>

                    <strong>
                        ${escapeHTML(
                            String(
                                item.sets || "—"
                            )
                        )}
                    </strong>

                </div>


                <div class="history-column">

                    <span>
                        CARICO
                    </span>

                    <strong class="history-weight">
                        ${formatWeight(
                            item.weight
                        )}
                    </strong>

                </div>


                <div class="history-column">

                    <span>
                        NOTE
                    </span>

                    <strong
                        class="history-note"
                        title="${note}"
                    >
                        ${note}
                    </strong>

                </div>

            `;


            historyList.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   RECORD PERSONALI
   ========================================================= */

function renderRecords() {

    const records =
        new Map();


    history.forEach(
        workout => {

            if (
                !Array.isArray(
                    workout.exercises
                )
            ) {

                return;

            }


            workout.exercises.forEach(
                exercise => {

                    const weight =
                        parseWeight(
                            exercise.weight
                        );


                    if (
                        weight === null
                    ) {

                        return;

                    }


                    const key =
                        normalizeName(
                            exercise.name
                        );


                    if (
                        !records.has(key)
                    ) {

                        records.set(
                            key,
                            {

                                name:
                                    exercise.name,

                                muscle:
                                    exercise.muscle || "",

                                weight:
                                    weight,

                                date:
                                    workout.date,

                                workout:
                                    workout.workout || "",

                                reps:
                                    exercise.reps || ""

                            }
                        );

                    } else {

                        const current =
                            records.get(
                                key
                            );


                        if (
                            weight >
                            current.weight
                        ) {

                            records.set(
                                key,
                                {

                                    name:
                                        exercise.name,

                                    muscle:
                                        exercise.muscle || "",

                                    weight:
                                        weight,

                                    date:
                                        workout.date,

                                    workout:
                                        workout.workout || "",

                                    reps:
                                        exercise.reps || ""

                                }
                            );

                        }

                    }

                }
            );

        }
    );


    const sortedRecords =
        Array.from(
            records.values()
        ).sort(
            (a, b) =>
                b.weight -
                a.weight
        );


    recordsGrid.innerHTML =
        "";


    if (
        sortedRecords.length === 0
    ) {

        recordsGrid.style.display =
            "none";

        emptyRecords.style.display =
            "block";

        return;

    }


    recordsGrid.style.display =
        "grid";

    emptyRecords.style.display =
        "none";


    sortedRecords.forEach(
        record => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "record-card";


            card.innerHTML = `

                <div class="record-icon">

                    <i class="fa-solid fa-trophy"></i>

                </div>


                <div class="record-info">

                    <span>
                        ${escapeHTML(
                            record.muscle ||
                            "ESERCIZIO"
                        )}
                    </span>

                    <h3>
                        ${escapeHTML(
                            record.name
                        )}
                    </h3>

                    <small>
                        Scheda ${escapeHTML(
                            record.workout || "—"
                        )}
                        ·
                        ${formatDate(
                            record.date
                        )}
                    </small>

                </div>


                <strong class="record-weight">

                    ${formatWeight(
                        record.weight
                    )}

                </strong>

            `;


            recordsGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   EVENTO SELECT
   ========================================================= */

exerciseSelect.addEventListener(
    "change",
    () => {

        currentExercise =
            exerciseSelect.value;


        updateProgressView();

    }
);


/* =========================================================
   EVENTI FILTRO SCHEDE
   ========================================================= */

workoutFilters.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                workoutFilters.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentWorkoutFilter =
                    button.dataset.workout;


                populateExerciseSelect(
                    false
                );

            }
        );

    }
);


/* =========================================================
   RIDISEGNA GRAFICO AL RESIZE
   ========================================================= */

let resizeTimeout;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimeout
        );


        resizeTimeout =
            setTimeout(
                () => {

                    if (
                        currentExercise
                    ) {

                        const data =
                            getSelectedExerciseHistory();


                        if (
                            data.length > 0
                        ) {

                            renderChart(
                                data
                            );

                        }

                    }

                },
                150
            );

    }
);


/* =========================================================
   INIZIALIZZAZIONE
   ========================================================= */

function init() {

    loadHistory();

    updateGeneralStats();

    renderRecords();

    populateExerciseSelect(
        false
    );


    /* Se esiste almeno un esercizio,
       seleziona automaticamente il primo */

    const exercises =
        getFilteredExercises();


    if (
        exercises.length > 0
    ) {

        currentExercise =
            normalizeName(
                exercises[0].name
            );


        exerciseSelect.value =
            currentExercise;


        updateProgressView();

    }

}


init();