import React, { useState, useEffect, useRef } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";
import { toast } from "../hooks/use-toast";

export const PurchaseComponent = ({ SetPurchaseItems, purchaseItems }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editModal, setEditModal] = useState();
  const [deleteModal, setDeleteModal] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const date = new Date();
  const navigate = useNavigate();
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currentDate, setCurrentDate] = useState(date.toLocaleTimeString());
  const [currentTime, setCurrentTime] = useState({
    date: new Date().toLocaleDateString(),
  });
  const handleAddItem = (e) => {
    e.preventDefault();
    if (name && price) {
      SetPurchaseItems((prev) => [
        ...prev,
        {
          name,
          price: parseFloat(price),
          id: prev.length + 1,
          date: currentDate,
        },
      ]);
      setName("");
      setPrice("");
    }
  };

  useEffect(() => {
    console.log("Updated purchaseItems:", purchaseItems);

    const interval = setInterval(() => {
      const now = new Date();
      const newDate = now.toLocaleDateString();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      console.log(`Current Time: ${hours}:${minutes}`);

      // Auto-save at exactly 11:00 PM
      if (hours === 23 && minutes === 0) {
        console.log("It's 11:00 PM, auto-saving...");
        saveToDatabase();
      }

      // Update date if changed
      if (newDate !== currentTime?.date && purchaseItems?.length > 0) {
        console.log("Date changed, updating currentTime...");
        setCurrentTime({ date: newDate });

        console.log("Auto-saving data to database...");
        saveToDatabase();
      }
    }, 10 * 1000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [currentTime?.date, purchaseItems]);

  const saveToDatabase = async () => {
    console.log("Saving data:", purchaseItems);
    try {
      const res = await fetch(
        "https://api-food-basic.vercel.app/api/v1/purchase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: purchaseItems }),
        }
      );
      console.log(res);
      if (res?.status === 201) {
        SetPurchaseItems([]);
        toast({
          variant: "success",
          title: "Add purchase",
        });
        setIsLoading(false);
      }
      console.log("Data saved to MongoDB");
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E8E8] p-4 relative">
      <div className="flex justify-between items-center">
        <ArrowLeft
          onClick={() => navigate(`/dashboard`)}
          className="cursor-pointer text-2xl hover:text-indigo-100 transition-all"
        />
        <button
          onClick={() => navigate(`/view-purchase`)}
          className=" cursor-pointer md:px-6 p-2 md:py-3 text-[12px] md:text-base bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all"
        >
          View Purchase
        </button>
      </div>
      <h1 className="text-center text-xl md:text-3xl font-semibold mt-5">
        {dayOfWeek}, {date.toLocaleDateString()}
      </h1>

      <form
        className="space-y-6 mt-5 md:mt-8 shadow-lg p-6 bg-white bg-opacity-80 rounded-xl backdrop-blur-xl mx-auto max-w-lg"
        onSubmit={handleAddItem}
      >
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item Name"
            minLength={3}
            required
            className="border-2 border-gray-300 rounded-lg p-2 md:p-3 w-full sm:w-[45%] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <input
            type="number"
            value={price}
            required
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="border-2 border-gray-300 rounded-lg p-2 md:p-3 w-full sm:w-[45%] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <button
          type="submit"
          className="w-full md:mt-4 py-2 md:py-3 text-lg text-white bg-[#4b4b49] rounded-lg shadow-lg hover:scale-105 transform transition-all"
        >
          Add Item
        </button>
      </form>
      <div className="relative">
        <div className="mt-5 md:mt-10 overflow-x-auto ">
          <table className="w-full bg-white shadow-xl rounded-lg">
            <thead className="bg-[#4b4b49] text-white">
              <tr>
                <th className="md:py-3 md:px-6 p-3 text-left">Item</th>
                <th className="md:py-3 md:px-6 p-3 text-left">Price</th>
                <th className="md:py-3 md:px-6 p-3 text-left">Date</th>
                <th className="md:py-3 md:px-6 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchaseItems?.map((item) => (
                <tr
                  key={item.id}
                  className="border-t h-[50px] hover:bg-indigo-50 transition-all"
                >
                  <td className="text-base md:py-3 md:px-6 p-3">{item.name}</td>
                  <td className="text-base md:py-3 md:px-6 p-3">
                    {item.price} Rs
                  </td>
                  <td className="text-base md:py-3 md:px-6 p-3">{item.date}</td>
                  <td className="md:py-3 md:px-6 p-3 flex justify-center gap-4">
                    <BiEdit
                      className="cursor-pointer text-xl text-indigo-500 hover:text-indigo-700 transition-all"
                      onClick={() => {
                        setEditModal(true);
                        setSelectedItem(item);
                      }}
                    />
                    <MdDelete
                      className="cursor-pointer text-xl text-red-500 hover:text-red-700 transition-all"
                      onClick={() => {
                        setDeleteModal(true);
                        setSelectedItem(item);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {purchaseItems?.length > 0 && (
            <div className="absolute  bottom-[-60px] right-0">
              <button
                disabled={isLoading}
                className={` mt-4 ${
                  isLoading && "bg-[#919190]"
                } px-6 py-3 bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all`}
                onClick={() => {
                  saveToDatabase();
                  setIsLoading(true);
                }}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      {editModal && (
        <div className="fixed top-0 right-0  flex justify-center items-center  w-full h-screen">
          <div
            className="absolute w-full h-screen z-10 bg-[#4b4b49] opacity-10 "
            onClick={() => setEditModal(false)}
          ></div>
          <div className="absolute flex justify-center  items-center z-20">
            <>
              <EditModal
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                setEditModal={setEditModal}
                setData={SetPurchaseItems}
              />
            </>
          </div>
        </div>
      )}
      {deleteModal && (
        <div className="fixed top-0 right-0 flex justify-center items-center w-full h-screen">
          <div
            className="absolute w-full h-screen z-10 bg-[#4b4b49] opacity-10"
            onClick={() => setDeleteModal(false)}
          ></div>
          <div className="absolute flex justify-center items-center z-20">
            <>
              <DeleteModal
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                setDeleteModal={setDeleteModal}
                setData={SetPurchaseItems}
              />
            </>
          </div>
        </div>
      )}
    </div>
  );
};
