import { useEffect, useState } from "react";
import React from 'react';
import '../App.css';
import axios from 'axios';
import TodosList from "./TodosList";
import PostsList from "./PostsList";

    const TodosUrl ='https://jsonplaceholder.typicode.com/todos' ;
    const PostsUrl ='https://jsonplaceholder.typicode.com/posts' ;

const ChildReadData = (props) =>
{
    const [todos,setTodos] = useState([]);
    const [posts,setPosts] = useState([]);
    const [showAdditionalData, setShowAdditionalData] = useState(false);
    const [name, setName] = useState(props.name);
    const [email, setEmail] = useState(props.email);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [showAdditionalDiv, setShowAdditionalDiv] = useState(false);
    const [addTodosDiv , setAddTodosDiv] = useState(false);
    const [addPostDiv , setAddPostDiv] = useState(false)
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newPostBody,setNewPostBody] = useState('');
    const [newPostTitle,setNewPostTitle] = useState('');

      const handleMouseOver = () => {
        setShowAdditionalData(true);
      };
    
      const handleMouseOut = () => {
        setShowAdditionalData(false);
      };

    useEffect(() =>{
        const getTodos = async (amount=3) =>
        {
            const {data} = await axios.get(`${TodosUrl}?userId=${props.id}`); 
            const topTodos = data.slice(0,amount);
            setTodos(topTodos);
        }

        const getPosts = async (amount=3) =>
        {
            const {data} = await axios.get(`${PostsUrl}?userId=${props.id}`); 
            const topPosts = data.slice(0,amount);
            setPosts(topPosts);
        }
        getTodos();
        getPosts(2);
    },[])
   
    function hasUncompeletedTasks(todos) {
        return todos.some(todo => !todo.completed);
      }


    const deleteTodosForUserId = (userId) => 
    {
        const todosToDelete = todos.filter(todo => todo.userId === userId);
    
        todosToDelete.forEach(todo => {
          fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(() => {
              setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== todo.id));
            })
            .catch(error => console.log(`Error deleting todo with id ${todo.id}:`, error));
        });
      };
 

      const sentToParent = () =>
      {
        props.callback(props.id);
      }

      const handleUpdate = () =>
      {
        props.updateCallback(props.id, name, email);
      }

      const addNewTitle = async () => 
      {
        const newUser = {
            title: newTodoTitle,
            completed:false
        };
    
        try {
            const response = await fetch(TodosUrl, {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-type': 'application/json',
                },
            });
    
            const data = await response.json();
            setTodos(prevUsers => [...prevUsers, data]);
            setNewTodoTitle('')
            setAddTodosDiv(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
      };


      const addNewPost = async () => 
      {
        const newUser = {
            title: newPostTitle,
            body:newPostBody
        };
    
        try {
            const response = await fetch(PostsUrl, {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-type': 'application/json',
                },
            });
    
            const data = await response.json();
            setPosts(prevUsers => [...prevUsers, data]);
            setNewPostBody('')
            setNewPostTitle('');
            setAddPostDiv(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
      };



    return(
        <>
        <div className="user-container">
        <br/>
            <div key={props.id} className={`user ${hasUncompeletedTasks(todos) ? 'red-border' : 'green-border'} ${isHighlighted ? 'orange-background' : ''}`} >
                <label title="Click for more INFO" className="onHover" onClick={() => {setIsHighlighted(!isHighlighted), setShowAdditionalDiv(!showAdditionalDiv)} }>
                  ID : {props.id}  <br/>
                </label>
                Name :<input type="text" value={name} onChange={(event) => setName(event.target.value)}/> <br/>
                Email : <input type="text" value={email} onChange={(event) => setEmail(event.target.value)}/>  <br/><br/>
                

                <button onClick={() => deleteTodosForUserId(props.id)}>Delete Todos for User </button><br/><br/>
                <button className="OtherData" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Other Data</button>

                {showAdditionalData && 
                (
                    <div className="additional-data">
                        Street : <input type="text" value={props.street}/> <br/>
                        City : <input type="text" value={props.city}/><br/>
                        Zip Code : <input type="text" value={props.zipCode}/><br/>
                    </div>
                )}
                
                
                <button className="updateBut" onClick={handleUpdate}>Update</button> <button className="addBut" onClick={sentToParent}>Delete</button>
            </div>

              {showAdditionalDiv && !addTodosDiv &&
                (
                  <div className="additional-div">
                    <b>Todos - User {props.id} </b> <button className="button" onClick={()=>setAddTodosDiv(true)}>Add</button>
                    <br/>
                    {
                      todos.map((todo,index) =>{
                        return<TodosList key={todo.id} title={todo.title} completed={todo.completed ? 'true' : 'false'} />
                      }) 
                    }
                  </div>
                )}

                {addTodosDiv &&
                  (
                    <>
                    
                    <div className="additional-div">
                    <div> <b> New Todo - User {props.id} </b></div><br/>
                      <b>Title : </b> <input type="text" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)}/><br />
                      <button className="cancelBut" onClick={()=>setAddTodosDiv(false)}>Cancel</button>
                       <button className="addBut" onClick={addNewTitle}>Add</button>
                    </div>
                    </>
                  )
                }

              {showAdditionalDiv && !addPostDiv &&
                (
                  <div className="additional-div">
                    <b>Posts - User {props.id}</b> <button className="button" onClick={()=>setAddPostDiv(true)}>Add</button>
                    <br/>
                    {
                      posts.map((post,index) =>{
                        return<PostsList key={post.id} title={post.title} body={post.body} />
                      }) 
                    }
                  </div>
                )}  

                {addPostDiv &&
                  (
                    <>
                    
                    <div className="additional-div">
                    <div> <b> New Post - User {props.id} </b></div><br/>
                      <b>Title : </b> <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)}/><br/><br/>
                      <b>Body : </b> <input type="text" value={newPostBody} onChange={(e) => setNewPostBody(e.target.value)}/> <br/>
                      <button className="cancelBut" onClick={()=>setAddPostDiv(false)}>Cancel</button>
                      <button className="addBut" onClick={addNewPost}>Add</button>
                    </div>
                    </>
                  )
                }  
        </div>
        
        </>
        
    )
}

export default ChildReadData