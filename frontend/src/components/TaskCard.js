import API from "../api/axios";

const TaskCard = ({ task, refresh }) => {

    const updateStatus = async (status) => {
        await API.put(`/tasks/${task._id}`, { status });
        refresh();
    };

    return (
        <div style={{border: "1px solid black", margin: "10px"}}>
            <h4>{task.title}</h4>
            <p>{new Date(task.date).toDateString()}</p>
            <p>Status: {task.status}</p>

            <button onClick={() => updateStatus("completed")}>Complete</button>
            <button onClick={() => updateStatus("missed")}>Miss</button>
        </div>
    );
};

export default TaskCard;