const express = require("express");
const adminRouter = express.Router();
const admin = require("../middleware/admin_middleware");
const Order = require("../models/order_model");
const { Product } = require("../models/product_model");


// Add product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const { name, description, images, quantity, price, category } = req.body;
    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get all products

adminRouter.get('/admin/get-product/',admin,async(req,res)=>{
  try{
const products=await Product.find({});
res.json(products);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
})

//delete the product

adminRouter.post("/admin/delete-product/",admin,async(req,res)=>{

  try{
    const {id}=req.body;
    const products=await Product.findByIdAndDelete(id);

    res.json(products);
  }catch(e){
res.status(500).json({error:e.message});
  }
});

//fetch all order

adminRouter.get('/admin/get-orders/',admin,async(req,res)=>{
try{
  const order=await Order.find({});
  res.json(order);

}catch(e){
  res.status(500).json({error:e.message});

}
});
//order status change

adminRouter.post("/admin/change/order-status/",admin,async(req,res)=>{
  try{
const {id,status}=req.body;
let order=await Order.findById(id);
order.status=status;
order =await order.save();
res.json(order);
  }catch(e){
    res.status(500).json({error:e.message});
  }
})


adminRouter.get("/admin/analytics/",admin, async(req,res)=>{
  try{
const order=await Order.find({});
let totalEarnings=0;

for(let i=0; i<order.length; i++){
  for(let j=0; i<order[i].products.length; j++){
    totalEarnings += order[i].products[j].quantity * order[i].products[j].price
  }
}
// category wishe order fetching

let mobileEarings= await fetchCategoryWiseProduct("Mobiles");
let essentialsEarings= await fetchCategoryWiseProduct("Essentials");
let appliancesEarings= await fetchCategoryWiseProduct("Appliances");
let booksEarings= await fetchCategoryWiseProduct("Books");
let fashionEarings= await fetchCategoryWiseProduct("Fashion");
let earnings={
  totalEarnings,
  mobileEarings,
  essentialsEarings,
  appliancesEarings,
  booksEarings,
  fashionEarings
}
res.json(earnings);
  }catch(e){
    res.status(500).json({error:e.message});
  }
});



async function fetchCategoryWiseProduct(category){
  let earnings=0;
let categoryOrders=await Order.find({
  'products.product.category': category,
});
//this order collection product arry then quantity
for(let i =0; i<categoryOrders.length; i++){
  for(let j=0; i<categoryOrders[i].products.length; i++){
    earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].price
  }
}
return earnings;
}

module.exports=adminRouter;