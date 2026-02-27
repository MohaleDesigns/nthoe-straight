import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/api/server-client';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  selectedSize: string;
  color: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number | string;
  size: string;
  color?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      shippingDetails,
      cartItems,
      subtotal,
      shippingCost,
      total,
      selectedShippingMethod,
      paymentReference,
      userId
    } = body;

    // Validate required fields
    if (!shippingDetails.email || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the authenticated user if userId is provided
    let customerId: string;
    let user_id: string | null = null;

    if (userId) {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user || user.id !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      user_id = user.id;

      // Check if customer already exists for this user
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user_id)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;

        // Update customer details
        await supabase
          .from('customers')
          .update({
            email: shippingDetails.email,
            full_name: shippingDetails.fullName,
            phone: shippingDetails.phone,
            address: shippingDetails.address,
            city: shippingDetails.city,
            postal_code: shippingDetails.postalCode,
            province: shippingDetails.province
          })
          .eq('id', customerId);
      } else {
        // Create new customer
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            user_id: user_id,
            email: shippingDetails.email,
            full_name: shippingDetails.fullName,
            phone: shippingDetails.phone,
            address: shippingDetails.address,
            city: shippingDetails.city,
            postal_code: shippingDetails.postalCode,
            province: shippingDetails.province
          })
          .select('id')
          .single();

        if (customerError) {
          console.error('Error creating customer:', customerError);
          return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
          );
        }

        customerId = newCustomer.id;
      }
    } else {
      // For guest checkout, create customer without user_id
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: shippingDetails.email,
          full_name: shippingDetails.fullName,
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          postal_code: shippingDetails.postalCode,
          province: shippingDetails.province
        })
        .select('id')
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        return NextResponse.json(
          { error: 'Failed to create customer' },
          { status: 500 }
        );
      }

      customerId = newCustomer.id;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        order_number: orderNumber,
        status: 'processing',
        subtotal,
        shipping_cost: shippingCost,
        total,
        shipping_method: selectedShippingMethod.name,
        payment_reference: paymentReference,
        payment_status: 'paid'
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = cartItems.map((item: CartItem) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      size: item.selectedSize,
      color: item.color
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber
    });

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get customer for this user
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { orders: [] }
      );
    }

    // Get orders for this customer
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        subtotal,
        shipping_cost,
        total,
        shipping_method,
        payment_status,
        created_at,
        order_items (
          id,
          product_name,
          quantity,
          price,
          size,
          color
        )
      `)
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Transform the data to match our frontend format
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      date: order.created_at,
      status: order.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
      items: order.order_items.map((item: OrderItem) => ({
        id: item.id,
        name: item.product_name,
        quantity: item.quantity,
        price: Number(item.price),
        size: item.size
      })),
      total: Number(order.total),
      shippingMethod: order.shipping_method,
      paymentStatus: order.payment_status
    })) || [];

    return NextResponse.json({
      orders: transformedOrders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
