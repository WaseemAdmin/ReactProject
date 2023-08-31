import ChildReadData from "./ChildReadData";
import { useEffect, useState } from "react";
import axios from 'axios';

const Usersurl = 'https://jsonplaceholder.typicode.com/users';

const ParentReadData = () =>
{
    const [users,setUsers] = useState([]); 
    const [searchText, setSearchText] = useState('');
    const [addUserDiv,setAddUserDiv] = useState(false);
    const [newUserName, setNewUserName] = useState(''); 
    const [newUserEmail, setNewUserEmail] = useState(''); 
    const [userAdded, setUserAdded] = useState(false);

    const filteredUsers = users.filter(user => {
        const search = searchText.toLowerCase();
        return (
          user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)
        );
      });



    useEffect(() =>{
        const getallUsers = async () =>
        {
            const {data} = await axios.get(Usersurl);
            setUsers(data);
        }
       getallUsers();
    },[]);

    useEffect(() => {
        if (userAdded) {
            const timeout = setTimeout(() => {
                setUserAdded(false);
            }, 5000); // Notification disappears after 5 seconds
            return () => clearTimeout(timeout);
        }
    }, [userAdded]);


    const deleteUser = (userId) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      };

    
    const updateUser = (userId, updatedName, updatedEmail) => 
    {
        setUsers(prevUsers => prevUsers.map(user => 
            {
                if (user.id === userId) {
                    return { ...user, name: updatedName, email: updatedEmail };
                }
                return user;
            })
        );
    };


    const addNewUser = async () => {
        const newUser = {
            name: newUserName,
            email: newUserEmail,
            username: newUserName.toLowerCase(),
            address: {
                street: "new Street",
                city: "new City",
                zipcode: "0000000",
            }
        };
    
        try {
            const response = await fetch(Usersurl, {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-type': 'application/json',
                },
            });
    
            const data = await response.json();
            setUsers(prevUsers => [...prevUsers, data]);
            setNewUserEmail('');
            setNewUserName('');
            setAddUserDiv(false); // Close the add user form after adding
            setUserAdded(true);

        } catch (error) {
            console.error('Error adding user:', error);
        }
    };
   

    return(
        <>
        
        Search <input type="text" value={searchText} onChange={event => setSearchText(event.target.value)}/> 
        <button className="addBut" onClick={()=>setAddUserDiv(true)}>Add</button><br/>

        {addUserDiv&&(
            <>
            <label className="UserAddLabel"><b>Add New User</b></label> 
            <div className="addUser-div">
                <b>Name : </b> <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} /> <br/>
                <b>Email : </b> <input type="text" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />  <br/><br/>
                <button className="cancelBut" onClick={()=>setAddUserDiv(false)}>Cancel</button> 
                 <button className="addBut"  onClick={addNewUser}>Add</button>

            </div>
            </>
        )}

        {userAdded && <p>New user has been added!</p>}



        <div>

            {
                filteredUsers.map((user)=>{
                    return<ChildReadData
                              callback={deleteUser} 
                              updateCallback={updateUser}
                              key={user.id} 
                              id={user.id} 
                              name={user.name} 
                              email={user.email} 
                              street={user.address.street} 
                              city={user.address.city} 
                              zipCode={user.address.zipcode}/>;
                })
            }
        </div>
        
        </>
    )
}

export default ParentReadData;