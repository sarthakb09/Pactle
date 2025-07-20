from rest_framework import viewsets, status, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
import stripe
import requests
import json
from .models import Order
from .serializers import OrderSerializer, OrderDetailSerializer

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OrderDetailSerializer
        return OrderSerializer
    
    def perform_create(self, serializer):
        order = serializer.save()
        
        # Check if Stripe is properly configured
        if not settings.STRIPE_SECRET_KEY or settings.STRIPE_SECRET_KEY == '':
            # For development/testing, create order without Stripe
            order.status = 'pending'
            order.save()
            return
        
        # Create Stripe payment intent
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(order.total_amount * 100),  # Convert to cents
                currency='usd',
                metadata={'order_id': order.id}
            )
            order.stripe_payment_intent_id = payment_intent.id
            order.save()
            
            # Send Slack notification
            self.send_slack_notification(order)
            
            # Send order confirmation email
            self.send_order_email(order)
            
        except stripe.error.AuthenticationError as e:
            # Handle invalid API key
            order.status = 'pending'
            order.save()
            print(f"Stripe authentication error: {e}")
            # Don't raise error for development
        except stripe.error.StripeError as e:
            # Handle other Stripe errors
            order.status = 'cancelled'
            order.save()
            raise serializers.ValidationError(f"Payment processing failed: {str(e)}")
        except Exception as e:
            # Handle other errors
            order.status = 'pending'
            order.save()
            print(f"Order creation error: {e}")
            # Don't raise error for development
    
    def send_slack_notification(self, order):
        """Send notification to Slack when a new order is created"""
        # Check if webhook URL is configured (easier method)
        if settings.SLACK_WEBHOOK_URL:
            self.send_webhook_notification(order)
            return
        
        # Fall back to bot token method
        if not settings.SLACK_BOT_TOKEN:
            return
        
        # Use channel name if provided, otherwise fall back to channel ID
        channel = getattr(settings, 'SLACK_CHANNEL_NAME', 'pactle-shopping')
        if hasattr(settings, 'SLACK_CHANNEL_ID') and settings.SLACK_CHANNEL_ID:
            channel = settings.SLACK_CHANNEL_ID
        
        # Create a more detailed notification message
        message = {
            "channel": channel,
            "text": f":shopping_cart: *New Order Created!*",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "🛒 New Order Received",
                        "emoji": True
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Order ID:*\n#{order.id}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Customer:*\n{order.user.username}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Total Amount:*\n${order.total_amount}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Items:*\n{order.items_count} items"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"*Shipping Address:*\n{order.shipping_address}"
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": f"Order created at {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
                        }
                    ]
                }
            ]
        }
        
        headers = {
            'Authorization': f'Bearer {settings.SLACK_BOT_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(
                'https://slack.com/api/chat.postMessage',
                headers=headers,
                data=json.dumps(message)
            )
            response.raise_for_status()
            
            # Check if the API call was successful
            response_data = response.json()
            if not response_data.get('ok'):
                print(f"Slack API error: {response_data.get('error', 'Unknown error')}")
            else:
                print(f"Slack notification sent successfully for order {order.id}")
                
        except requests.RequestException as e:
            # Log error but don't fail the order creation
            print(f"Failed to send Slack notification: {e}")
        except Exception as e:
            # Log any other errors
            print(f"Unexpected error sending Slack notification: {e}")
    
    def send_webhook_notification(self, order):
        """Send notification using webhook URL (easier setup)"""
        # Create a more detailed notification message
        message = {
            "text": f":shopping_cart: *New Order Created!*",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "🛒 New Order Received",
                        "emoji": True
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Order ID:*\n#{order.id}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Customer:*\n{order.user.username}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Total Amount:*\n${order.total_amount}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Items:*\n{order.items_count} items"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"*Shipping Address:*\n{order.shipping_address}"
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": f"Order created at {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
                        }
                    ]
                }
            ]
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(
                settings.SLACK_WEBHOOK_URL,
                headers=headers,
                data=json.dumps(message)
            )
            response.raise_for_status()
            print(f"Webhook notification sent successfully for order {order.id}")
                
        except requests.RequestException as e:
            # Log error but don't fail the order creation
            print(f"Failed to send webhook notification: {e}")
        except Exception as e:
            # Log any other errors
            print(f"Unexpected error sending webhook notification: {e}")
    
    def send_order_email(self, order):
        """Send order confirmation email"""
        if not settings.EMAIL_HOST_PASSWORD:
            return
        
        subject = f'Order Confirmation - Order #{order.id}'
        html_message = render_to_string('orders/order_confirmation_email.html', {
            'order': order,
            'user': order.user
        })
        
        try:
            send_mail(
                subject=subject,
                message=f'Thank you for your order #{order.id}. Total: ${order.total_amount}',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[order.user.email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            # Log error but don't fail the order creation
            print(f"Failed to send order email: {e}")
    
    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        """Confirm payment with Stripe webhook"""
        order = self.get_object()
        
        try:
            # Verify payment intent with Stripe
            payment_intent = stripe.PaymentIntent.retrieve(order.stripe_payment_intent_id)
            
            if payment_intent.status == 'succeeded':
                order.status = 'processing'
                order.save()
                
                # Send Slack notification for payment confirmation
                self.send_payment_confirmation_notification(order)
                
                return Response({'status': 'Payment confirmed'})
            else:
                return Response(
                    {'error': 'Payment not completed'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except stripe.error.StripeError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def send_payment_confirmation_notification(self, order):
        """Send notification to Slack when payment is confirmed"""
        # Check if webhook URL is configured (easier method)
        if settings.SLACK_WEBHOOK_URL:
            self.send_payment_confirmation_webhook(order)
            return
        
        # Fall back to bot token method
        if not settings.SLACK_BOT_TOKEN:
            return
        
        # Use channel name if provided, otherwise fall back to channel ID
        channel = getattr(settings, 'SLACK_CHANNEL_NAME', 'pactle-shopping')
        if hasattr(settings, 'SLACK_CHANNEL_ID') and settings.SLACK_CHANNEL_ID:
            channel = settings.SLACK_CHANNEL_ID
        
        # Create a payment confirmation notification message
        message = {
            "channel": channel,
            "text": f":white_check_mark: *Payment Confirmed!*",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "✅ Payment Confirmed",
                        "emoji": True
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Order ID:*\n#{order.id}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Customer:*\n{order.user.username}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Amount Paid:*\n${order.total_amount}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Status:*\nProcessing"
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": f"Payment confirmed at {order.updated_at.strftime('%Y-%m-%d %H:%M:%S')}"
                        }
                    ]
                }
            ]
        }
        
        headers = {
            'Authorization': f'Bearer {settings.SLACK_BOT_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(
                'https://slack.com/api/chat.postMessage',
                headers=headers,
                data=json.dumps(message)
            )
            response.raise_for_status()
            
            # Check if the API call was successful
            response_data = response.json()
            if not response_data.get('ok'):
                print(f"Slack API error: {response_data.get('error', 'Unknown error')}")
            else:
                print(f"Payment confirmation Slack notification sent successfully for order {order.id}")
                
        except requests.RequestException as e:
            # Log error but don't fail the payment confirmation
            print(f"Failed to send payment confirmation Slack notification: {e}")
        except Exception as e:
            # Log any other errors
            print(f"Unexpected error sending payment confirmation Slack notification: {e}")
    
    def send_payment_confirmation_webhook(self, order):
        """Send payment confirmation using webhook URL"""
        # Create a payment confirmation notification message
        message = {
            "text": f":white_check_mark: *Payment Confirmed!*",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "✅ Payment Confirmed",
                        "emoji": True
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Order ID:*\n#{order.id}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Customer:*\n{order.user.username}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Amount Paid:*\n${order.total_amount}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Status:*\nProcessing"
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": f"Payment confirmed at {order.updated_at.strftime('%Y-%m-%d %H:%M:%S')}"
                        }
                    ]
                }
            ]
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(
                settings.SLACK_WEBHOOK_URL,
                headers=headers,
                data=json.dumps(message)
            )
            response.raise_for_status()
            print(f"Payment confirmation webhook notification sent successfully for order {order.id}")
                
        except requests.RequestException as e:
            # Log error but don't fail the payment confirmation
            print(f"Failed to send payment confirmation webhook notification: {e}")
        except Exception as e:
            # Log any other errors
            print(f"Unexpected error sending payment confirmation webhook notification: {e}")
