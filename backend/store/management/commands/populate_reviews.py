from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from store.models import Product, Review
import random

class Command(BaseCommand):
    help = 'Populate database with sample reviews'

    def handle(self, *args, **options):
        # Create some sample users if they don't exist
        sample_users = [
            {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
            {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
            {'username': 'mike_wilson', 'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Wilson'},
            {'username': 'sarah_jones', 'email': 'sarah@example.com', 'first_name': 'Sarah', 'last_name': 'Jones'},
            {'username': 'david_brown', 'email': 'david@example.com', 'first_name': 'David', 'last_name': 'Brown'},
            {'username': 'emma_davis', 'email': 'emma@example.com', 'first_name': 'Emma', 'last_name': 'Davis'},
            {'username': 'alex_taylor', 'email': 'alex@example.com', 'first_name': 'Alex', 'last_name': 'Taylor'},
            {'username': 'lisa_anderson', 'email': 'lisa@example.com', 'first_name': 'Lisa', 'last_name': 'Anderson'},
            {'username': 'tom_martin', 'email': 'tom@example.com', 'first_name': 'Tom', 'last_name': 'Martin'},
            {'username': 'rachel_garcia', 'email': 'rachel@example.com', 'first_name': 'Rachel', 'last_name': 'Garcia'},
        ]

        users = []
        for user_data in sample_users:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            users.append(user)
            if created:
                self.stdout.write(f'Created user: {user.username}')

        # Sample review titles and comments
        review_titles = [
            "Excellent product!", "Great value for money", "Highly recommended", 
            "Good quality", "Disappointed", "Amazing features", "Solid build quality",
            "Worth every penny", "Could be better", "Perfect for my needs",
            "Fast delivery", "Good customer service", "Exceeds expectations",
            "Not bad", "Love it!", "Decent product", "Outstanding quality",
            "Meets expectations", "Good but expensive", "Fantastic purchase"
        ]

        review_comments = [
            "This product exceeded my expectations. The quality is outstanding and it works perfectly for my needs.",
            "Great value for the price. I'm very satisfied with this purchase and would recommend it to others.",
            "The product arrived quickly and was well-packaged. It's exactly as described and works great.",
            "I'm impressed with the build quality and features. This is definitely worth the investment.",
            "Good product overall, but there are some minor issues that could be improved in future versions.",
            "This is exactly what I was looking for. The quality is excellent and it's very easy to use.",
            "I've been using this for a few weeks now and I'm very happy with it. Highly recommended!",
            "The product is well-made and durable. It's perfect for my daily use and I love the design.",
            "Good product with nice features. The price is reasonable and the quality is decent.",
            "I'm satisfied with this purchase. It meets my expectations and works as advertised.",
            "Excellent quality and fast shipping. This product is definitely worth buying.",
            "Great product with amazing features. I'm very happy with my purchase.",
            "The product is well-designed and functional. It's perfect for what I need.",
            "Good value for money. The quality is decent and it works well.",
            "I love this product! It's exactly what I was looking for and the quality is excellent.",
            "Solid product with good features. I'm satisfied with my purchase.",
            "Outstanding quality and performance. This product is definitely worth the price.",
            "The product meets my expectations and works well. I'm happy with my purchase.",
            "Good product but a bit expensive. The quality is good though.",
            "Fantastic product! I'm very impressed with the quality and features."
        ]

        products = Product.objects.all()
        created_reviews = 0

        for product in products:
            # Generate 3-8 reviews per product
            num_reviews = random.randint(3, 8)
            
            for i in range(num_reviews):
                user = random.choice(users)
                
                # Generate rating based on product price (higher price = generally higher rating)
                if product.price > 1000:
                    # Luxury items tend to have higher ratings
                    rating = random.choices([4, 5], weights=[20, 80])[0]
                elif product.price > 500:
                    # Mid-range items
                    rating = random.choices([3, 4, 5], weights=[15, 50, 35])[0]
                elif product.price > 100:
                    # Regular items
                    rating = random.choices([2, 3, 4, 5], weights=[10, 25, 45, 20])[0]
                else:
                    # Budget items
                    rating = random.choices([1, 2, 3, 4, 5], weights=[5, 15, 35, 35, 10])[0]

                # Check if review already exists for this user and product
                if not Review.objects.filter(user=user, product=product).exists():
                    review = Review.objects.create(
                        user=user,
                        product=product,
                        rating=rating,
                        title=random.choice(review_titles),
                        comment=random.choice(review_comments)
                    )
                    created_reviews += 1

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_reviews} reviews across {products.count()} products')
        ) 