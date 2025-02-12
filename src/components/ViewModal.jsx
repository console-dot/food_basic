import React from "react";
import { ImCross } from "react-icons/im";

export const ViewModal = ({ data, setView }) => {
  return (
    <div className=" w-[21.5rem] md:min-w-2xl  overflow-auto rounded-2xl bg-white p-4 md:p-8 shadow-xl relative">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        View List
      </h2>
      <div
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => setView(false)}
      >
        <ImCross />
      </div>
      <div className="overflow-x-auto max-h-[400px] md:max-h-[550px] shadow-xl">
        <table className="w-full bg-white shadow-xl rounded-lg border-transparent ">
          <thead className="bg-[#4b4b49] sticky top-0   text-white">
            <tr>
              <th className="md:py-3 md:px-6 p-3 text-left">Item</th>
              <th className="md:py-3 md:px-6 p-3 text-left">Price</th>
              <th className="md:py-3 md:px-6 p-3 text-left">Date</th>
              <th className="md:py-3 md:px-6 p-3 text-left">Time</th>
              <th className="md:py-3 md:px-6 p-3 text-left">Day</th>
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
                  <td className="text-base md:py-3 md:px-6 p-3">{item.name}</td>
                  <td className="text-base md:py-3 md:px-6 p-3">{item.price} Rs</td>
                  <td className="text-base md:py-3 md:px-6 p-3">
                    {dateObj.toLocaleDateString()}
                  </td>
                  <td className="text-base md:py-3 md:px-6 p-3">
                    {dateObj.toLocaleTimeString()}
                  </td>
                  <td className="text-base md:py-3 md:px-6 p-3">
                    {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
