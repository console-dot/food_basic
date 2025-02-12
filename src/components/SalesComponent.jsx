import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import { ImCross } from "react-icons/im";
import { ToastAction } from "./ui/toast";
import { toast } from "../hooks/use-toast";

export const SalesComponent = () => {
  const [monthlySalesData, setMonthlySalesDate] = useState();
  const [daiySaleData, setDailySaleData] = useState();
  const [ViewMonthlyModal, setViewMonthlyModal] = useState();
  const [purchase, setPurchase] = useState("");
  const [expense, setExpense] = useState("");
  const [cashInHand, setCashInHand] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const date = new Date();
  const navigate = useNavigate();
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const getDailyExpenseData = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/v1/expense/daily-expense"
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setExpense(data?.data?.dailyExpense || []);
      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDailyPurchaseData = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/v1/purchase/daily-purchase"
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setPurchase(data?.data?.dailyPurchase || []);
      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getAllDailySalesData = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/v1/sale/all");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setDailySaleData(data.data);
      // setPurchase(data?.data?.dailyPurchase || []);
      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllDailySalesData();
    getDailyPurchaseData();
    getDailyExpenseData();
  }, []);

  console.log(selectedDates);

  const handelSubmitSale = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/v1/sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todaysExpense: expense,
          todaysPurchase: purchase,
          cashInHand: cashInHand,
        }),
      });

      const data = await res.json(); // Parse response JSON

      if (res.status === 201) {
        getAllDailySalesData();
        setCashInHand(" ");
        console.log("Data saved to MongoDB");
      } else if (res.status === 400) {
        toast({
          variant: "destructive",
          title: data?.message,
        });
      }
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  useEffect(() => {
    if (selectedDates?.length > 0) {
      const selectedDateStrings = selectedDates.map((date) =>
        new Date(date).toLocaleDateString()
      );
      const filtered = daiySaleData?.filter((item) =>
        selectedDateStrings.includes(
          new Date(item.createdAt).toLocaleDateString()
        )
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(daiySaleData);
    }
  }, [selectedDates, daiySaleData]);

  const getMonthlySale = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/v1/sale/monthly-sale");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setMonthlySalesDate(data?.data || []);
      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="min-h-screen bg-[#E8E8E8] p-4 relative">
      <div
        className="flex justify-between 
     "
      >
        <ArrowLeft
          onClick={() => navigate(`/dashboard`)}
          className="cursor-pointer text-2xl hover:text-indigo-100 transition-all"
        />
        <button
          onClick={() => {
            setViewMonthlyModal(true);
            getMonthlySale();
          }}
          className=" cursor-pointer md:px-6 p-2 md:py-3 text-[12px] md:text-base bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all"
        >
          View Monthly Sale
        </button>
      </div>
      <h1 className="text-center text-xl md:text-3xl font-semibold  mt-4 md:mt-5">
        {dayOfWeek}, {date.toLocaleDateString()}
      </h1>

      <form
        className=" space-y-2  md:space-y-6 mt-4 md:mt-8 shadow-lg p-4 md:p-6 bg-white bg-opacity-80 rounded-xl backdrop-blur-xl mx-auto max-w-3xl"
        onSubmit={handelSubmitSale}
      >
        {/* All Three Fields in a Single Row (on larger screens) */}
        <div className="flex flex-col sm:flex-row  sm:gap-6">
          {/* Today's Purchase */}
          <div className="flex-1">
            <label
              htmlFor="purchase"
              className="block text-sm font-medium text-gray-700 md:mb-1.5"
            >
              Today's Purchase
            </label>
            <input
              type="number"
              id="purchase"
              value={purchase}
              onChange={(e) => setPurchase(Number(e.target.value))}
              placeholder="0.00"
              required
              className="w-full px-2 py-1 md:px-4 md:py-2.5  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <span className="text-gray-400 h-[15px] pt-3 text-center justify-center flex items-center md:text-xl">
            +
          </span>

          {/* Today's Expense */}
          <div className="flex-1">
            <label
              htmlFor="expense"
              className="block text-sm font-medium text-gray-700 md:mb-1.5"
            >
              Today's Expense
            </label>
            <input
              type="number"
              id="expense"
              value={expense}
              onChange={(e) => setExpense(Number(e.target.value))}
              placeholder="0.00"
              required
              className="w-full px-2 py-1 md:px-4 md:py-2.5  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <span className="text-gray-400 h-[15px] pt-3 justify-center flex items-center md:text-xl">
            +
          </span>

          {/* Cash in Hand */}
          <div className="flex-1">
            <label
              htmlFor="cashInHand"
              className="block text-sm font-medium text-gray-700 md:mb-1.5"
            >
              Cash in Hand
            </label>
            <input
              type="number"
              id="cashInHand"
              value={cashInHand}
              onChange={(e) => setCashInHand(parseInt(e.target.value))}
              placeholder="0.00"
              required
              className="w-full px-2 py-1 md:px-4 md:py-2.5 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Total Price Display */}
        <div className=" md:text-xl font-semibold text-center text-gray-800">
          Total: {purchase + expense + (cashInHand ? cashInHand : 0)}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-1 md:py-3 md:text-lg text-white bg-[#4b4b49] rounded-lg shadow-lg hover:scale-105 transform transition-all"
        >
          Save Entries
        </button>
      </form>

      <div className="flex md:gap-10  gap-2 mt-4 md:mt-10 justify-center ">
        <DatePicker
          value={selectedDates}
          onChange={setSelectedDates}
          multiple
          format="YYYY-MM-DD"
          placeholder="filter by date"
          style={{ border: "none", outline: "none", boxShadow: "none" }}
          containerClassName="p-2 rounded-md bg-white border border-gray-300 rounded-lg  w-60 text-center"
          inputProps={{
            style: {
              border: "none",
              outline: "none", // Remove the outline when focused
              boxShadow: "none", // Remove any default box shadow on focus
            },
          }}
        />
        {selectedDates?.length > 0 && (
          <div onClick={() => setSelectedDates(null)}>
            <button className="cursor-pointer w-full py-2.5 px-1  md:p-2.5 text-sm text-white bg-[#4b4b49] rounded-lg shadow-lg hover:scale-105 transform transition-all">
              {" "}
              Clear Filter
            </button>
          </div>
        )}
      </div>
      <div className="relative">
        <div className="mt-4 md:mt-10 overflow-x-auto ">
          <table className="w-full bg-white shadow-xl rounded-lg">
            <thead className="bg-[#4b4b49] text-white">
              <tr>
                <th className="md:py-3 md:px-6 p-3 text-left">Date</th>
                <th className="md:py-3 md:px-6 p-3 text-left">Day</th>
                <th className="md:py-3 md:px-6 p-3 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems?.map((item) => {
                const dateObj = new Date(item.createdAt);
                return (
                  <tr
                    key={item.id}
                    className="border-t h-[50px] hover:bg-indigo-50 transition-all"
                  >
                    <td className="text-base md:py-3 md:px-6 p-3">
                      {dateObj.toLocaleDateString()}
                    </td>
                    <td className="text-base md:py-3 md:px-6 p-3">
                      {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
                    </td>
                    <td className="text-base md:py-3 md:px-6 p-3">
                      {item.totalSales} Rs
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {ViewMonthlyModal && (
        <>
          <div className="fixed top-0 right-0 flex justify-center items-center w-full h-screen">
            <div
              className="absolute w-full h-screen z-10 bg-[#4b4b49] opacity-10"
              onClick={() => setViewMonthlyModal(false)}
            ></div>
            <div className="absolute flex justify-center items-center z-20"></div>
            <div className="z-30">
              <div className=" w-[21.5rem] md:min-w-2xl  overflow-auto rounded-2xl bg-white p-4 md:p-8 shadow-xl relative">
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
                  Monthly Sales
                </h2>
                <div
                  className="absolute top-5 right-5 cursor-pointer"
                  onClick={() => setViewMonthlyModal(false)}
                >
                  <ImCross />
                </div>
                <div className="overflow-x-auto max-h-[400px] md:max-h-[550px] shadow-xl">
                  <table className="w-full bg-white shadow-xl rounded-lg border-transparent ">
                    <thead className="bg-[#4b4b49] sticky top-0  text-white">
                      <tr>
                        <th className="md:py-3 md:px-6 p-3 text-left">Date</th>
                        <th className="md:py-3 md:px-6 p-3 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlySalesData?.map((item) => {
                        const dateObj = new Date(
                          item._id.year,
                          item._id.month - 1
                        );
                        return (
                          <tr
                            key={item.id}
                            className="border-t h-[50px] hover:bg-indigo-50 transition-all"
                          >
                            <td className="text-base px-6 py-3">
                              {dateObj.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </td>
                            <td className="text-base px-6 py-3">
                              {item.totalSales} Rs
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* <div className="flex gap-20">
                    <button
                      // onClick={handleDelete}
                      className="mt-4 cursor-pointer w-full px-6 py-3 bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all"
                    >
                      Delete
                    </button>
                    <button
                      // onClick={() => setDeleteModal(false)}
                      className="mt-4 cursor-pointer w-full px-6 py-3 bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all"
                    >
                      Cancel
                    </button>
                  </div> */}
              </div>
            </div>
            {/* <div className="z-30 w-[21.5rem] md:min-w-2xl  overflow-auto rounded-2xl bg-white p-4 md:p-8 shadow-xl relative">
              <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
                Montly Sale
              </h2>
              <div
                className="absolute top-5 right-5 cursor-pointer"
                onClick={() => setViewMonthlyModal(false)}
              >
                <ImCross />
              </div>
              <div className="overflow-x-auto max-h-[400px] md:max-h-[550px] shadow-xl">
                <table className="w-full bg-white shadow-xl rounded-lg border-transparent ">
                  <thead className="bg-gradient-to-r sticky top-0  from-indigo-500 to-purple-500 text-white">
                    <tr>
                      <th className="md:py-3 md:px-6 p-3 text-left">Date</th>
                      <th className="md:py-3 md:px-6 p-3 text-left">Time</th>
                      <th className="md:py-3 md:px-6 p-3 text-left">Day</th>
                      <th className="md:py-3 md:px-6 p-3 text-left">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item) => {
                      const dateObj = new Date(item.createdAt);
                      return (
                        <tr
                          key={item.id}
                          className="border-t h-[50px] hover:bg-indigo-50 transition-all"
                        >
                          <td className="text-base px-6 py-3">{item.name}</td>
                          <td className="text-base px-6 py-3">
                            {item.price} Rs
                          </td>
                          <td className="text-base px-6 py-3">
                            {dateObj.toLocaleDateString()}
                          </td>
                          <td className="text-base px-6 py-3">
                            {dateObj.toLocaleTimeString()}
                          </td>
                          <td className="text-base px-6 py-3">
                            {dateObj.toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};
