"use client";
import { error } from "console";
import React, { useEffect, useState } from "react";
import { Todo } from "../model/toDo";

interface TodoListProps {
  onEditingTodo: (todo: Todo) => void;
  onAddNewTodo?: () => void;
  onDeleteAll?: () => void;
  refresh: number;
  onDeletTodo: (todo: Todo) => void;
  onToggleComplete: (todo: Todo) => void;
}

export default function TodoList({
  onEditingTodo,
  onAddNewTodo,
  onDeleteAll,
  refresh,
  onDeletTodo,
  onToggleComplete
}: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]); //todos is Todo[] array

  //when page load, get the details from file, once [] array
  useEffect(() => {
    fetch("api/save-data")
      .then((res) => {
        if (res.status === 404) {
          // If the file doesn't exist or there's no data, treat it as empty
          return { data: [] };
        }
        if (!res.ok) throw new Error("Something error");
        return res.json();
      })
      .then((response) => {
        //check data is Array
        if (response.data && Array.isArray(response.data)) {
          setTodos(response.data);
        } else {
          throw new Error("Expected an array but got something else");
        }
      })
      .catch((error) => console.error(error));
  }, [refresh]);

  return (
    <div className="w-3/4 mx-auto bg-white p-6 rounded shadow overflow-x-auto border border-gray-300">
      <h2 className="text-2xl font-semibold mb-6 text-center">Todo List</h2>
      <div className="flex justify-end gap-4 mb-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={onAddNewTodo}
        >
          Add New Todo
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={onDeleteAll}
        >
          Delete All
        </button>
      </div>
      {todos.length === 0 && "No records found here"}
      {todos.length > 0 && (
        <form>
          <table className="table-auto w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  <input type="checkbox" name="todoid" />
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Todo
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo, index) => (
                <tr
                  key={todo.id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="border border-gray-300 px-4 py-2">
                    <input type="checkbox" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {todo.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-normal break-words max-w-xs">
                    {todo.desc}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => onToggleComplete(todo)}
                      className={`px-3 py-1 rounded  ${
                        todo.completed === true ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Mark Complete"}
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => onEditingTodo(todo)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => onDeletTodo(todo)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      )}
    </div>
  );
}
