// ==============================
// GRAFICO PESO CORPOREO
// ==============================

const canvas = document.getElementById("weightChart");
const ctx = canvas.getContext("2d");

const weights = [
    47.0,
    47.2,
    47.1,
    47.3,
    47.5,
    47.4,
    47.7,
    47.6,
    47.8,
    47.9,
    48.0
];

const labels = [
    "01/05",
    "08/05",
    "15/05",
    "22/05",
    "29/05",
    "05/06",
    "12/06",
    "19/06",
    "26/06",
    "03/07",
    "10/07"
];


function drawChart() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);


    // Margini

    const paddingLeft = 45;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 35;


    const chartWidth =
        width - paddingLeft - paddingRight;

    const chartHeight =
        height - paddingTop - paddingBottom;


    const minWeight = 46;
    const maxWeight = 49;


    // ==========================
    // GRIGLIA
    // ==========================

    ctx.font = "10px Inter";
    ctx.fillStyle = "#999";

    for (let i = 0; i <= 3; i++) {

        const value = minWeight + i;

        const y =
            paddingTop +
            chartHeight -
            (i / 3) * chartHeight;


        ctx.strokeStyle = "#eee";

        ctx.beginPath();

        ctx.moveTo(paddingLeft, y);

        ctx.lineTo(
            width - paddingRight,
            y
        );

        ctx.stroke();


        ctx.fillText(
            value.toFixed(0),
            10,
            y + 4
        );
    }


    // ==========================
    // PUNTI
    // ==========================

    const points = weights.map((weight, index) => {

        const x =
            paddingLeft +
            (index / (weights.length - 1)) *
            chartWidth;


        const y =
            paddingTop +
            chartHeight -
            ((weight - minWeight) /
            (maxWeight - minWeight)) *
            chartHeight;


        return {
            x,
            y
        };

    });


    // ==========================
    // AREA
    // ==========================

    const gradient = ctx.createLinearGradient(
        0,
        paddingTop,
        0,
        height
    );

    gradient.addColorStop(
        0,
        "rgba(124,58,237,0.25)"
    );

    gradient.addColorStop(
        1,
        "rgba(124,58,237,0)"
    );


    ctx.beginPath();

    ctx.moveTo(
        points[0].x,
        height - paddingBottom
    );


    points.forEach(point => {

        ctx.lineTo(
            point.x,
            point.y
        );

    });


    ctx.lineTo(
        points[points.length - 1].x,
        height - paddingBottom
    );

    ctx.closePath();

    ctx.fillStyle = gradient;

    ctx.fill();


    // ==========================
    // LINEA
    // ==========================

    ctx.beginPath();

    points.forEach((point, index) => {

        if (index === 0) {

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

    });


    ctx.strokeStyle = "#7c3aed";

    ctx.lineWidth = 2.5;

    ctx.stroke();


    // ==========================
    // PUNTI
    // ==========================

    points.forEach(point => {

        ctx.beginPath();

        ctx.arc(
            point.x,
            point.y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#7c3aed";

        ctx.fill();

    });


    // ==========================
    // DATE
    // ==========================

    ctx.fillStyle = "#999";

    ctx.font = "9px Inter";

    labels.forEach((label, index) => {

        const x =
            paddingLeft +
            (index / (labels.length - 1)) *
            chartWidth;


        ctx.fillText(
            label,
            x - 15,
            height - 10
        );

    });

}


// Disegna il grafico

drawChart();


// Ridimensionamento finestra

window.addEventListener(
    "resize",
    drawChart
);


// ==============================
// DARK MODE
// ==============================

const themeButton =
    document.getElementById("themeButton");


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);