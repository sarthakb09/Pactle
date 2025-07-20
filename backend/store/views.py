from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.pagination import PageNumberPagination
from .models import Product, CartItem, Review
from .serializers import ProductSerializer, ProductDetailSerializer, CartItemSerializer, CartItemUpdateSerializer, ReviewSerializer

# Create your views here.

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get('username')
            email = request.data.get('email')
            password = request.data.get('password')
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return Response(
                    {'detail': 'Username already exists'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if User.objects.filter(email=email).exists():
                return Response(
                    {'detail': 'Email already exists'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['inventory_count']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']
    
    def list(self, request, *args, **kwargs):
        ordering = request.query_params.get('ordering', '')
        
        # Handle custom ordering for average_rating
        if ordering in ['average_rating', '-average_rating']:
            # Get all products and sort them in Python
            products = list(Product.objects.all())
            reverse = ordering.startswith('-')
            products.sort(key=lambda p: p.average_rating, reverse=reverse)
            
            # Manual pagination
            paginator = PageNumberPagination()
            paginator.page_size = 12
            
            # Get the requested page
            page = request.query_params.get('page', 1)
            try:
                page = int(page)
            except ValueError:
                page = 1
            
            # Calculate pagination
            start = (page - 1) * paginator.page_size
            end = start + paginator.page_size
            page_products = products[start:end]
            
            # Serialize the page
            serializer = self.get_serializer(page_products, many=True)
            
            # Create pagination response
            return Response({
                'count': len(products),
                'next': f"{request.build_absolute_uri().split('?')[0]}?ordering={ordering}&page={page + 1}" if end < len(products) else None,
                'previous': f"{request.build_absolute_uri().split('?')[0]}?ordering={ordering}&page={page - 1}" if page > 1 else None,
                'results': serializer.data
            })
        
        # Use default behavior for other ordering
        return super().list(request, *args, **kwargs)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer
    
    @action(detail=True, methods=['get'])
    def in_stock(self, request, pk=None):
        product = self.get_object()
        return Response({
            'product_id': product.id,
            'name': product.name,
            'in_stock': product.is_in_stock,
            'inventory_count': product.inventory_count
        })
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        reviews = self.get_queryset()
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def product_reviews(self, request):
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response(
                {'detail': 'product_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            reviews = Review.objects.filter(product_id=product_id)
            serializer = self.get_serializer(reviews, many=True)
            return Response(serializer.data)
        except Review.DoesNotExist:
            return Response(
                {'detail': 'Product not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None  # Disable pagination for cart items
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return CartItemUpdateSerializer
        return CartItemSerializer
    
    @action(detail=False, methods=['get'])
    def total(self, request):
        cart_items = self.get_queryset()
        total_amount = sum(item.total_price for item in cart_items)
        total_items = sum(item.quantity for item in cart_items)
        
        return Response({
            'total_amount': total_amount,
            'total_items': total_items,
            'item_count': cart_items.count()
        })
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        cart_items = self.get_queryset()
        cart_items.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
