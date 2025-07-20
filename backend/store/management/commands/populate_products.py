from django.core.management.base import BaseCommand
from store.models import Product

class Command(BaseCommand):
    help = 'Populate database with sample products'

    def handle(self, *args, **options):
        products_data = [
            # Electronics & Tech
            {
                'name': 'Wireless Bluetooth Headphones',
                'description': 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
                'price': 89.99,
                'inventory_count': 50,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
            },
            {
                'name': 'Smart Fitness Watch',
                'description': 'Advanced fitness tracker with heart rate monitoring, GPS, and water resistance. Track your workouts and health metrics.',
                'price': 199.99,
                'inventory_count': 30,
                'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
            },
            {
                'name': 'Premium Coffee Maker',
                'description': 'Programmable coffee maker with built-in grinder and thermal carafe. Brew the perfect cup every time.',
                'price': 149.99,
                'inventory_count': 25,
                'image_url': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop'
            },
            {
                'name': 'Organic Cotton T-Shirt',
                'description': 'Comfortable and sustainable cotton t-shirt made from 100% organic materials. Available in multiple colors.',
                'price': 24.99,
                'inventory_count': 100,
                'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
            },
            {
                'name': 'Portable Bluetooth Speaker',
                'description': 'Waterproof portable speaker with 360-degree sound and 12-hour battery life. Perfect for outdoor adventures.',
                'price': 79.99,
                'inventory_count': 40,
                'image_url': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'
            },
            {
                'name': 'Stainless Steel Water Bottle',
                'description': 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Eco-friendly and durable.',
                'price': 34.99,
                'inventory_count': 75,
                'image_url': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop'
            },
            {
                'name': 'Wireless Charging Pad',
                'description': 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicators.',
                'price': 49.99,
                'inventory_count': 60,
                'image_url': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop'
            },
            {
                'name': 'Yoga Mat Premium',
                'description': 'Non-slip yoga mat made from eco-friendly materials. Perfect thickness for comfort and stability.',
                'price': 39.99,
                'inventory_count': 45,
                'image_url': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop'
            },
            {
                'name': 'Smart Home Security Camera',
                'description': '1080p security camera with night vision, motion detection, and two-way audio. Monitor your home remotely.',
                'price': 129.99,
                'inventory_count': 35,
                'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
            },
            {
                'name': 'Leather Laptop Bag',
                'description': 'Premium leather laptop bag with multiple compartments and padded protection. Professional and stylish.',
                'price': 89.99,
                'inventory_count': 20,
                'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
            },
            {
                'name': 'Digital Kitchen Scale',
                'description': 'Precise digital scale with tare function and multiple units. Perfect for cooking and baking.',
                'price': 29.99,
                'inventory_count': 55,
                'image_url': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop'
            },
            {
                'name': 'Aromatherapy Diffuser',
                'description': 'Ultrasonic diffuser with LED mood lighting and timer settings. Create a relaxing atmosphere.',
                'price': 44.99,
                'inventory_count': 30,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            # Additional Electronics
            {
                'name': '4K Smart TV 55"',
                'description': 'Ultra HD smart TV with HDR, built-in streaming apps, and voice control. Immersive viewing experience.',
                'price': 599.99,
                'inventory_count': 15,
                'image_url': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'
            },
            {
                'name': 'Gaming Laptop Pro',
                'description': 'High-performance gaming laptop with RTX graphics, 16GB RAM, and 1TB SSD. Dominate any game.',
                'price': 1299.99,
                'inventory_count': 10,
                'image_url': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop'
            },
            {
                'name': 'iPhone 15 Pro',
                'description': 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. The ultimate smartphone.',
                'price': 999.99,
                'inventory_count': 25,
                'image_url': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
            },
            {
                'name': 'MacBook Air M2',
                'description': 'Ultra-thin laptop with M2 chip, all-day battery life, and stunning Retina display. Perfect for work and creativity.',
                'price': 1199.99,
                'inventory_count': 18,
                'image_url': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
            },
            {
                'name': 'Sony WH-1000XM5',
                'description': 'Industry-leading noise-canceling headphones with exceptional sound quality and 30-hour battery life.',
                'price': 349.99,
                'inventory_count': 22,
                'image_url': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'
            },
            {
                'name': 'DJI Mini 3 Pro Drone',
                'description': 'Ultra-lightweight drone with 4K camera, obstacle avoidance, and 34-minute flight time. Capture stunning aerial footage.',
                'price': 759.99,
                'inventory_count': 12,
                'image_url': 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop'
            },
            # Home & Kitchen
            {
                'name': 'Instant Pot Duo',
                'description': '7-in-1 electric pressure cooker that replaces 7 kitchen appliances. Cook meals up to 70% faster.',
                'price': 89.99,
                'inventory_count': 35,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Vitamix Professional Blender',
                'description': 'Commercial-grade blender with 64-ounce container and variable speed control. Perfect for smoothies and soups.',
                'price': 449.99,
                'inventory_count': 8,
                'image_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
            },
            {
                'name': 'KitchenAid Stand Mixer',
                'description': 'Professional stand mixer with 10-speed motor and tilt-head design. Essential for baking enthusiasts.',
                'price': 379.99,
                'inventory_count': 15,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Ninja Foodi Grill',
                'description': '9-in-1 indoor grill with air fryer, dehydrator, and more. Grill, air fry, roast, and bake all in one.',
                'price': 199.99,
                'inventory_count': 20,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Dyson V15 Detect',
                'description': 'Cord-free vacuum with laser dust detection and 60-minute runtime. Deep clean your home effortlessly.',
                'price': 699.99,
                'inventory_count': 12,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            # Fashion & Accessories
            {
                'name': 'Ray-Ban Aviator Classic',
                'description': 'Timeless aviator sunglasses with UV400 protection and gold-tone frame. Iconic style for any occasion.',
                'price': 154.99,
                'inventory_count': 30,
                'image_url': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
            },
            {
                'name': 'Rolex Submariner',
                'description': 'Luxury dive watch with automatic movement and water resistance to 300m. The ultimate status symbol.',
                'price': 8999.99,
                'inventory_count': 3,
                'image_url': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop'
            },
            {
                'name': 'Nike Air Jordan 1',
                'description': 'Classic basketball sneakers with premium leather construction and iconic design. Streetwear essential.',
                'price': 170.99,
                'inventory_count': 40,
                'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
            },
            {
                'name': 'Hermès Birkin Bag',
                'description': 'Handcrafted luxury handbag made from premium leather. The most coveted accessory in fashion.',
                'price': 12000.99,
                'inventory_count': 1,
                'image_url': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
            },
            {
                'name': 'Apple Watch Series 9',
                'description': 'Latest smartwatch with health monitoring, fitness tracking, and cellular connectivity. Stay connected and healthy.',
                'price': 399.99,
                'inventory_count': 28,
                'image_url': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400&h=400&fit=crop'
            },
            # Sports & Outdoor
            {
                'name': 'Peloton Bike+',
                'description': 'Premium indoor cycling bike with 24" rotating HD touchscreen and live classes. Transform your home workouts.',
                'price': 2495.99,
                'inventory_count': 8,
                'image_url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
            },
            {
                'name': 'Yeti Tundra 65 Cooler',
                'description': 'Premium hard cooler with superior ice retention and bear-resistant design. Perfect for outdoor adventures.',
                'price': 399.99,
                'inventory_count': 15,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'GoPro Hero 11 Black',
                'description': '5.3K action camera with HyperSmooth 5.0 stabilization and waterproof design. Capture your adventures.',
                'price': 499.99,
                'inventory_count': 18,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Patagonia Down Jacket',
                'description': 'Warm and lightweight down jacket with water-resistant shell. Perfect for cold weather adventures.',
                'price': 229.99,
                'inventory_count': 25,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Trek Domane SLR',
                'description': 'Ultra-lightweight carbon road bike with electronic shifting and disc brakes. Professional-grade performance.',
                'price': 8999.99,
                'inventory_count': 5,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            # Books & Entertainment
            {
                'name': 'Kindle Paperwhite',
                'description': 'Waterproof e-reader with 8GB storage and adjustable warm light. Read anywhere, anytime.',
                'price': 139.99,
                'inventory_count': 35,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Sony PlayStation 5',
                'description': 'Next-generation gaming console with 4K graphics and lightning-fast loading. The future of gaming.',
                'price': 499.99,
                'inventory_count': 20,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Nintendo Switch OLED',
                'description': 'Handheld gaming console with 7-inch OLED screen and enhanced audio. Play anywhere with stunning visuals.',
                'price': 349.99,
                'inventory_count': 30,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Bose QuietComfort 45',
                'description': 'Premium noise-canceling headphones with 24-hour battery life and exceptional comfort.',
                'price': 329.99,
                'inventory_count': 22,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'JBL Flip 6',
                'description': 'Portable waterproof speaker with 12 hours of playtime and PartyBoost for stereo sound.',
                'price': 129.99,
                'inventory_count': 40,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            # Beauty & Personal Care
            {
                'name': 'Dyson Airwrap Multi-styler',
                'description': 'Revolutionary hair styling tool that dries, curls, waves, and smooths hair without extreme heat.',
                'price': 599.99,
                'inventory_count': 15,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'La Mer Moisturizing Cream',
                'description': 'Luxury moisturizing cream with Miracle Broth and sea kelp. Transform your skin with this iconic formula.',
                'price': 349.99,
                'inventory_count': 12,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Philips Sonicare DiamondClean',
                'description': 'Premium electric toothbrush with diamond-clean technology and smart sensor. Professional dental care at home.',
                'price': 199.99,
                'inventory_count': 25,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Foreo Luna 3',
                'description': 'Smart facial cleansing device with T-Sonic technology and customizable intensity levels.',
                'price': 199.99,
                'inventory_count': 18,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Chanel N°5 Eau de Parfum',
                'description': 'Iconic fragrance with notes of rose, jasmine, and vanilla. The most famous perfume in the world.',
                'price': 135.99,
                'inventory_count': 30,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            # Budget Products
            {
                'name': 'USB-C Charging Cable',
                'description': 'High-speed USB-C cable with fast charging capability. Compatible with all modern devices.',
                'price': 9.99,
                'inventory_count': 200,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Phone Stand Holder',
                'description': 'Adjustable phone stand with non-slip base. Perfect for watching videos or video calls.',
                'price': 12.99,
                'inventory_count': 150,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Wireless Mouse',
                'description': 'Ergonomic wireless mouse with 6-month battery life and precise tracking. Comfortable for long use.',
                'price': 19.99,
                'inventory_count': 100,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Laptop Cooling Pad',
                'description': 'USB-powered cooling pad with adjustable fan speeds. Keep your laptop cool during intensive tasks.',
                'price': 24.99,
                'inventory_count': 80,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            },
            {
                'name': 'Screen Protector Pack',
                'description': 'Tempered glass screen protectors for smartphones. Crystal clear protection with easy installation.',
                'price': 14.99,
                'inventory_count': 120,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
            }
        ]

        created_count = 0
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created product: {product.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Product already exists: {product.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new products out of {len(products_data)} total products')
        ) 