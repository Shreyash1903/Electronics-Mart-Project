from django.contrib import admin
from django.urls import path , include
from django.conf import settings
from django.conf.urls.static import static
from api.views import generate_invoice  # ✅ import the invoice view

urlpatterns = [
    path('admin/', admin.site.urls),

    # Your app API routes
    path('api/', include('api.urls')),

    # dj-rest-auth endpoints for login, logout, password reset, etc.
    path('auth/', include('dj_rest_auth.urls')),

    # dj-rest-auth registration endpoints
    path('auth/registration/', include('dj_rest_auth.registration.urls')),

    # Invoice generation endpoint
    path('invoice/<int:order_id>/', generate_invoice, name='generate-invoice'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)