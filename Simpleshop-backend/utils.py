# api/utils.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

def send_order_confirmation_email(user_email, order):
    subject = 'Your Order Confirmation - Electronics Mart'
    message = render_to_string('order_confirmation_email.html', {
        'order': order,
        'user': order.user,
    })
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )
