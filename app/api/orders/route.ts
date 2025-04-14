// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/orderModel';

export async function GET() {
  try {
    // Get the database connection
    const { db } = await connectDB();
    
    // Type-safe native MongoDB operations
    const ordersCollection = db.collection('order');
    const count = await ordersCollection.countDocuments();
    console.log(`Total orders: ${count}`);


    // Mongoose operations
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Database operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
