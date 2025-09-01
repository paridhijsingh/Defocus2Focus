#!/usr/bin/env python3
import qrcode
from PIL import Image
import os

# The Expo URL
expo_url = "exp://192.168.1.242:8081"

# Create QR code instance
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

# Add data to QR code
qr.add_data(expo_url)
qr.make(fit=True)

# Create image
img = qr.make_image(fill_color="black", back_color="white")

# Save the QR code
img.save("expo_qr_code.png")

print(f"QR code generated for: {expo_url}")
print("Saved as: expo_qr_code.png")
print("\nYou can now:")
print("1. Open expo_qr_code.png in Preview or any image viewer")
print("2. Point your iPhone Camera app at the QR code")
print("3. Tap the notification that appears")
