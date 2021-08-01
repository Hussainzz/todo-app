import "../styles/statusLine.scss";
import Task from './Task';
import {Droppable} from 'react-beautiful-dnd';

const StatusLine = (props) =>{
    const {status,tasks,addTask,deleteTask,moveTask,addEmptyTask,taskOrder} = props;
    let taskList, taskForStatus, taskOrderMap;
  
    const handleAddEmpty = () => {
        addEmptyTask(status);
    }

    if(tasks){
        taskForStatus = tasks.filter(task => task.status === status);
        taskOrderMap = (taskOrder[status])?taskOrder[status]:null;
    }

    if(taskForStatus){
       if(taskOrderMap){
        let task;
        
        taskList = taskOrderMap.map((orderTaskId,index) => {
            task = taskForStatus.filter(t => t.id === orderTaskId)[0];
            //console.log(task);
            return (
                <Task
                    addTask={(task) => addTask(task)}
                    deleteTask={deleteTask}
                    moveTask={moveTask}
                    key={task.id}
                    task={task}
                    taskOrderIndex={index}
                />
            )
        })
            /* taskList = taskForStatus.map((task) => {
                return (
                    <Task
                        addTask={(task) => addTask(task)}
                        deleteTask={deleteTask}
                        moveTask={moveTask}
                        key={task.id}
                        task={task}
                    />
                )
            }) */
       }
        
    }
    return <div className="statusLine">
        <h3>{status}</h3>
        <Droppable droppableId={status} type="statusColumn">
            {
                (provided) => (
                    <div className="dropContainer"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {taskList}
                    {provided.placeholder}

                    </div>
                )
            }
        </Droppable>
       
        <button className="button addTask" onClick={handleAddEmpty}>+</button>
    </div>
};

export default StatusLine;