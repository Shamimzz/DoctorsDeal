import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';


const Doctors = () => {
   const [doctors, setDoctors] = useState([]); 

   useEffect(()=> {
     fetch(`http://localhost:5000/doctors`)
     .then(res=> res.json())
     .then(data=> {
        setDoctors(data)
        console.log(data)
     })
   },[])

   // Here decoded image ta aktu alada vabe kisu attributes dite hobe.

    return (
        <div className="container pt-5 pb-5">
        <h2>Our Doctors: {doctors.length}</h2>
        <Container>
            <Grid container spacing={2}>
                {doctors.map(doctor => 
                    <Grid item xs={12} sm={6} md={4}>
                        <img
                        style={{ width: '200px', height: '200px' }}
                        src={`data:image/png;base64,${doctor.image}`} alt="" />
                     <h3>{doctor.name}</h3>
                   </Grid>
                 )}
            </Grid>
        </Container>
    </div>
    );
};

export default Doctors;