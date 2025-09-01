#!/usr/bin/env python3
import qrcode
import sys

def generate_qr_code(url):
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=1,
        border=1,
    )
    
    # Add data
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create QR code image
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to ASCII art for terminal display
    width, height = qr_image.size
    ascii_qr = []
    
    for y in range(height):
        row = ""
        for x in range(width):
            pixel = qr_image.getpixel((x, y))
            if pixel == 0:  # Black pixel
                row += "██"
            else:  # White pixel
                row += "  "
        ascii_qr.append(row)
    
    return ascii_qr

if __name__ == "__main__":
    # Custom subdomain URL (easier to remember)
    custom_url = "https://defocus2focus.loca.lt"
    # Instructions page URL
    instructions_url = "http://192.168.1.242:8000/access-instructions.html"
    # Local URL for same network
    local_url = "http://192.168.1.242:8000/index.html"
    
    print("🌐 Defocus2Focus - Access Solutions")
    print("=" * 60)
    print("📋 Option 1: Instructions Page (Recommended)")
    print(f"URL: {instructions_url}")
    print("(Shows step-by-step instructions with password)")
    print("=" * 60)
    print()
    
    qr_ascii = generate_qr_code(instructions_url)
    
    for row in qr_ascii:
        print(row)
    
    print()
    print("=" * 60)
    print("📱 How to Share:")
    print("1. Share the instructions page URL")
    print("2. It shows the app URL + password")
    print("3. Users follow the steps to access")
    print()
    print("🔑 Direct Access Info:")
    print(f"App URL: {custom_url}")
    print("Password: 108.74.100.24")
    print()
    print("⚠️  Important Notes:")
    print("- Password only needed once per device every 7 days")
    print("- For permanent access, deploy to Netlify/Vercel")
    print("- See deploy-instructions.md for permanent hosting")
    print()
    print("🏠 Local Network Access:")
    print(f"URL: {local_url}")
    print("(Only works on same WiFi network)")
    print("=" * 60)
