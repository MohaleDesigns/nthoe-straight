-- Seed data for user 9a19a78c-60e1-42b0-b36a-7177149e426c
-- This creates two sample orders for testing the orders page

-- First, create a customer record for this user (if not exists)
INSERT INTO customers (user_id, email, full_name, phone, address, city, postal_code, province)
VALUES (
  '9a19a78c-60e1-42b0-b36a-7177149e426c',
  'tokolohomohale@gmail.com',
  'John Doe',
  '0821234567',
  '123 Main Street',
  'Johannesburg',
  '2000',
  'Gauteng'
)
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = TIMEZONE('utc', NOW())
RETURNING id;

-- Get the customer_id for the inserted/updated customer
DO $$
DECLARE
  customer_uuid UUID;
  order1_uuid UUID;
  order2_uuid UUID;
BEGIN
  -- Get customer ID
  SELECT id INTO customer_uuid
  FROM customers
  WHERE user_id = '9a19a78c-60e1-42b0-b36a-7177149e426c';

  -- Order 1: Processing order with 2 items
  order1_uuid := gen_random_uuid();

  INSERT INTO orders (id, customer_id, order_number, status, subtotal, shipping_cost, total, shipping_method, payment_reference, payment_status)
  VALUES (
    order1_uuid,
    customer_uuid,
    'ORD-20250227001',
    'processing',
    899.98,
    60.00,
    959.98,
    'Standard Shipping (3-5 days)',
    'PAY123456789',
    'paid'
  );

  -- Order 1 items
  INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size, color)
  VALUES
    (order1_uuid, 1, 'Classic White T-Shirt', 2, 299.99, 'M', 'White'),
    (order1_uuid, 3, 'Denim Jeans', 1, 599.99, '32', 'Blue');

  -- Order 2: Delivered order with 1 item
  order2_uuid := gen_random_uuid();

  INSERT INTO orders (id, customer_id, order_number, status, subtotal, shipping_cost, total, shipping_method, payment_reference, payment_status)
  VALUES (
    order2_uuid,
    customer_uuid,
    'ORD-20250220001',
    'delivered',
    1299.99,
    0.00,
    1299.99,
    'Free Shipping',
    'PAY987654321',
    'paid'
  );

  -- Order 2 items
  INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size, color)
  VALUES
    (order2_uuid, 5, 'Premium Leather Jacket', 1, 1299.99, 'L', 'Black');

END $$;
