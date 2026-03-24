require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req,res)=>{
  const { cartItems } = req.body;
  const line_items = cartItems.map(item => ({
    price_data:{
      currency:'eur',
      product_data:{name:item.name},
      unit_amount: Math.round(item.price*100)
    },
    quantity:1
  }));

  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items,
      mode:'payment',
      success_url:`${process.env.CLIENT_URL}/success.html`,
      cancel_url:`${process.env.CLIENT_URL}/producten.html`
    });
    res.json({url: session.url});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Checkout mislukt'});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server draait op poort ${PORT}`));

app.get('/', (req, res) => {
  res.send('Welkom bij De Goude Korst backend!');
});