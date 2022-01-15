
// Inside app.js 
const express = require('express');
const Razorpay = require('razorpay'); 
const crypto = require('crypto');
  
const razorpayInstance = new Razorpay({
  
    // Replace with your key_id
    key_id: 'rzp_test_haZUXiwwBKBagH',
  
    // Replace with your key_secret
    key_secret: 'yl8J6xefR8c8NJsWmutTmNfw'
});
  
const app = express();
const PORT = process.env.PORT || '5000';

app.use(express.json());
  
app.post('/createOrder', (req, res)=>{ 
  
    const {amount,currency,receipt, notes}  = req.body;      // amount in paise
   
    razorpayInstance.orders.create({amount, currency, receipt, notes}, 
        (err, order)=>{
          
          if(!err)
            res.json(order)
          else
            res.send(err);
        }
    )
});

app.post('/verifyOrder',  (req, res)=>{ 
      
    // STEP 7: Receive Payment Data
    const {order_id, payment_id} = req.body;     
    const razorpay_signature =  req.headers['x-razorpay-signature'];
  
    // Pass yours key_secret here
    const key_secret = 'yl8J6xefR8c8NJsWmutTmNfw';     
  
    // STEP 8: Verification & Send Response to User
      
    // Creating hmac object 
    let hmac = crypto.createHmac('sha256', key_secret); 
  
    // Passing the data to be hashed
    hmac.update(order_id + "|" + payment_id);
      
    // Creating the hmac in the required format
    const generated_signature = hmac.digest('hex');
      
      
    if(razorpay_signature===generated_signature){
        res.json({success:true, message:"Payment has been verified"})
    }
    else
    res.json({success:false, message:"Payment verification failed"})
});

app.listen(PORT, ()=>{
    console.log("Server is Listening on Port ", PORT);
});