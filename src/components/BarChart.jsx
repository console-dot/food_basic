import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

const BarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: 'bar', // Change to 'bar' for a bar chart
        data: {
          labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
          datasets: [
            {
              label: 'Sales Over Time',
              data: [30, 45, 70, 90, 120], // Data points
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
              borderColor: 'rgba(75, 192, 192, 1)', // Border color
              borderWidth: 1, // Border width
            },
          ],
        },
        options: {
          responsive: true, // Make chart responsive
          scales: {
            y: {
              beginAtZero: true, // Start Y-axis from zero
            },
          },
        },
      });
    }
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default BarChart;
