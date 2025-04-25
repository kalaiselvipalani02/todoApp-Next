"use client";
import React, { useEffect, useState } from "react";
import { Todo } from "../model/toDo";

type Props = {
  editingTodo: Todo | null;
  clearEditingTodo: () => void;
  onAddNewTodo: () => void;
};

export default function ToDoAddForm({
  editingTodo,
  clearEditingTodo,
  onAddNewTodo,
}: Props) {
  const [formData, setFormData] = useState({
    newTodo: "",
    description: "",
  });
  const [error, setError] = useState({
    newTodo: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        newTodo: editingTodo.name,
        description: editingTodo.desc,
      });
    } else {
      setFormData({
        newTodo: "",
        description: "",
      });
    }
  }, [editingTodo]);

  const handleChange = (event: any) => {
    setMessage("");
    const { name, value } = event.target;
    //update the form value to field
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    let errorMsg = "";
    if (name === "newTodo" && value.trim() === "") {
      errorMsg = "New Todo name is required";
    }

    if (name === "description") {
      if (value.trim() === "") {
        errorMsg = "Description is required";
      } else if (value.trim().length < 10)
        errorMsg = "Description should be more than 10 character";
      else if (value.trim().length > 100)
        errorMsg = "Description should be less than 100 character";
    }

    setError((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    //in editingmode,
    const method = editingTodo ? "PUT" : "POST";
    const url = editingTodo
      ? `api/save-data?id=${editingTodo.id}`
      : "api/save-data";

    const payload = {
      name: formData.newTodo,
      desc: formData.description,
    };

    if (!formData.newTodo && !formData.description) {
      setMessage("Please fill the Details");
      return;
    }

    try {
      //save formdetails to file
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 200) {
        if (editingTodo) {
          setMessage("Data upated successfully");
        } else {
          setMessage("Data saved successfully");
        }
        setTimeout(() => {
          setMessage("");
        }, 1000);
        onAddNewTodo();
        clearEditingTodo();

        setFormData({
          newTodo: "",
          description: "",
        });
      } else {
        setMessage("Something went wrong. Please try again");
      }
    } catch (error) {
      console.error("Message ");
      setMessage("Network Issue");
    }
  };

  return (
    <div className="w-1/2 bg-white p-6 rounded shadow flex-1 ">
      <h2 className="text-xl font-semibold mb-4">
        {editingTodo ? "Update Todo" : "Add New Todo"}
      </h2>
      {message && <p className="text-green-600 mt-2">{message}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="newTodo"
          placeholder="New Todo Name"
          value={formData.newTodo}
          onChange={handleChange}
          className="p-2 border rounded placeholder-gray-400"
        />
        {error.newTodo && <span style={{ color: "red" }}>{error.newTodo}</span>}
        <textarea
          name="description"
          maxLength={100}
          minLength={10}
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded placeholder-gray-400"
        />
        {error.description && (
          <span style={{ color: "red" }}>{error.description}</span>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {editingTodo ? "Update Todo" : "Add Todo"}
        </button>
      </form>
    </div>
  );
}
