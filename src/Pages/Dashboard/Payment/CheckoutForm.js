  import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
  import useAuth from '../../../hooks/useAuth.js'; 
  import { CircularProgress } from '@mui/material';

  import React, { useEffect, useState } from 'react';
  
  const CheckoutForm = ({appointment}) => {
    const{price, patientName, _id} = appointment;
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const {user} = useAuth();
    
    const [success, setSuccess] = useState('');
    const [processing, setProcessing] = useState(false);


    const stripe = useStripe();
    const elements = useElements();


    useEffect(()=> {
        fetch(`http://localhost:5000/create-payment-intent`,{
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({price})
        })
        .then(res => res.json())
        .then(data=> {
        //   console.log(data.clientSecret)
          setClientSecret(data.clientSecret); 
        })
      }, [price])
  
  
  




    const handleSubmit = async (e) => {
       e.preventDefault();
       if (!stripe || !elements) {
           return;
       } 
       const card = elements.getElement(CardElement);
       if (card === null) {
           return;
       }

       setProcessing(true);
       const { error, paymentMethod } = await stripe.createPaymentMethod({
           type: 'card',
           card
       });
       if (error) {
           setError(error.message);
           setSuccess('');
       }
       else {
           setError('');
           console.log(paymentMethod);
       }
         

      // payment intent from stripe.confirmCardPayment
      const {paymentIntent, error: intentError} = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: card,
              billing_details: {
                name: patientName, // frm appointment
                email: user.email, // frm userAuth.
              },
            },
          },
        );
  
    if(intentError) {
      setError(intentError.message);
      setSuccess('');
    }
    else{
      setError('');
      setSuccess('Your payment processed successfully.')
      console.log(paymentIntent);
      setProcessing(false);

      // save to database
      const payment = {
        amount: paymentIntent.amount,
        created: paymentIntent.created,
        last4: paymentMethod.card.last4,
        transaction: paymentIntent.client_secret.slice('_secret')[0]
    }
      const url = `http://localhost:5000/appointments/${_id}`;
      fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(payment)
    })
        .then(res => res.json())
        .then(data => console.log(data));

    }
  
          
    }

    return (
   
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      { processing ? <CircularProgress></CircularProgress>   
         :      
        <button type="submit" disabled={!stripe}>
          Pay ${price}
        </button>
      }
      {
         error && <p style={{ color: 'red' }}>{error}</p>
      }
      {
        success && <p style={{ color: 'green' }}>{success}</p>
      }
    </form>

    );
}
export default CheckoutForm;



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






* processing state is called for when user press payments
  button & there will be show a spinner when process is complete
  button will be shown.
  
* payment will be successful the payment button will
  be disable..  










*/

