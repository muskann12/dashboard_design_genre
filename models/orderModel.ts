import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderData: {
    items: [
      {
        name: String,
        category: String,
        image: String,
        price: Number,
        size: String,
        quantity: Number,
        id: String,
      },
    ],
  },
  customer: {
    fullName: String,
    email: String,
    contactNumber: String,
  },
  address: {
    city: String,
    area: String,
    fullAddress: String,
  },
  payment: {
    subtotal: Number,
    discount: Number,
    deliveryFee: Number,
    total: Number,
    createdAt: { type: Date, default: Date.now },
    selectedMethod: String,
    accountName: String,
  },
  paymentDetails: {
    number: String,
    link: String,
  },
  delivered: { type: Boolean, default: false },
  total_pay_completed: { type: Boolean, default: false },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema, "order");

export default Order;
