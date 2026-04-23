import fitz  # PyMuPDF
import os

pdf_path = r"c:\Users\skplanet\Downloads\Tomar_Route_Map_v2_4.pdf"
output_dir = r"c:\Users\skplanet\Downloads\portugal-travel-main\images"
output_path = os.path.join(output_dir, "tomar_map.png")

print(f"Extracting map from {pdf_path}...")

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Open the document
doc = fitz.open(pdf_path)
page = doc.load_page(0)

# Render the page to an image (Scale up for better quality)
zoom = 2.0
mat = fitz.Matrix(zoom, zoom)
pix = page.get_pixmap(matrix=mat)

# The user cropped the top half roughly. Let's crop the image.
# PyMuPDF pixmap coordinates
# We want roughly the upper 55% of the page
crop_height = int(pix.height * 0.55)

# We can crop by creating a new empty pixmap and copying
cropped_pix = fitz.Pixmap(pix.colorspace, (0, 0, pix.width, crop_height), pix.alpha)
cropped_pix.copy(pix, (0, 0, pix.width, crop_height))

# Save the image
cropped_pix.save(output_path)
print(f"✅ Successfully extracted and cropped map to: {output_path}")
