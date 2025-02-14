import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/purple.css";
import { useNavigate } from "react-router-dom";
import { ViewModal } from "./ViewModal";

export const ViewExpense = () => {
    const [View, setView] = useState();
    const [dataByDate, setDataByDate] = useState();
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const navigate = useNavigate();
  const date = new Date();
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const getData = async () => {
    try {
      const res = await fetch(
        "https://api-food-basic.vercel.app/api/v1/expense/daily-all-expense"
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setPurchaseItems(data?.data?.dailyExpense || []);
      setFilteredItems(data?.data?.dailyExpense || []);
      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedDates?.length > 0) {
      const selectedDateStrings = selectedDates.map((date) =>
        new Date(date).toLocaleDateString()
      );
      const filtered = purchaseItems.filter((item) =>
        selectedDateStrings.includes(
          new Date(item.createdAt).toLocaleDateString()
        )
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(purchaseItems);
    }
  }, [selectedDates, purchaseItems]);


  const handelView = async (dateObj) => {
    try {
      const res = await fetch(
        `https://api-food-basic.vercel.app/api/v1/expense/daily-expense/${dateObj}`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setView(true);
      setDataByDate(data?.data || []);
      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
     <div className="min-h-screen bg-[#E8E8E8] p-4 relative">
         <ArrowLeft
           onClick={() => navigate(`/today-expense`)}
           className="cursor-pointer text-2xl hover:text-indigo-100 transition-all"
         />
         {/* Title */}
         <h1 className="text-3xl font-semibold  text-center mb-10">
           Expense List
         </h1>
   
         {/* Date Picker */}
         <div className="flex md:flex-row justify-center flex-col items-center my-8">
           {/* <h1 className="text-center text-xl md:text-3xl font-semibold text-white ">
             {dayOfWeek}, {date.toLocaleDateString()}
           </h1> */}
   
           <div className="flex md:gap-10 gap-2  justify-center ">
             <DatePicker
               value={selectedDates}
               onChange={setSelectedDates}
               multiple
               format="YYYY-MM-DD"
               placeholder="filter by date"
               style={{ border: "none", outline: "none", boxShadow: "none" }}
               containerClassName="p-2 rounded-md border border-gray-300 rounded-lg bg-white  w-60 text-center"
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
         </div>
         {/* Purchase Table */}
         <div className="overflow-x-auto">
           <table className="w-full bg-white shadow-xl rounded-lg">
             <thead className="bg-[#4b4b49] text-white">
               <tr>
                 <th className="md:py-3 md:px-6 p-3 text-sm md:text-base  text-left">Date</th>
                 <th className="md:py-3 md:px-6 p-3 text-sm md:text-base  text-left">Day</th>
                 <th className="md:py-3 md:px-6 p-3 text-sm md:text-base  text-left">Total Price</th>
                 <th className="md:py-3 md:px-6 p-3 text-sm md:text-base  text-left">Action</th>
               </tr>
             </thead>
             <tbody>
               {filteredItems.map((item) => {
                 const dateObj = new Date(item.createdAt);
                 return (
                   <tr
                     key={item.id}
                     className="border-t h-[50px] hover:bg-indigo-50 transition-all"
                   >
                     <td className="text-sm md:text-base md:py-3 md:px-6 p-3">
                       {dateObj.toLocaleDateString()}
                     </td>
                     <td className="text-sm md:text-base md:py-3 md:px-6 p-3">
                       {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
                     </td>
                     <td className="text-sm md:text-base md:py-3 md:px-6 p-3">{item.totalSales} Rs</td>
                     <td className="text-sm md:text-base md:py-3 md:px-6 p-3">
                       <button
                         onClick={() => handelView(dateObj)}
                         className=" cursor-pointer px-3 py-2  text-[12px] md:text-base bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all"
                       >
                         View
                       </button>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
         </div>
         {View && (
           <div className="fixed top-0 right-0 flex justify-center items-center w-full h-screen">
             <div
               className="absolute w-full h-screen z-10 bg-[#4b4b49] opacity-10"
               onClick={() => setView(false)}
             ></div>
             <div className="absolute flex justify-center items-center z-20">
               <>
                 <ViewModal data={dataByDate} setView={setView} />
               </>
             </div>
           </div>
         )}
   
         {/* <div className="min-h-[200px] min-w-[300px] bg-white rounded-lg shadow-lg absolute bottom-4 right-4">
           <div className="w-full h-full p-4 flex flex-col gap-10">
             <h1 className="text-4xl font-semibold">Total Price :</h1>
             <h1 className=" text-5xl text-end text-[#7F7F7F]">
               {filteredItems.reduce(
                 (total, item) => total + parseFloat(item.price),
                 0
               )}{" "}
               <span className="text-[20px]">Rs</span>
             </h1>
           </div>
         </div> */}
       </div>
  );
};
