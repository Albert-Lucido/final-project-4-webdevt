import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser , setNewUser ] = useState({ personnelId: '', role: '', password: '' });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    // Fetch existing users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser ({ ...newUser , [name]: value });
  };

  const addUser  = async () => {
    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = newUser ;
      setUsers(updatedUsers);
      setEditIndex(null);
    } else {
      try {
        console.log('Adding user:', newUser ); // Log the user data being added
        // Make a POST request to add the new user to the EmployeeCollection
        const response = await axios.post('http://localhost:5000/api/users', newUser );
        console.log('User  added:', response.data); // Log the response from the server
        setUsers([...users, response.data]);
      } catch (error) {
        console.error('Error adding user:', error.response ? error.response.data : error.message);
      }
    }
    setNewUser ({ personnelId: '', role: '', password: '' });
  };

  const editUser  = (index) => {
    setNewUser (users[index]);
    setEditIndex(index);
  };

  const removeUser  = async (index) => {
    const userId = users[index]._id; // Assuming the user object has an _id field
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`); // Make sure to implement a DELETE route in your backend
      const newUsers = users.filter((_, i) => i !== index);
      setUsers(newUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-management">
      <h3>User Management</h3>
      <div>
        <input
          type="text"
          name="personnelId"
          placeholder="Personnel ID"
          value={newUser.personnelId}
          onChange={handleChange}
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="Employee">Employee</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Temporary Password"
          value={newUser.password}
          onChange={handleChange}
        />
        <button onClick={addUser }>{editIndex !== null ? 'Update User' : 'Add User'}</button>
      </div>
      <div>
        <h4>Current Users</h4>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.personnelId} - {user.role}
              <button onClick={() => editUser (index)}>Edit</button>
              <button onClick={() => removeUser (index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserManagement;