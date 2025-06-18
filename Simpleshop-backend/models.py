from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import random

# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email
    
from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Smartphones', 'Smartphones'),
        ('Laptops', 'Laptops'),
        ('Smart TVs', 'Smart TVs'),
        ('Smart Watches & Wearables', 'Smart Watches & Wearables'),
        ('Audio Devices', 'Audio Devices'),
        ('Cameras & Photography', 'Cameras & Photography'),
        ('Smart Home Appliances', 'Smart Home Appliances'),
        ('Printers & Mouse', 'Printers & Mouse'),
        ('Chargers & Power Banks', 'Chargers & Power Banks'),
    ]

    BRAND_CHOICES = [
        ('Apple', 'Apple'),
        ('Samsung', 'Samsung'),
        ('OnePlus', 'OnePlus'),
        ('Xiaomi', 'Xiaomi'),
        ('Realme', 'Realme'),
        ('Motorola', 'Motorola'),
        ('Sony', 'Sony'),
        ('LG', 'LG'),
        ('HP', 'HP'),
        ('Dell', 'Dell'),
        ('Lenovo', 'Lenovo'),
        ('Asus', 'Asus'),
        ('Acer', 'Acer'),
        ('MSI', 'MSI'),
        ('Canon', 'Canon'),
        ('Nikon', 'Nikon'),
        ('Boat', 'Boat'),
        ('JBL', 'JBL'),
        ('Philips', 'Philips'),
        ('Panasonic', 'Panasonic'),
        ('Amazon', 'Amazon'),
        ('Google', 'Google'),
        ('Nothing', 'Nothing'),
        ('Fire-Boltt', 'Fire-Boltt'),
        ('Noise', 'Noise'),
        ('RealWear', 'RealWear'),
        ('DJI', 'DJI'),
        ('Fitbit', 'Fitbit'),
        ('Garmin', 'Garmin'),
        ('Haier', 'Haier'),
        ('Logitech', 'Logitech'),
        ('Prestige', 'Prestige'),
        ('Morphy Richards', 'Morphy Richards'),
        ('TCL', 'TCL'),
        ('Amazfit', 'Amazfit'),
        ('Sennheiser', 'Sennheiser'),
        ('GoPro', 'GoPro'),
        ('Fujifilm', 'Fujifilm'),
        ('Insta360', 'Insta360'),
        ('Wipro' , 'Wipro'),
        ('Epson', 'Epson'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='Smartphones')
    brand = models.CharField(max_length=100, choices=BRAND_CHOICES, default='Sony')
    stock = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.name
    
class UserAddress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=10)
    alternate_mobile_number = models.CharField(max_length=10, blank=True, null=True)
    address = models.TextField()
    locality = models.CharField(max_length=255)    
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10) 
    landmark = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, default='India')

    def __str__(self):
        return f"{self.name}, {self.address}, {self.city} - {self.pincode}"
    
class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    address = models.ForeignKey(UserAddress, on_delete=models.SET_NULL, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Razorpay fields
    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)

    # NEW: per-user order number
    user_order_number = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.user_order_number:
            last_number = Order.objects.filter(user=self.user).count()
            self.user_order_number = last_number + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.user_order_number} by {self.user.email}"

    @property
    def order_date(self):
        return self.created_at.strftime("%d %b %Y")

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

# Password Reset OTP Model
class PasswordResetOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"

class CartItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.email} - {self.product.name} x {self.quantity}"
