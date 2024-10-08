import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

// Helper function to reorder tasks after dragging
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function App() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Handle adding a new task
  const handleAddTask = (taskName) => {
    setTasks([...tasks, { id: tasks.length + 1, content: taskName }]);
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Handle drag end to reorder tasks
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = reorder(
      tasks,
      result.source.index,
      result.destination.index
    );
    setTasks(reorderedTasks);
  };

  return (
    <div className="app">
      <h1>Task Management Application</h1>
      <TaskInput onAddTask={handleAddTask} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              className="task-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided) => (
                    <div
                      className="task-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...provided.draggableProps.style }}
                    >
                      <span>{task.content}</span>
                      <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

// Input component to add new tasks
const TaskInput = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName) return;
    onAddTask(taskName);
    setTaskName("");
  };

  return (
    <form className="task-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter a new task"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default App;
