import fitz  # PyMuPDF
import os

pdf_path = r"c:\Users\skplanet\Downloads\files\Alcobaca_Route_Map_v2.pdf"
output_dir = r"c:\Users\skplanet\Downloads\portugal-travel-main\images"
output_path = os.path.join(output_dir, "alcobaca_map.png")

print(f"Extracting map from {pdf_path}...")

try:
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)

    zoom = 2.0
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)

    # Estimate 45% crop height to only get the map part
    crop_height = int(pix.height * 0.45)
    
    cropped_pix = fitz.Pixmap(pix.colorspace, (0, 0, pix.width, crop_height), pix.alpha)
    cropped_pix.copy(pix, (0, 0, pix.width, crop_height))

    cropped_pix.save(output_path)
    print("Successfully extracted and cropped Alcobaca map!")
except Exception as e:
    print(f"Error extracting PDF: {e}")
