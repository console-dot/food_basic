import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import { FiAlignJustify } from "react-icons/fi";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Function to get years dynamically
const getYears = (startYear, endYear) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  return years;
};
export const Dashboard = () => {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState("year"); // Default to 'year'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );



  const getMonthlySale = async () => {
    try {
      const res = await fetch("https://api-food-basic.vercel.app/api/v1/sale/yearly-sale");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setChartData(data?.data || []);
      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMonthlySale();
  }, []);
  const getCurrentWeekDates = () => {
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay()); // Sunday

    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6); // Saturday

    return {
      start: firstDay.toISOString().split("T")[0], // Format YYYY-MM-DD
      end: lastDay.toISOString().split("T")[0],
    };
  };

  const updateData = () => {
    if (selectedPeriod === "year") {
      setData(chartData?.year[selectedYear] || []);
    } else if (selectedPeriod === "month") {
      const checkYear = chartData?.year[selectedYear];
      if (checkYear) {
        setData(chartData?.month[selectedMonth] || []);
      } else {
        setData([]);
      }
    } else if (selectedPeriod === "weekly") {
      const { start, end } = getCurrentWeekDates();
      fetchWeeklySales(start, end);

      // Filter the data within the current week range
      const weeklyData = chartData?.daily?.filter((item) => {
        return item.date >= start && item.date <= end;
      });

      setData(weeklyData || []);
    }
  };

  const fetchWeeklySales = async (startDate, endDate) => {
    try {
      const res = await fetch(
        `https://api-food-basic.vercel.app/api/v1/sale/weekly?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      console.log(data.data);
      setData(data.data);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  };

  useEffect(() => {
    if (chartData) {
      updateData(); // Update data whenever selectedPeriod, selectedYear, or selectedMonth changes
    }
  }, [selectedPeriod, chartData, selectedYear, selectedMonth]);

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value); // Update the selected period
  };

  const handleYearChange = (value) => {
    setSelectedYear(parseInt(value)); // Update the selected year
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value); // Update the selected month
  };
  useEffect(() => {
    console.log(data);
  }, [data]);

  const chartConfig = {
    sale: {
      label: "Sale",
      color: "hsl(var(--chart-1))",
    },
    purchase: {
      label: "Purchase",
      color: "hsl(var(--chart-2))",
    },
    expense: {
      label: "expense",
      color: "hsl(var(--chart-3))",
    },
  };

  const years = getYears(2000, new Date().getFullYear());

 

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-[#E8E8E8] p-4 relative">
        
        <img src="logo512.png" className="h-28 md:h-40" alt="logo" />
        <div className="flex flex-col md:flex-row w-full md:w-[70%] gap-4  ">
          <button
            className="md:px-4 w-full  p-5 md:py-2 bg-[#929192] text-white  rounded-lg shadow transition"
            onClick={() => navigate(`/today-purchase`)}
          >
            Today Purchase
          </button>
          <button
            className="md:px-4 w-full  p-5 md:py-2 bg-[#929192] text-white rounded-lg shadow  transition"
            onClick={() => navigate(`/today-expense`)}
          >
            Today Expense
          </button>
          <button
            className="md:px-4  w-full p-5 md:py-2 bg-[#929192] text-white rounded-lg shadow transition"
            onClick={() => navigate(`/today-sales`)}
          >
            Sale
          </button>
        </div>
        <Card className=" bg-white shadow-sm mt-10  border-none w-full md:w-[70%]">
          <CardHeader className="p-4">
            <div className="flex flex-col justify-between relative">
              <CardTitle>Sales Chart</CardTitle>
              <div className=" flex items-end justify-end mt-3 gap-2">
                {/* Period Selector */}
                <Select
                  className="text-[10px]"
                  onValueChange={handlePeriodChange}
                  value={selectedPeriod}
                >
                  <SelectTrigger className="w-[75px] h-[30px] text-[10px] p-1">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white min-w-0 max-w-[75px]">
                    <SelectItem value="year" className="text-[10px] ">
                      Year
                    </SelectItem>
                    <SelectItem value="month" className="text-[10px] ">
                      Month
                    </SelectItem>
                    <SelectItem value="weekly" className="text-[10px] ">
                      Weekly
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Year Selector */}
                {selectedPeriod !== "weekly" && (
                  <Select
                    onValueChange={handleYearChange}
                    value={selectedYear.toString()}
                  >
                    <SelectTrigger className="w-[70px] h-[30px] text-[10px] p-1">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white min-w-0 max-w-[70px] h-[150px]">
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                          className="text-[10px]"
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Month Selector */}
                {selectedPeriod === "month" && (
                  <Select
                    onValueChange={handleMonthChange}
                    value={selectedMonth}
                  >
                    <SelectTrigger className="w-[90px] h-[30px] text-[10px] p-1">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="bg-white min-w-0 max-w-[90px] p-0 h-[150px]">
                      {months.map((month) => (
                        <SelectItem
                          key={month}
                          value={month}
                          className="text-[10px]"
                        >
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto p-4 h-[250px]">
            <ChartContainer
              config={chartConfig}
              style={{
                width: data?.length ? data.length * 110 : "100%",
                minWidth: "100%",
              }}
              className="h-[100%]"
            >
              <BarChart
                data={data}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                barCategoryGap="13%"
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3"
                  style={{ overflowX: "auto" }}
                />
                <XAxis
                  dataKey={
                    selectedPeriod === "year"
                      ? "monthName"
                      : selectedPeriod === "weekly"
                      ? "day"
                      : "date"
                  }
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(name) =>
                    selectedPeriod === "year" ? name.substring(0, 3) : name
                  }
                />
                <YAxis
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  className="mr-5"
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent className="bg-[#E8E8E8] border-none" />
                  }
                />
                <Bar
                  dataKey="totalSales"
                  fill="var(--color-sale)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                >
                  <LabelList
                    dataKey="totalSales"
                    position="top"
                    className="fill-foreground text-xs"
                    offset={3}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
