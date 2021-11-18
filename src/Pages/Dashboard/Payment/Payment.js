import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';

import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';


const stripePromise = loadStripe('pk_test_51JwA3yDuuoO6svmwC7qOoCvCr3pD4qjG67HOjkmYyDqA1OKWuQFVgLvOOvzW15C21Dp79YXIZXL751scyPBqAfv300D1e83ja7');


const Payment = () => {
    const {appointmentId} = useParams();
    const [appointment, setAppointment] =  useState([]); 
     
    console.log(appointmentId);

    useEffect(()=> {
      fetch(`http://localhost:5000/appointments/${appointmentId}`)
      .then(res => res.json())
      .then(data=> {
        console.log(data)
        setAppointment(data);
      })
    }, [appointmentId])



  /** 
    akhane theke amr chaile tax & extra service charvice change mite pari.
    amra chaile akhane theke coupone system kore nite pari,
    database a coupone er akta value rakte hobe then user jodi seta k input feild
    a dey seta giye data base a queary korbe mile gece return hisebe take akta discout 
    amount show korbe. amra chaile ata ($redex) diye eassyly korte parbo.
  */

  


    return (
        <div>
            <h2>This is Payment place: {appointmentId}</h2>
              <p>Patient Name: {appointment.serviceName}</p>
              <p>Patient Name: {appointment.patientName}</p>
              <p>Patient Name: {appointment.date}</p>
            <h2>Pay: ${appointment.price}</h2>
              {/* from stripe react */}
            { 
              appointment.price && 
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  appointment={appointment}
                />
              </Elements>
            }
        </div>
    );
};

export default Payment;



/*
1. install stripe and stripe-react
2. set publishable key
3. Elements
4. Checkout Form
-----
5. Create payment method
6. server: create payment Intent api
7. Load client secret
8. ConfirmCard payment
9. handle user error
*/






