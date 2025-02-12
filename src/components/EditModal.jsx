import React from "react";
import { ImCross } from "react-icons/im";

export const EditModal = ({
  selectedItem,
  setSelectedItem,
  setEditModal,
  setData,
}) => {
  const handelUpdate = (e) => {
    e.preventDefault();
    setData((prevData) =>
      prevData.map((item) =>
        item.id === selectedItem.id ? { ...item, ...selectedItem } : item
      )
    );
    setEditModal(false);
  };
  console.log(selectedItem)
  return (
    <div className="w-full max-w-[20rem] md:max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Edit Item
      </h2>
      <div
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => setEditModal(false)}
      >
        <ImCross />
      </div>
      {/* {error && <p className="mb-4 text-center text-red-500">{error}</p>} */}
      <form onSubmit={handelUpdate}>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Item Name</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Item Name"
            required
            value={selectedItem?.name}
            onChange={(e) =>
              setSelectedItem((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>
        <label className="mb-2 block text-gray-700">Price</label>
        <input
          // type={showPassword ? "text" : "password"}
          type="number"
          className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-blue-500 focus:ring-blue-500"
          placeholder="price"
          value={selectedItem?.price}
          required
          onChange={(e) =>
            setSelectedItem((prev) => ({
              ...prev,
              price:parseInt( e.target.value),
            }))
          }
        />

        <button
          type="submit"
          className="mt-4 cursor-pointer w-full px-6 py-3 bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all"
        >
          Update
        </button>
      </form>
    </div>
  );
};
