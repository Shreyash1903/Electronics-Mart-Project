# Django and third-party imports
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .models import CustomUser, Product, UserAddress, Order, OrderItem, PasswordResetOTP , CartItem
from .serializers import (
    RegisterSerializer,
    ProductSerializer,
    UserProfileSerializer,
    UpdatePasswordSerializer,
    OrderItemSerializer,
    OrderSerializer,
    UserAddressSerializer,
    OrderCreateSerializer , CartItemSerializer
)
from django.contrib.auth import update_session_auth_hash
import razorpay
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
import random
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Value
from django.template.loader import render_to_string  # 📩 Email template rendering
from .utils import send_order_confirmation_email

User = get_user_model()

# 🔐 Google Signup - Creates a new user if email doesn't exist
class GoogleSignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is required"}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request())
            email = idinfo.get("email")
            name = idinfo.get("name", "")

            if User.objects.filter(email=email).exists():
                return Response({"error": "Account already exists. Please log in."}, status=400)

            user = User.objects.create(email=email, full_name=name)
            user.set_unusable_password()
            user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {"id": user.id, "email": user.email, "name": user.full_name}
            })

        except ValueError:
            return Response({"error": "Invalid token"}, status=400)

# 🔓 Google Login - Logs in if email exists
class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is required"}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request())
            email = idinfo.get("email")

            if not email:
                return Response({"error": "Invalid token - Email not found"}, status=400)

            user = User.objects.filter(email=email).first()
            if not user:
                return Response({"error": "Account does not exist. Please sign up first."}, status=400)

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {"id": user.id, "email": user.email, "name": user.full_name}
            })

        except ValueError as e:
            print("Google token error:", str(e))
            return Response({"error": "Invalid token"}, status=400)

# 📝 Register via email/password
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# 📦 List all products with optional brand/category filter
class ProductListView(APIView):
    def get(self, request):
        queryset = Product.objects.all()
        brand = request.GET.get('brand')
        category = request.GET.get('category')

        if brand:
            queryset = queryset.filter(brand__iexact=brand)

        if category:
            queryset = queryset.filter(category__iexact=category)

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

# 📊 Returns distinct brand names
@api_view(['GET'])
@permission_classes([AllowAny])
def BrandListView(request):
    brands = Product.objects.values_list('brand', flat=True).distinct()
    return Response(sorted(list(brands)))

# 🔍 Fetch details for a specific product
class ProductDetailView(APIView):
    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

# 👤 View or update user profile
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 🔐 Update user password with old password verification
class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UpdatePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': 'Wrong password.'}, status=400)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            update_session_auth_hash(request, user)
            return Response({'detail': 'Password updated successfully.'})
        return Response(serializer.errors, status=400)

# 📍 List or create addresses for the authenticated user
class AddressListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserAddressSerializer

    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 🛠️ Update or delete a specific address
class AddressUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserAddressSerializer

    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user)

# 🛒 Create a new order
class CreateOrderView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        print("▶️ Incoming data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ Validation errors:", serializer.errors)
            return Response(serializer.errors, status=400)

        order = serializer.save()

        # ✅ Send order confirmation email
        send_order_confirmation_email(request.user.email, order)

        return Response(serializer.data, status=201)

# 📦 List user’s past orders
class UserOrdersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

# 💳 Create a Razorpay order from amount
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class RazorpayOrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            amount = request.data.get('amount')
            if not amount:
                return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                amount_in_paise = int(amount)
            except (ValueError, TypeError):
                return Response({"error": "Invalid amount format"}, status=status.HTTP_400_BAD_REQUEST)

            if amount_in_paise <= 0:
                return Response({"error": "Amount must be positive"}, status=status.HTTP_400_BAD_REQUEST)

            razorpay_order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": 1
            })

            return Response({
                "order_id": razorpay_order['id'],
                "amount": amount_in_paise,
                "currency": "INR",
                "key": settings.RAZORPAY_KEY_ID
            })

        except Exception as e:
            print("Razorpay order creation error:", e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✉️ Send OTP for password reset via email
class SendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
            otp = str(random.randint(100000, 999999))

            PasswordResetOTP.objects.create(user=user, otp=otp)

            subject = "Electronics Mart OTP Verification"
            message = (
                f"Hi,\n\n"
                f"We received a request to reset your password on Electronics Mart.\n\n"
                f"Your One-Time Password (OTP) is : {otp}\n\n"
                f"This OTP is valid for 5 minutes.\n"
                f"If you did not request this, you can safely ignore this email.\n\n"
                f"Thanks,\n"
                f"Team Electronics"
            )

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )

            return Response({"message": "OTP sent to email"}, status=200)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

# ✅ Verify OTP for password reset
class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        try:
            user = User.objects.get(email=email)
            otp_obj = PasswordResetOTP.objects.filter(user=user, otp=otp, is_used=False).latest("created_at")

            otp_obj.is_used = True
            otp_obj.save()

            return Response({"message": "OTP verified"}, status=200)
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({"error": "Invalid OTP"}, status=400)

# 🔁 Reset password after OTP verification
from django.contrib.auth.hashers import make_password

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)

        try:
            user = User.objects.get(email=email)
            user.password = make_password(new_password)
            user.save()
            return Response({"message": "Password reset successful"}, status=200)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

# 🧾 Generate PDF invoice for an order
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_invoice(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return HttpResponse("Order not found or you don't have permission.", status=404)

    template_path = 'invoice.html'

    items = [
        {
            "product_name": item.product.name,
            "quantity": item.quantity,
            "price": item.price,
            "subtotal": item.quantity * item.price
        }
        for item in order.items.all()
    ]

    context = {
        'order': order,
        'items': items
    }

    template = get_template(template_path)
    html = template.render(context)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invoice_order_{order.id}.pdf"'

    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse('We had some errors <pre>' + html + '</pre>')
    return response

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.validated_data['product']
            quantity = serializer.validated_data['quantity']

            cart_item, created = CartItem.objects.get_or_create(
                user=request.user, product=product,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            return Response(CartItemSerializer(cart_item).data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "Product ID is required"}, status=400)

        CartItem.objects.filter(user=request.user, product_id=product_id).delete()
        return Response({"message": "Item removed"}, status=204)
