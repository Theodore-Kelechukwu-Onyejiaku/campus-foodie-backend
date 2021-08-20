const Payment = require("../models/Payment");
const User = require("../models/User");


exports.makePayment = async (req, res, next) =>{
    if(req.body === null){
        res.status(400).json({status: "fail", message: "no request body"})
    }
    const payment = new Payment({
        customer : req.body.userId,
        order: req.body.orderId,
        name : req.body.nameOfSender,
        email: req.body.emailOfSender,
        phone_number: req.body.phoneOfSender,
        transaction_id: req.body.transaction_id,
        tx_ref: req.body.tx_ref,
        flw_ref: req.body.flw_ref,
        currency: req.body.currency,
        amount: req.body.amount,
    })
    
    try {
        await payment.save();
        res.status(200).json({status: "ok", message: "Payment Success"})
    } catch (error) {
        res.status(400).json({status: "ok", message: error.message})            
    }
}

exports.getPayments = async (req, res, next)=>{
    console.log("na wa oooooo")
    console.log(req.params.userId)
    try {
        const payments = await Payment.find({customer: req.params.userId}).exec();

        console.log(payments);
        res.status(200).json({status: "ok", payments: payments});
        
    } catch (error) {
        console.log(error.message)
        res.status(400).json({status: "fail", payments: null, message: error.message})
    }
}