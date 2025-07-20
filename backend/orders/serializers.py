from rest_framework import serializers
from .models import Order, OrderItem
from store.models import CartItem
from store.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'unit_price', 'total_price', 'created_at']
        read_only_fields = ['created_at']

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    items_count = serializers.ReadOnlyField()
    shipping_address = serializers.CharField(required=True, allow_blank=False)
    client_secret = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'stripe_payment_intent_id', 'shipping_address', 'order_items', 'items_count', 'created_at', 'updated_at', 'client_secret']
        read_only_fields = ['user', 'total_amount', 'stripe_payment_intent_id', 'created_at', 'updated_at']
    
    def get_client_secret(self, obj):
        """Return the client secret for the payment intent"""
        if obj.stripe_payment_intent_id:
            try:
                import stripe
                from django.conf import settings
                stripe.api_key = settings.STRIPE_SECRET_KEY
                payment_intent = stripe.PaymentIntent.retrieve(obj.stripe_payment_intent_id)
                return payment_intent.client_secret
            except Exception as e:
                print(f"Error retrieving client secret: {e}")
                return None
        return None
    
    def validate_shipping_address(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Shipping address is required.")
        return value.strip()
    
    def create(self, validated_data):
        user = self.context['request'].user
        cart_items = CartItem.objects.filter(user=user)
        
        if not cart_items.exists():
            raise serializers.ValidationError("Cart is empty.")
        
        # Calculate total amount
        total_amount = sum(item.total_price for item in cart_items)
        
        # Create order
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            **validated_data
        )
        
        # Create order items from cart items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                unit_price=cart_item.product.price
            )
        
        # Clear cart
        cart_items.delete()
        
        return order

class OrderDetailSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    items_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'stripe_payment_intent_id', 'shipping_address', 'order_items', 'items_count', 'created_at', 'updated_at']
        read_only_fields = ['user', 'total_amount', 'stripe_payment_intent_id', 'created_at', 'updated_at'] 