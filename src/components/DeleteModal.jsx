import React from "react";
import { ImCross } from "react-icons/im";

export const DeleteModal = ({
  selectedItem,
  setSelectedItem,
  setDeleteModal,
  setData,
}) => {
  const handleDelete = () => {
    // Delete the item from the data array
    setData((prevData) =>
      prevData.filter((item) => item.id !== selectedItem.id)
    );
    // Close the modal
    setDeleteModal(false);
    // Reset the selected item
    setSelectedItem(null);
  };

  return (
    <div className="w-full md:min-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Delete Item
      </h2>
      <div
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => setDeleteModal(false)}
      >
        <ImCross />
      </div>
      <h1 className="text-center text-xl text-red-400">Are You Sure ?</h1>
      <div className="flex gap-20">
        <button
          onClick={handleDelete}
          className="mt-4 cursor-pointer w-full px-6 py-3 bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all"
        >
          Delete
        </button>
        <button
          onClick={() => setDeleteModal(false)}
          className="mt-4 cursor-pointer w-full px-6 py-3 bg-[#4b4b49] text-white rounded-lg shadow-lg hover:scale-105 transform transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
