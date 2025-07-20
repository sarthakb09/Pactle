#!/usr/bin/env python3
"""
Slack Integration Setup Script for Pactle E-commerce

This script helps you set up Slack notifications for the Pactle shopping platform.
It will guide you through the process of creating a Slack app and configuring
the necessary environment variables.
"""

import os
import sys
from pathlib import Path

def print_header():
    """Print the setup header"""
    print("=" * 60)
    print("🛒 PACTLE SLACK INTEGRATION SETUP")
    print("=" * 60)
    print()

def print_steps():
    """Print the setup steps"""
    print("📋 SETUP STEPS:")
    print("1. Create a Slack App")
    print("2. Configure Bot Token Scopes")
    print("3. Install App to Workspace")
    print("4. Get Bot Token")
    print("5. Configure Channel")
    print("6. Update Environment Variables")
    print()
    print("📋 ALTERNATIVE: WEBHOOK SETUP (Easier)")
    print("1. Create Incoming Webhook")
    print("2. Get Webhook URL")
    print("3. Update Environment Variables")
    print()

def create_slack_app_instructions():
    """Print instructions for creating a Slack app"""
    print("🔧 STEP 1: CREATE A SLACK APP")
    print("-" * 40)
    print("1. Go to https://api.slack.com/apps")
    print("2. Click 'Create New App'")
    print("3. Choose 'From scratch'")
    print("4. Enter app name: 'Pactle Shopping Bot'")
    print("5. Select your workspace")
    print("6. Click 'Create App'")
    print()

def configure_scopes_instructions():
    """Print instructions for configuring scopes"""
    print("🔧 STEP 2: CONFIGURE BOT TOKEN SCOPES")
    print("-" * 40)
    print("1. In your app settings, go to 'OAuth & Permissions'")
    print("2. Under 'Scopes', find 'Bot Token Scopes'")
    print("3. Add the following scopes:")
    print("   - chat:write (to send messages)")
    print("   - chat:write.public (to send to public channels)")
    print("4. Click 'Install to Workspace'")
    print()

def get_bot_token_instructions():
    """Print instructions for getting the bot token"""
    print("🔧 STEP 3: GET BOT TOKEN")
    print("-" * 40)
    print("1. After installing, go to 'OAuth & Permissions'")
    print("2. Copy the 'Bot User OAuth Token'")
    print("3. It should start with 'xoxb-'")
    print()

def configure_channel_instructions():
    """Print instructions for configuring the channel"""
    print("🔧 STEP 4: CONFIGURE CHANNEL")
    print("-" * 40)
    print("Option 1: Use Channel Name (Recommended)")
    print("- Create a channel named 'pactle-shopping' in your workspace")
    print("- Make sure your bot is invited to the channel")
    print("- Use SLACK_CHANNEL_NAME=pactle-shopping")
    print()
    print("Option 2: Use Channel ID")
    print("- Right-click on the channel and select 'Copy link'")
    print("- Extract the channel ID from the URL")
    print("- Use SLACK_CHANNEL_ID=C1234567890")
    print()

def webhook_setup_instructions():
    """Print instructions for setting up webhooks"""
    print("🔧 WEBHOOK SETUP (Easier Alternative)")
    print("-" * 40)
    print("This method is simpler and doesn't require creating a Slack app!")
    print()
    print("STEP 1: CREATE INCOMING WEBHOOK")
    print("1. Go to your Slack workspace")
    print("2. Navigate to the 'pactle-shopping' channel")
    print("3. Click the channel name at the top")
    print("4. Go to 'Integrations' tab")
    print("5. Click 'Add apps'")
    print("6. Search for 'Incoming Webhooks'")
    print("7. Click 'Add to Slack'")
    print("8. Choose the 'pactle-shopping' channel")
    print("9. Click 'Add Incoming WebHooks integration'")
    print()
    print("STEP 2: GET WEBHOOK URL")
    print("1. After adding, you'll see a webhook URL")
    print("2. It looks like: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX")
    print("3. Copy this URL")
    print()
    print("STEP 3: UPDATE ENVIRONMENT VARIABLES")
    print("Add to your .env file:")
    print("SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL")
    print()

def update_env_instructions():
    """Print instructions for updating environment variables"""
    print("🔧 STEP 5: UPDATE ENVIRONMENT VARIABLES")
    print("-" * 40)
    print("Update your .env file with:")
    print()
    print("Option 1: Bot Token (if you created a Slack app)")
    print("SLACK_BOT_TOKEN=xoxb-your-actual-bot-token-here")
    print("SLACK_CHANNEL_NAME=pactle-shopping")
    print("# OR if using channel ID:")
    print("# SLACK_CHANNEL_ID=C1234567890")
    print()
    print("Option 2: Webhook URL (easier)")
    print("SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL")
    print()

def test_configuration():
    """Test the Slack configuration"""
    print("🧪 TESTING CONFIGURATION")
    print("-" * 40)
    
    # Check if .env file exists
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ .env file not found!")
        print("Please create a .env file in the backend directory")
        return False
    
    # Read .env file
    try:
        with open(env_file, 'r') as f:
            env_content = f.read()
        
        # Check for Slack configuration
        if 'SLACK_WEBHOOK_URL' in env_content:
            print("✅ SLACK_WEBHOOK_URL found in .env (Webhook method)")
            print("✅ Configuration looks good!")
            print()
            print("To test the integration:")
            print("1. Start your Django server: python manage.py runserver")
            print("2. Create a test order through the frontend")
            print("3. Check your Slack channel for notifications")
            return True
        elif 'SLACK_BOT_TOKEN' in env_content:
            print("✅ SLACK_BOT_TOKEN found in .env (Bot method)")
            if 'SLACK_CHANNEL_NAME' in env_content or 'SLACK_CHANNEL_ID' in env_content:
                print("✅ Channel configuration found in .env")
                print("✅ Configuration looks good!")
                print()
                print("To test the integration:")
                print("1. Start your Django server: python manage.py runserver")
                print("2. Create a test order through the frontend")
                print("3. Check your Slack channel for notifications")
                return True
            else:
                print("❌ Channel configuration not found in .env")
                return False
        else:
            print("❌ No Slack configuration found in .env")
            print("Please add either SLACK_WEBHOOK_URL or SLACK_BOT_TOKEN")
            return False
        
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        return False

def main():
    """Main setup function"""
    print_header()
    print_steps()
    
    while True:
        print("Choose an option:")
        print("1. Show all setup instructions")
        print("2. Create Slack App instructions")
        print("3. Configure Scopes instructions")
        print("4. Get Bot Token instructions")
        print("5. Configure Channel instructions")
        print("6. Update Environment Variables instructions")
        print("7. Test Configuration")
        print("8. Webhook Setup (Easier)")
        print("9. Exit")
        print()
        
        choice = input("Enter your choice (1-9): ").strip()
        print()
        
        if choice == '1':
            create_slack_app_instructions()
            configure_scopes_instructions()
            get_bot_token_instructions()
            configure_channel_instructions()
            update_env_instructions()
        elif choice == '2':
            create_slack_app_instructions()
        elif choice == '3':
            configure_scopes_instructions()
        elif choice == '4':
            get_bot_token_instructions()
        elif choice == '5':
            configure_channel_instructions()
        elif choice == '6':
            update_env_instructions()
        elif choice == '7':
            test_configuration()
        elif choice == '8':
            webhook_setup_instructions()
        elif choice == '9':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter a number between 1-9.")
        
        print()
        input("Press Enter to continue...")
        print()

if __name__ == "__main__":
    main() 