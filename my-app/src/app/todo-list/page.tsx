"use client";

import React, { useState } from "react";
import TodoList from "../components/TodoList";
import ToDoAddForm from "../components/ToDoAddForm";
import { Todo } from "../model/toDo";

export default function ToDoPage() {
  //in ts we needd specify | is a union type operator. is Todo Object or null
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [refresh, setRefresh] = useState(0);

  const clearEditingTodo = () => {
    setEditingTodo(null);
  };
  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all todos?"
    );
    if (!confirmed) return;
    try {
      const res = await fetch("api/save-data", {
        method: "DELETE",
      });
    } catch (error) {  console.log("Error" , error)}
  };

  const deleteToDo = async (todo:Todo) =>{
    const confirmed = window.confirm(
        "Are you sure you want to delete this todos?"
      );
      if(!confirmed) return ;
      try {
        const res = await fetch(`api/save-data?id=${todo.id}` , {
            method: "DELETE" ,
        
        });

      }catch(error) {
        console.log("Error" , error)
      }

  }
 const toggleToDo  = async (todo:Todo) => {
//OTHER Than completed field, remainig are same
    const updated = { ...todo, completed: !todo.completed };
    const res = await fetch(`/api/save-data?id=${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    
      const data = await res.json();
      if (res.ok) {
        // maybe refetch or update state
        setRefresh(prev => prev + 1);// or your existing update logic
      } else {
        console.error("Error updating:", data);
      }
 }

  const onAddNewTodo = () => {
    clearEditingTodo();
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="flex gap-6 p-6 h-screen bg-gray-100">
      <ToDoAddForm
        editingTodo={editingTodo}
        clearEditingTodo={clearEditingTodo}
        onAddNewTodo={onAddNewTodo}
       
      />
      <TodoList
        onEditingTodo={(todo: Todo) => setEditingTodo(todo)}
        onAddNewTodo={onAddNewTodo}
        onDeleteAll={handleDeleteAll}
        refresh={refresh}
        onDeletTodo ={(todo:Todo) => deleteToDo(todo) }
        onToggleComplete = {(todo:Todo) => toggleToDo(todo)}
      />
    </div>
  );
}
