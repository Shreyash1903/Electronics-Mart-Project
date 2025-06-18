from django.contrib import admin
from .models import CustomUser, Product, UserAddress, Order, OrderItem

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'is_staff', 'is_active')
    search_fields = ('email', 'full_name')
    list_filter = ('is_staff', 'is_active')
    ordering = ('email',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'description', 'image')
    search_fields = ('name',)
    list_filter = ('price',)
    ordering = ('name',)

@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'mobile_number', 'city', 'state', 'pincode', 'country')
    search_fields = ('name', 'city', 'state', 'pincode')
    list_filter = ('state', 'city', 'country')
    ordering = ('user', 'city')

class OrderItemInline(admin.TabularInline):  # ✅ Inline OrderItems
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'address', 'total_price', 'is_paid', 'created_at')
    list_filter = ('is_paid', 'created_at')
    search_fields = ('user__email', 'address__city')
    ordering = ('-created_at',)
    inlines = [OrderItemInline]  # ✅ Attach the inline here

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    search_fields = ('order__id', 'product__name')
    list_filter = ('product',)
    ordering = ('order',)
