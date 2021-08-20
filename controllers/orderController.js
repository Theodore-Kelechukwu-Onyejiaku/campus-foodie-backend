const Order = require("../models/Order");

exports.makeOrder = async (req,res, next)=>{
    console.log(req.body);
    const reqBody = req.body;
    if(reqBody === null){
        res.statu(400).json({status: "fail", message:"please provide form request"})
    }

    const newOrder = new Order({
        customer : req.body.userId,
        amount: req.body.amount,
        destination: req.body.destination,
        customerLocation : req.body.latLong,
    })

    const orderList = req.body.products;
    const items = [];
    orderList.forEach(eachItem =>{
        newOrder.products.push(eachItem)
    })

    try {
         await newOrder.save();
         const user = User.findById({id: req.body.userId}).exec();
         if(user ===null){
            res.status(400).json({status: "fail", message:"No user found error"})
         }
         user.orders.push(newOrder._id)
         res.status(200).json({status: "ok", message:"Order was successfully placced!", order: newOrder})
    } catch (error) {
        res.status(404).json({status: "fail", message:error.message, order: null})
    }
}

exports.getOrders = async (req, res, next) =>{
    try {
        const orders = await Order.find({}).exec();
        if(orders === null){
            res.status(404).json({status: "fail", message:"no orders found", orders: null})
        }

        res.status(200).json({status: "ok", message: "orders found!", orders: orders})
    } catch (error) {
        res.status(404).json({status: "fail", message:error.message, orders: null})
    }
}


exports.getUserOrders = async (req, res, next)=>{
    try {
        console.log(req.params)
        
        const orders = await Order.find({customer: req.params.userId}).exec();
        console.log(req.params.userId)
        console.log(orders);
        res.status(200).json({status: "ok", orders});

    } catch (error) {
        console.log(error.message)
        res.status(400).json({status: "fail", orders: null, message: error.message})
    }
}

exports.cancelOrder = async(req, res, next) =>{
    try {
        const order = await Order.findById(req.body.orderId).exec()

        if(order == null){
            res.status(404).json({status: "fail", message:"no such order found", order: null})
        }
        order.status = "canceled";
        
        await order.save();

    } catch (error) {
        res.status(400).json({status: "fail", message:error.message, orders: null})
    }
}

exports.customerConfirmation = async (req, res, next) =>{
    try {
        const user = await User.findById(req.body.userId);

        if(user == null){
            res.status(404).json({status: "fail", message:"wrong user"});
        }

        const order = await User.findOne({customer: user._id});

        if(order == null){
            res.status(404).json({status: "fail", message:"no order found"});
        }

        order.customerConfirmation = req.body.confirmation;
        await order.save()
        res.status(200).json({status: "ok", message: "confirmation done!"});
    } catch (error) {
        res.status(400).json({status: "fail", message:error.message})
    }
}

exports.deliveryAgentConfirmation = async()=>{
    try {
        const user = await User.findById(req.body.userId);

        if(user == null){
            res.status(404).json({status: "fail", message:"wrong user"});
        }

        const order = await User.findOne({customer: user._id});

        if(order == null){
            res.status(404).json({status: "fail", message:"no order found"});
        }

        order.deliveryAgentConfirmation = req.body.confirmation;
        await order.save()
        res.status(200).json({status: "ok", message: "confirmation done!"});
    } catch (error) {
        res.status(400).json({status: "fail", message:error.message})
    }
}

exports.adminConfirm = async (req, res, next)=>{
    try {
        const order = await Order.findById(req.body.orderId);  
        if(order == null){
            res.status(404).json({status: "fail", message: "order not found"});
        }  
        order.done = true;
        await order.save();
        
        res.status(200).json({status: "ok", message: "confirmation successful!"})
    } catch (error) {
        res.status(400).json({status: "fail", message:error.message})
    }
}