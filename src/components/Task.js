import "../styles/task.scss";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
const Task = (props) => {
  const { addTask, deleteTask, task } = props;

  const [urgencyLevel, setUrgencyLevel] = useState(task.urgency);
  const [collapsed, setCollapsed] = useState(task.isCollapsed);
  const [formAction, setFormAction] = useState("");

  const setUrgency = (event) => {
    setUrgencyLevel(event.target.attributes.urgency.value);
  };

  const showDetails = () => {
    if (collapsed) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formAction === "save") {
      if (collapsed) {
        setCollapsed(false);
      } else {
        let newTask = {
          id: task.id,
          title: event.target.elements.title.value,
          description: event.target.elements.description.value,
          urgency: urgencyLevel,
          status: task.status,
          isCollapsed: true,
        };

        addTask(newTask);
        setCollapsed(true);
      }
    }

    if (formAction === "delete") {
      deleteTask(task.id);
    }
  };

  return (
    <Draggable draggableId={task.id.toString()} index={props.taskOrderIndex}>
        {
            (provided) => (
                <div className={`task ${collapsed ? "collapsedTask" : ""}`}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                >
                    <form onSubmit={handleSubmit} className={collapsed ? "collapsed" : ""}>
                        <input
                        type="text"
                        className="title input"
                        name="title"
                        placeholder="Enter Title"
                        disabled={collapsed}
                        defaultValue={task.title}
                        />
                        <textarea
                        rows="2"
                        className="description input"
                        name="description"
                        placeholder="Enter Description"
                        defaultValue={task.description}
                        />
                        <div className="urgencyLabels">
                        <label className={`low ${urgencyLevel === "low" ? "selected" : ""}`}>
                            <input
                            urgency="low"
                            onChange={setUrgency}
                            type="radio"
                            name="urgency"
                            />
                            low
                        </label>
        
                        <label
                            className={`medium ${urgencyLevel === "medium" ? "selected" : ""}`}
                        >
                            <input
                            urgency="medium"
                            onChange={setUrgency}
                            type="radio"
                            name="urgency"
                            />
                            medium
                        </label>
        
                        <label
                            className={`high ${urgencyLevel === "high" ? "selected" : ""}`}
                        >
                            <input
                            urgency="high"
                            onChange={setUrgency}
                            type="radio"
                            name="urgency"
                            />
                            high
                        </label>
                        </div>
                        <button
                        onClick={() => {
                            setFormAction("save");
                        }}
                        className="button"
                        >
                        {collapsed ? "Edit" : "Save"}
                        </button>
        
                        {collapsed && (
                        <button
                            onClick={() => {
                            setFormAction("delete");
                            }}
                            className="button delete"
                        >
                            X
                        </button>
                        )}
                        
                        <button className="button showBtn" onClick={showDetails}>
                        show
                        </button> 
                    </form>
                    {provided.placeholder}
                </div>
                
            )
        }
        
    </Draggable>      
  );
};
export default Task;
