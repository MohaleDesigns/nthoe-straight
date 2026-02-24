# Database Setup Guide

This document explains how to set up the customer and order management system in your Supabase database.

## Prerequisites
- A Supabase project with the connection details already configured in `.env`

## Setting up the Database Tables

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Run each of the SQL migration files in order:

#### 1. Create Customers Table
Copy and paste the contents of `supabase/migrations/001_create_customers_table.sql` and run it.

This creates:
- `customers` table with fields for user info, shipping details
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamp updates

#### 2. Create Orders Table
Copy and paste the contents of `supabase/migrations/002_create_orders_table.sql` and run it.

This creates:
- `orders` table linked to customers
- Order status tracking
- Payment information storage
- RLS policies to ensure customers can only see their own orders

#### 3. Create Order Items Table
Copy and paste the contents of `supabase/migrations/003_create_order_items_table.sql` and run it.

This creates:
- `order_items` table to store individual products in each order
- Links to orders table
- RLS policies

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Apply all migrations
supabase db push

# Or apply individual migrations
supabase migration up --file 001_create_customers_table.sql
supabase migration up --file 002_create_orders_table.sql
supabase migration up --file 003_create_order_items_table.sql
```

## Database Schema

### Tables

#### customers
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to auth.users)
- `email`: Text
- `full_name`: Text
- `phone`: Text
- `address`: Text
- `city`: Text
- `postal_code`: Text
- `province`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### orders
- `id`: UUID (primary key)
- `customer_id`: UUID (foreign key to customers)
- `order_number`: Text (unique)
- `status`: Text (pending, processing, shipped, delivered, cancelled)
- `subtotal`: Decimal
- `shipping_cost`: Decimal
- `total`: Decimal
- `shipping_method`: Text
- `payment_reference`: Text
- `payment_status`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### order_items
- `id`: UUID (primary key)
- `order_id`: UUID (foreign key to orders)
- `product_id`: Integer
- `product_name`: Text
- `quantity`: Integer
- `price`: Decimal
- `size`: Text
- `color`: Text
- `created_at`: Timestamp

## Security

The database uses Row Level Security (RLS) to ensure:
- Customers can only view their own data
- Customers can only view their own orders
- All insert/update operations are authenticated

## Testing the Setup

After setting up the database:

1. Sign up a new user account
2. Add products to the cart
3. Complete the checkout process
4. After successful payment, the order should be saved to the database
5. Navigate to `/orders` page to see the order history

## Troubleshooting

### Orders not appearing
- Check that the user is logged in
- Verify the database tables were created successfully
- Check the browser console for any API errors

### Permission errors
- Ensure RLS policies were created
- Check that the service role key is not being used on the client side
- Verify the user is authenticated

### Database connection issues
- Check that `.env` file has correct Supabase credentials
- Ensure the Supabase project is active
- Verify network connectivity
