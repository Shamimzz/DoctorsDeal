import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useAuth from './../../../hooks/useFirebase';


const MakeAdmin = () => {
  const {token} = useAuth()
    const [email, setEmail] = useState('');

    const handleOnBlur = e => {
      setEmail(e.target.value);
    }

    const onSubmit = e => {
    const adminEmail = {email};
    fetch('http://localhost:5000/users/admin', {
        method: 'PUT',
        headers: {
           'authorization' : `Bearer ${token}`,
           'Content-Type': 'application/json'
          },
        body: JSON.stringify(adminEmail)
    }).then(res=> res.json())
      .then(data => {
        console.log(data)
        if(data.matchedCount){
            alert('Admin created');
        }
      })
     e.preventDefault();
    }

    return (
      <div>
          <h2>Make an Admin</h2>
          <form onClick={onSubmit}>
            <TextField
            id="standard-helperText"
            label="Email"
            name="email"
            onBlur={handleOnBlur}
            variant="standard"
            />
            <Button variant="contained">Make Admin</Button>
          </form>
      </div>
    );
};

export default MakeAdmin;