import fitz  # PyMuPDF
import os
import sys

pdf_path = r"c:\Users\skplanet\Downloads\Batalha_Route_Map_v2.pdf"
output_dir = r"c:\Users\skplanet\Downloads\portugal-travel-main\images"
output_path = os.path.join(output_dir, "batalha_map.png")

print(f"Extracting map from {pdf_path}...")

try:
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)

    # Render the page to an image
    zoom = 2.0
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)

    # Crop upper 55% of the page
    crop_height = int(pix.height * 0.55)
    cropped_pix = fitz.Pixmap(pix.colorspace, (0, 0, pix.width, crop_height), pix.alpha)
    cropped_pix.copy(pix, (0, 0, pix.width, crop_height))

    cropped_pix.save(output_path)
    print("Successfully extracted and cropped Batalha map!")
except Exception as e:
    print(f"Error extracting PDF: {e}")
    sys.exit(1)
