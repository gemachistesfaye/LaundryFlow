import os
import requests
from PIL import Image
from io import BytesIO

# Folder to store images
folder_path = "public/images"
os.makedirs(folder_path, exist_ok=True)

# Clothing items with URLs (free placeholder URLs, you can replace with better ones)
clothing_images = {
    "shirt": "https://via.placeholder.com/64?text=Shirt",
    "pants": "https://via.placeholder.com/64?text=Pants",
    "jacket": "https://via.placeholder.com/64?text=Jacket",
    "dress": "https://via.placeholder.com/64?text=Dress",
    "skirt": "https://via.placeholder.com/64?text=Skirt",
    "tshirt": "https://via.placeholder.com/64?text=T-Shirt",
    "shorts": "https://via.placeholder.com/64?text=Shorts",
    "sweater": "https://via.placeholder.com/64?text=Sweater",
    "coat": "https://via.placeholder.com/64?text=Coat",
    "blouse": "https://via.placeholder.com/64?text=Blouse",
    "underwear": "https://via.placeholder.com/64?text=Underwear",
    "socks": "https://via.placeholder.com/64?text=Socks",
    "towel": "https://via.placeholder.com/64?text=Towel",
    "bedsheet": "https://via.placeholder.com/64?text=BedSheet",
    "curtain": "https://via.placeholder.com/64?text=Curtain",
    "others": "https://via.placeholder.com/64?text=Others",
}

# Download each image
for name, url in clothing_images.items():
    try:
        response = requests.get(url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        img.save(os.path.join(folder_path, f"{name}.png"))
        print(f"Saved: {name}.png")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

print("All images downloaded successfully!")
