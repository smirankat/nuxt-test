<template>
  <div class="btc">
    <h1>Bitcoin prices</h1>
    <div class="time-selector">
      <div class="today">
        <div>
          <span>Today:&nbsp; </span><span>{{ today }}</span>
        </div>
        <div>
          <span>Price:&nbsp; </span><span>{{ todayRate }}</span>
        </div>
      </div>
      <div class="week-month-year">
        <div>
          <button @click="weekHandler">week</button>
        </div>
        <div>
          <button @click="monthHandler">month</button>
        </div>
        <div>
          <button @click="yearHandler">year</button>
        </div>
      </div>
      <div class="time-frame">
        <div>
          <label for="start">Start date:</label>
          <input type="date" id="start" min="2014-01-01" ref="refStartDate" />
        </div>
        <div>
          <label for="end">End date:</label>
          <input type="date" id="end" ref="refEndDate" />
        </div>
        <div>
          <div>{{ dateAlert }}</div>
          <button class="show" @click="dateHandler">Show selected dates</button>
        </div>
      </div>
    </div>
    <div class="chat-box">
      <canvas ref="refCanvas"></canvas>
    </div>
  </div>
</template>

<!-- <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> -->
<script setup>
import { ref, computed } from "vue";
import { Chart } from "chart.js/auto";

const refStartDate = ref();
const refEndDate = ref();
const refCanvas = ref();
const dateAlert = ref();

const { data: pricesObj } = await useFetch("/api/bitcoin");
const prices = pricesObj.value;
const today = new Date().toISOString().split("T")[0];
const todayRate =
  prices.at(-1).date.substr(0, 10) == today
    ? prices.at(-1).price.slice(0, -1)
    : "Today data is not available yet";
let color = "";
if (todayRate === "Today data is not available yet") {
  color = ref("Wheat");
}

let selectedPrices = prices.slice(-90);
let chart;

const createLineChart = () => {
  if (chart) chart.destroy();
  chart = new Chart(refCanvas.value, {
    type: "line",
    data: {
      labels: selectedPrices.map((row) => row.date.substr(0, 10)),
      datasets: [
        {
          label: "Bitcoin chart",
          data: selectedPrices.map((row) => row.price.replace(",", "")),
          pointStyle: false,
          fill: true,
          borderWidth: 1,
          borderColor: "#FF0000",
          tension: 0.2,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            boxWidth: 0,
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    },
  });
};
onMounted(() => {
  createLineChart();
});

const weekHandler = () => {
  selectedPrices = prices.slice(-7);
  createLineChart();
};
const monthHandler = () => {
  selectedPrices = prices.slice(-30);
  createLineChart();
};
const yearHandler = () => {
  selectedPrices = prices.slice(-365);
  createLineChart();
};

const dateHandler = () => {
  if (!refStartDate.value.value || !refEndDate.value.value) {
    dateAlert.value = "Please enter dates";
  } else {
    dateAlert.value = "";
  }
  const startIndex = prices.findIndex(
    (item) => item.date.substr(0, 10) == refStartDate.value.value
  );
  const endIndex = prices.findIndex(
    (item) => item.date.substr(0, 10) == refEndDate.value.value
  );

  selectedPrices = prices.slice(startIndex, endIndex + 1);
  createLineChart();
  refStartDate.value.value = "";
  refEndDate.value.value = "";
};
</script>

<style scoped>
.btc {
  max-width: 1920px;
  width: 100%;
  min-height: 100vh;
  margin: auto;
  background: gray;
  padding: 15px;
}
h1 {
  text-align: center;
  padding: 30px;
}
.time-selector {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.today {
  font-size: 20px;
}
.today div:last-child span:last-child {
  color: v-bind(color);
}
.week-month-year {
  display: flex;
}
input[type="date"] {
  background: DarkCyan;
  color: #fff;
  border-radius: 5px;
  border: 0;
  outline: none;
  font-size: 16px;
  padding: 5px;
  margin: 3px;
  text-transform: uppercase;
  cursor: pointer;
}
input[type="date"]:hover {
  background: CadetBlue;
}
button {
  border: 0;
  line-height: 2.5;
  padding: 0 20px;
  font-size: 1rem;
  text-align: center;
  color: #fff;
  text-shadow: 1px 1px 1px #000;
  border-radius: 10px;
  background-color: rgb(220 0 0 / 100%);
  background-image: linear-gradient(
    to top left,
    rgb(0 0 0 / 20%),
    rgb(0 0 0 / 20%) 30%,
    rgb(0 0 0 / 0%)
  );
  box-shadow: inset 2px 2px 3px rgb(255 255 255 / 60%),
    inset -2px -2px 3px rgb(0 0 0 / 60%);
  cursor: pointer;
  margin: 3px;
}

button:hover {
  background-color: rgb(255 0 0 / 100%);
}

button:active {
  box-shadow: inset -2px -2px 3px rgb(255 255 255 / 60%),
    inset 2px 2px 3px rgb(0 0 0 / 60%);
}

.time-frame {
  border-radius: 5px;
  padding: 3px;
}
.time-frame div:last-child div {
  color: Wheat;
}
.chat-box {
  height: 60vh;
}
canvas {
  background: white;
  border-radius: 10px;
  padding: 15px;
}
</style>
