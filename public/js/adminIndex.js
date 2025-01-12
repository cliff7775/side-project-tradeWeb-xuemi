//查詢熱門商品銷售數
//查詢類別商品總銷售數
//查詢前5名類別熱門商品

let topSaleProductChart;
let topSaleCategoryChart;
let calculateTradePriceUserChart;
let topSaleCategoryProductChart;
const topSaleProductChartElm = document.querySelector("#topSaleProductChart");
const topSaleCategoryChartElm = document.querySelector("#topSaleCategoryChart");
const calculateTradePriceUserChartElm = document.querySelector(
  "#calculateTradePriceUserChart"
);
const topSaleCategoryProductChartElm = document.querySelector(
  "#topSaleCategoryProductChart"
);

function createSaleProductCustomLineChart(start, end) {
  const productNameLabels = []; // 設置 X 軸上對應標籤
  const productQuantityLabels = []; // 設置 Y 軸上對應標籤
  const topSaleProductNameElmList = document.querySelectorAll("#productName");
  topSaleProductNameElmList.forEach((item) => {
    productNameLabels.push(item.innerText);
  });
  const topSaleProductQuantityElmList =
    document.querySelectorAll("#productQuantity");
  topSaleProductQuantityElmList.forEach((item) => {
    const value = item.innerText;
    if (!value) {
      productQuantityLabels.push(0);
    } else {
      productQuantityLabels.push(value);
    }
  });
  document.querySelector("#topSaleProductResult").innerHTML = "";

  const data = {
    labels: productNameLabels,
    datasets: [
      {
        data: productQuantityLabels,
        label: "銷售數前10商品",
        backgroundColor: [
          // 设置每个柱形图的背景颜色
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
          "rgba(31, 219, 188, 0.2)",
          "rgba(207, 191, 44, 0.2)",
          "rgba(252, 103, 227, 0.2)",
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)", // 设置线的颜色
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "bar", //圖表類型
    data: data,
    options: {
      responsive: true,
    },
  };
  return config;
}

function createSaleCategoryCustomLineChart(start, end) {
  const categoryNameLabels = []; // 設置 X 軸上對應標籤
  const categoryProductQuantityLabels = []; // 設置 Y 軸上對應標籤
  const categoryIDNameElmList = document.querySelectorAll("#categoryIDName");
  const categoryIDProductQuantityElmList = document.querySelectorAll(
    "#categoryIDProductQuantity"
  );

  categoryIDNameElmList.forEach((item) => {
    categoryNameLabels.push(item.innerText);
  });
  categoryIDProductQuantityElmList.forEach((item) => {
    const value = item.innerText;
    if (!value) {
      categoryProductQuantityLabels.push(0);
    } else {
      categoryProductQuantityLabels.push(value);
    }
  });
  document.querySelector("#categorySaleProductResult").innerHTML = "";
  const data = {
    labels: categoryNameLabels,
    datasets: [
      {
        data: categoryProductQuantityLabels,
        label: "各類別商品銷售總數",
        backgroundColor: [
          // 设置每个柱形图的背景颜色
          "rgba(255, 99, 132, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(252, 103, 227, 0.2)",
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)", // 设置线的颜色
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "bar", //圖表類型
    data: data,
    options: {
      responsive: true,
    },
  };
  return config;
}

function createCalculateTradePriceUserCustomLineChart() {
  const calculatePriceNameLabels = []; // 設置 X 軸上對應標籤
  const calculatePriceNumLabels = []; // 設置 Y 軸上對應標籤
  const calculatePriceNameElmList = document.querySelectorAll(
    "#calculatePriceName"
  );
  const calculatePriceNumElmList =
    document.querySelectorAll("#calculatePriceNum");

  calculatePriceNameElmList.forEach((item) => {
    calculatePriceNameLabels.push(item.innerText);
  });
  calculatePriceNumElmList.forEach((item) => {
    const value = item.innerText;
    if (!value) {
      calculatePriceNumLabels.push(0);
    } else {
      calculatePriceNumLabels.push(value);
    }
  });
  document.querySelector("#heightCalculatePriceUsersResult").innerHTML = "";
  const data = {
    labels: calculatePriceNameLabels,
    datasets: [
      {
        data: calculatePriceNumLabels,
        label: "前三名用戶訂單金額累積",
        backgroundColor: [
          // 设置每个柱形图的背景颜色
          "rgba(252, 103, 227, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)", // 设置线的颜色
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "bar", //圖表類型
    data: data,
    options: {
      responsive: true,
    },
  };
  return config;
}

function createSaleCategoryProductCustomLineChart() {
  const categoryProductNameLabels = []; // 設置 X 軸上對應標籤
  const categoryProductQuantityLabels = []; // 設置 Y 軸上對應標籤
  const categoryProductNameElmList = document.querySelectorAll(
    "#categoryProductName"
  );
  const categoryProductQuantityElmList = document.querySelectorAll(
    "#categoryProductQuantity"
  );

  categoryProductNameElmList.forEach((item) => {
    categoryProductNameLabels.push(item.innerText);
  });
  categoryProductQuantityElmList.forEach((item) => {
    const value = item.innerText;
    if (!value) {
      categoryProductQuantityLabels.push(0);
    } else {
      categoryProductQuantityLabels.push(value);
    }
  });
  document.querySelector("#topSaleCategoryProductResult").innerHTML = "";
  const data = {
    labels: categoryProductNameLabels,
    datasets: [
      {
        data: categoryProductQuantityLabels,
        label: "指定類別商品銷售總數",
        backgroundColor: [
          // 设置每个柱形图的背景颜色
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(252, 103, 227, 0.2)",
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)", // 设置线的颜色
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "bar", //圖表類型
    data: data,
    options: {
      responsive: true,
    },
  };
  return config;
}

const saleProductConfig = createSaleProductCustomLineChart();
const saleCategoryConfig = createSaleCategoryCustomLineChart();
const calculateTradePriceUserConfig =
  createCalculateTradePriceUserCustomLineChart();
const saleCategoryProductConfig = createSaleCategoryProductCustomLineChart();
topSaleProductChart = new Chart(topSaleProductChartElm, saleProductConfig);
topSaleCategoryChart = new Chart(topSaleCategoryChartElm, saleCategoryConfig);
calculateTradePriceUserChart = new Chart(
  calculateTradePriceUserChartElm,
  calculateTradePriceUserConfig
);
topSaleCategoryProductChart = new Chart(
  topSaleCategoryProductChartElm,
  saleCategoryProductConfig
);
