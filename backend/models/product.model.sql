create table products(
    product_price numeric not null
    product_name text not null
    image_url text default 'some_image'
    product_description text not null default 'Product Description'
    product_id uuid primary key default gen_random_uuid()
    manufacturer not null
)   