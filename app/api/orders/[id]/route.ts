// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';  
import Order from '@/models/orderModel'; 

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const orderId = params.id;
  const body = await req.json();

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, body, { new: true });

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order updated', order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
