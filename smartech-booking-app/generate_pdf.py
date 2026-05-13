"""Generate the Smartech Gas client overview PDF using WeasyPrint."""
import os
from weasyprint import HTML, CSS

html_path = os.path.join(os.path.dirname(__file__), "client-overview-print.html")
out_path  = os.path.join(os.path.dirname(__file__), "Smartech_Gas_Booking_App_Overview.pdf")

HTML(filename=html_path).write_pdf(
    out_path,
    stylesheets=[CSS(string="@page { size: A4; margin: 0; }")],
)

print(f"PDF saved → {out_path}")
