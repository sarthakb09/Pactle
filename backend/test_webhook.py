#!/usr/bin/env python3
"""
Test script to demonstrate Slack webhook calls
"""

import requests
import json
from datetime import datetime

# Your webhook URL
WEBHOOK_URL = "https://hooks.slack.com/services/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"

def test_new_order_notification():
    """Test the new order notification webhook call"""
    print("🛒 Testing New Order Notification")
    print("=" * 50)
    
    # Simulate order data
    order_data = {
        "id": 123,
        "user": {"username": "testuser"},
        "total_amount": 149.99,
        "items_count": 3,
        "shipping_address": "123 Test Street, Test City, TC 12345",
        "created_at": datetime.now()
    }
    
    # Create the message payload (exactly like Django sends)
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
                        "text": f"*Order ID:*\n#{order_data['id']}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Customer:*\n{order_data['user']['username']}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Total Amount:*\n${order_data['total_amount']}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Items:*\n{order_data['items_count']} items"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Shipping Address:*\n{order_data['shipping_address']}"
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"Order created at {order_data['created_at'].strftime('%Y-%m-%d %H:%M:%S')}"
                    }
                ]
            }
        ]
    }
    
    print("📤 Sending webhook request to Slack...")
    print(f"URL: {WEBHOOK_URL}")
    print(f"Headers: {{'Content-Type': 'application/json'}}")
    print(f"Payload: {json.dumps(message, indent=2)}")
    print()
    
    # Send the webhook
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(WEBHOOK_URL, headers=headers, data=json.dumps(message))
        print(f"✅ Response Status: {response.status_code}")
        print(f"✅ Response Body: {response.text}")
        print()
        print("🎉 Check your Slack channel for the notification!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def test_payment_confirmation_notification():
    """Test the payment confirmation notification webhook call"""
    print("💳 Testing Payment Confirmation Notification")
    print("=" * 50)
    
    # Simulate order data
    order_data = {
        "id": 123,
        "user": {"username": "testuser"},
        "total_amount": 149.99,
        "updated_at": datetime.now()
    }
    
    # Create the message payload
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
                        "text": f"*Order ID:*\n#{order_data['id']}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Customer:*\n{order_data['user']['username']}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Amount Paid:*\n${order_data['total_amount']}"
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
                        "text": f"Payment confirmed at {order_data['updated_at'].strftime('%Y-%m-%d %H:%M:%S')}"
                    }
                ]
            }
        ]
    }
    
    print("📤 Sending payment confirmation webhook...")
    print(f"Payload: {json.dumps(message, indent=2)}")
    print()
    
    # Send the webhook
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(WEBHOOK_URL, headers=headers, data=json.dumps(message))
        print(f"✅ Response Status: {response.status_code}")
        print(f"✅ Response Body: {response.text}")
        print()
        print("🎉 Check your Slack channel for the payment confirmation!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🧪 SLACK WEBHOOK TEST")
    print("=" * 60)
    print()
    
    # Test new order notification
    test_new_order_notification()
    print()
    
    # Test payment confirmation
    test_payment_confirmation_notification()
    print()
    
    print("🏁 Test completed! Check your Slack channel for both notifications.") 