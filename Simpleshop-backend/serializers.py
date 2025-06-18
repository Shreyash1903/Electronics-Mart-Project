from rest_framework import serializers
from .models import CustomUser, Product, UserAddress, Order, OrderItem , CartItem
from django.contrib.auth import update_session_auth_hash
import re

# ------------------ AUTH ------------------

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'full_name', 'password')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'full_name')

class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

# ------------------ PRODUCTS ------------------

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Product
        fields = '__all__'

# ------------------ ADDRESS ------------------

class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = [
            'id', 'user', 'name', 'mobile_number', 'alternate_mobile_number',
            'address', 'locality', 'city', 'state', 'pincode', 'landmark', 'country',
        ]
        read_only_fields = ['user']

    def validate_mobile_number(self, value):
        if not re.match(r'^\d{10}$', value):
            raise serializers.ValidationError("Mobile number must be exactly 10 digits.")
        return value

    def validate_alternate_mobile_number(self, value):
        if value and not re.match(r'^\d{10}$', value):
            raise serializers.ValidationError("Alternate mobile number must be exactly 10 digits.")
        return value

# ------------------ ORDER ITEMS ------------------

# For reading (GET)
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

# For creating (POST)
class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

# ------------------ ORDER ------------------

# For reading (GET)
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_order_number' , 'address', 'total_price', 'is_paid', 'created_at', 'items',
            'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'
        ]

# For creating (POST)
class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'address', 'total_price', 'is_paid', 'items',
            'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')

        # Safely remove `user` from validated_data if it’s included for any reason
        validated_data.pop('user', None)

        order = Order.objects.create(user=request.user, **validated_data)

        for item in items_data:
            OrderItem.objects.create(order=order, **item)

        return order

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']
