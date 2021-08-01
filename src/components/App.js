import {useState, useEffect} from 'react';
import "../styles/App.scss";
import StatusLine from './StatusLine';
import {DragDropContext} from 'react-beautiful-dnd';
import {makeid} from '../util/makeid';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskOrder, setTaskOrder]= useState({});

  useEffect(() => {
    loadTasksFromLocalStorage();
    loadTasksOrderFromLocalStorage();
  },[])


  const addEmptyTask = (status) =>{
      
      let newTaskId = makeid(5);

  
      setTasks((tasks) => [
        ...tasks,
        {
          id:newTaskId,
          title:"",
          description:"",
          urgency:"",
          status:status,
        }
      ]);
      const statusData = taskOrder;
      
      if(statusData[status]){
        statusData[status].push(newTaskId);
      }else{
        statusData[status] = [newTaskId]
      }
      setTaskOrder(statusData);
  }

  const addTask = (taskToAdd) => {
    let filteredTasks = tasks.filter((task) => {
      return task.id !== taskToAdd.id;
    })
    let newTaskList = [...filteredTasks, taskToAdd]

    setTasks(newTaskList);
    saveTaskToLocalStorage(newTaskList)

    
    saveTaskOrderToLocalStorage(taskOrder)
    
  }

  const deleteTask = (taskId) => {
    let tsk = tasks.filter((task) => {
      return task.id === taskId;
    })[0]
    let filteredTasks = tasks.filter((task) => {
      return task.id !== taskId;
    })
    setTasks(filteredTasks);
    saveTaskToLocalStorage(filteredTasks)

    let filteredCurrentTaskOrder = taskOrder[tsk.status].filter(tId => tId !== tsk.id);
    let newTaskOrder = taskOrder;
    newTaskOrder[tsk.status] = filteredCurrentTaskOrder;
    setTaskOrder(newTaskOrder);
    saveTaskOrderToLocalStorage(newTaskOrder)
  }

  const moveTask = (taskId, newStatus) => {
    let task = tasks.filter((task) => {
      return task.id === taskId;
    })[0]
    
    
    let filteredTasks = tasks.filter((task) => {
      return task.id !== taskId;
    })
    task.status = newStatus;

    let newTaskList = [...filteredTasks, task];
    setTasks(newTaskList);
    saveTaskToLocalStorage(newTaskList)
  }

  const saveTaskToLocalStorage = (tasks) => {

    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  const saveTaskOrderToLocalStorage=(taskOrder) =>{
    localStorage.setItem("taskOrder", JSON.stringify(taskOrder))
  }


  const loadTasksFromLocalStorage = () => {
      let loadedTasks = localStorage.getItem("tasks")

      let tasks = JSON.parse(loadedTasks);

      if(tasks){
        setTasks(tasks)
      }
  }

  const loadTasksOrderFromLocalStorage = () => {
    let loadedTaskOrder = localStorage.getItem("taskOrder")

    let taskO = JSON.parse(loadedTaskOrder);

    if(taskO){
      setTaskOrder(taskO)
    }
}



  const onDragEnd = (result) => {
      //console.log(result);

      if (!result.destination) {
        return;
      }

      if (
        result.destination.droppableId === result.source.droppableId &&
        result.destination.index === result.source.index
      ) {
        return;
      }

      const changeStatusTo = result.destination.droppableId;
      const currentStatus = result.source.droppableId;
      let currentOrder = taskOrder;
      
      if(result.destination.droppableId === result.source.droppableId /* && result.destination.index !== result.source.index */){
        

        if(currentOrder[changeStatusTo]){
          currentOrder[changeStatusTo].splice(result.source.index,1)
          currentOrder[changeStatusTo].splice(result.destination.index,0,result.draggableId)
        }
      }else{
        const filteredOrder = currentOrder[currentStatus].filter(i => i !== result.draggableId);
        currentOrder[currentStatus] = filteredOrder;

        if(currentOrder[changeStatusTo]){
          currentOrder[changeStatusTo].push(result.draggableId);
        }else{
          currentOrder[changeStatusTo] = [result.draggableId]
        }
      
        if(currentOrder[changeStatusTo].indexOf(result.draggableId) !== -1){
          currentOrder[changeStatusTo].splice(currentOrder[changeStatusTo].indexOf(result.draggableId),1)
          currentOrder[changeStatusTo].splice(result.destination.index,0,result.draggableId)
        }
      }
      
      saveTaskOrderToLocalStorage(currentOrder)

      const currentTask =  tasks.filter(task => task.id === result.draggableId)[0]
       
      let otherTasks = tasks.filter((task) => {
        return task.id !== result.draggableId;
      })

      if(typeof currentTask != "undefined"){
        currentTask.status = changeStatusTo;

        let newTaskList = [...otherTasks, currentTask];
        setTasks(newTaskList);
        saveTaskToLocalStorage(newTaskList)

      }else{
        console.log('no task');
      }
  }
  

  return (
    <div className="App">
       <h1>Task Management</h1>
       <main>
        <DragDropContext
          onDragEnd={onDragEnd}
        >
          <section>
                <StatusLine
                  key="lowStatusLine"
                  tasks={tasks}
                  addEmptyTask={addEmptyTask}
                  addTask={addTask}
                  deleteTask={deleteTask}
                  moveTask={moveTask}
                  status="Backlog"
                  taskOrder={taskOrder}
                ></StatusLine>

                <StatusLine
                key="mediumStatusLine"
                tasks={tasks}
                addEmptyTask={addEmptyTask}
                addTask={addTask}
                deleteTask={deleteTask}
                moveTask={moveTask}
                status="In Progress"
                taskOrder={taskOrder}
                ></StatusLine>

                <StatusLine
                key="highStatusLine"
                tasks={tasks}
                addEmptyTask={addEmptyTask}
                addTask={addTask}
                deleteTask={deleteTask}
                moveTask={moveTask}
                status="Done"
                taskOrder={taskOrder}
                ></StatusLine>
          </section>
        </DragDropContext> 
       </main>
    </div>
  );
}

export default App;
