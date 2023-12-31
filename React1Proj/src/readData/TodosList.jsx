import { useState } from "react";
import React from 'react';


const TodosList = (props) =>
{
    const [completed,setCompleted] = useState(props.completed);

    const ChangeCompleted = () =>
    {
        setCompleted('true');
    }

    return(
       <>
        <br/>
        <div className="todosUser">
            <b>Title :</b> {props.title}<br/>
            <b>Completed :</b> {completed}
            {
                completed=='false' && <button className="MarkButton" onClick={ChangeCompleted}>Mark Completed</button>
            }
          
        </div>
       </>
    )
}

export default TodosList;