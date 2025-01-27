import { format } from "date-fns";
import { sl } from "date-fns/locale";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { IDataResponse } from "../../hooks/useData/useData";

// Register Chart.js components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface IChartOptions {
  price: boolean;
  cons: boolean;
  prod: boolean;
}

interface IMainChartProps {
  data: IDataResponse;
  options: IChartOptions;
}

const MainChart = ({
  data,
  options: { price = true, cons = true, prod = true },
}: IMainChartProps) => {
  // Extract labels and dataset values from the data
  const labels = data.map((item) =>
    format(new Date(item.timestamp), "dd. MMM yy, HH:mm", { locale: sl })
  );
  const consData = data.map((item) => parseFloat(item.cons));
  const prodData = data.map((item) => parseFloat(item.prod));
  const priceData = data.map((item) => parseFloat(item.price));

  // Data for the chart
  const datasets = [
    {
      type: "bar" as const,
      label: "Poraba",
      data: consData,
      backgroundColor: "rgba(241,90,34, 1)",
      hoverBackgroundColor: "rgba(199,75,30, 1)",
      borderRadius: { topLeft: 10, topRight: 10 },
      yAxisID: "y",
      hidden: !cons, // Hide if cons is false
    },
    {
      type: "bar" as const,
      label: "Proizvodnja",
      data: prodData,
      hoverBackgroundColor: "rgba(219,163,159, 1)",
      backgroundColor: "rgba(150,6,112, 1)",
      borderRadius: { topLeft: 10, topRight: 10 },
      yAxisID: "y",
      hidden: !prod, // Hide if prod is false
    },
    {
      type: "line" as const,
      label: "Cena",
      data: priceData,
      backgroundColor: "rgba(255,191,161, 1)",
      borderColor: "rgba(255,191,161, 1)",
      borderWidth: 2,
      fill: false,
      yAxisID: "y2",
      hidden: !price, // Hide if price is false
    },
  ];

  const chartData: ChartData<"bar" | "line"> = {
    labels: labels,
    datasets: datasets.filter((dataset) => !dataset.hidden), // Filter out hidden datasets
  };

  // Options for the chart
  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to control size manually
    interaction: {
      mode: "index", // Allow interaction with multiple datasets
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "Inter", // Apply Inter font to legend labels
            size: window.innerWidth < 768 ? 12 : 14, // Smaller font on mobile
          },
        },
      },
      title: {
        display: true,
        text: "Poraba energije, proizvodnja energije in cena",
        font: {
          family: "Inter", // Apply Inter font to title
          size: window.innerWidth < 768 ? 14 : 16, // Smaller font on mobile
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            // Use the full date and time in the tooltip title
            const date = new Date(data[context[0].dataIndex].timestamp);
            return format(date, "dd. MMMM yyyy, HH:mm", { locale: sl });
          },
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;

            if (value !== null) {
              let tooltipText = `${label}: ${value.toFixed(2)}`;

              if (label === "Cena") {
                tooltipText += " €";
              } else {
                tooltipText += " kWh";
              }

              // Add euro value for cons and prod datasets
              if (label === "Poraba" || label === "Proizvodnja") {
                const price = priceData[context.dataIndex]; // Get the price for the current index
                const euroValue = value * price; // Calculate the euro value
                tooltipText += ` (${euroValue.toFixed(2)} €)`;
              }

              return tooltipText;
            }
            return label;
          },
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 12 : 14, // Smaller font on mobile
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Poraba / Proizvodnja (kWh)",
          font: {
            family: "Inter", // Apply Inter font to axis title
            size: window.innerWidth < 768 ? 12 : 14, // Smaller font on mobile
          },
        },
        beginAtZero: true,
      },
      y2: {
        type: "linear",
        display: price, // Hide y2 axis if price is hidden
        position: "right",
        title: {
          display: true,
          text: "Cena (€)",
          font: {
            family: "Inter", // Apply Inter font to axis title
            size: window.innerWidth < 768 ? 12 : 14, // Smaller font on mobile
          },
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "400px",
        height: "60vh",
        marginInline: "auto",
      }}
    >
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
};

export default MainChart;
