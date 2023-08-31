import React from 'react';

const PostsList = (props) =>
{
    return(
       <>
       <br/>

        <div className="todosUser">
            <b>Title :</b> {props.title} <br/>
            <b>Body :</b> {props.body} <br/>
        </div>
       </>
    )
}

export default PostsList;