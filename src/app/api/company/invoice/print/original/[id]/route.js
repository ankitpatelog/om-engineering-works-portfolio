import puppeteer from "puppeteer";
import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoicesaveModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const invoice = await Invoice.findById(id).lean();
    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    console.log(JSON.stringify(invoice, null, 2));

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax Invoice</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 8mm;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #000;
            background: #fff;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: #fff;
            padding: 5mm;
            position: relative;
        }
        
        .header {
            text-align: center;
            margin-bottom: 8px;
            position: relative;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 3px 0;
            letter-spacing: 1px;
        }
        
        .tax-invoice-title {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 4px;
            text-decoration: underline;
        }
        
        .original-stamp {
            position: absolute;
            right: 0;
            top: 0;
            border: 2px solid #000;
            padding: 4px 18px;
            font-weight: bold;
            font-size: 13px;
        }
        
        .gst-rule {
            font-size: 9px;
            text-align: center;
            margin-bottom: 6px;
        }
        
        .company-address {
            text-align: center;
            font-size: 10px;
            margin-bottom: 6px;
        }
        
        .company-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 10px;
        }
        
        .company-details div {
            flex: 1;
        }
        
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 10px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0;
        }
        
        table, th, td {
            border: 1px solid #000;
        }
        
        th {
            background-color: #d3d3d3;
            padding: 5px 4px;
            text-align: center;
            font-weight: bold;
            font-size: 10px;
        }
        
        td {
            padding: 5px 4px;
            font-size: 10px;
        }
        
        .party-details-table td {
            padding: 5px 6px;
            vertical-align: top;
        }
        
        .party-details-table .label {
            font-weight: bold;
            width: 85px;
        }
        
        .party-details-header {
            background-color: #d3d3d3;
            font-weight: bold;
            text-align: center;
            padding: 5px;
        }
        
        .items-table td {
            text-align: center;
            padding: 6px 3px;
        }
        
        .items-table td:nth-child(2) {
            text-align: left;
            padding-left: 6px;
            padding-right: 6px;
        }
        
        .items-table td:nth-child(1) {
            width: 35px;
        }
        
        .items-table td:nth-child(3) {
            width: 60px;
        }
        
        .items-table td:nth-child(4) {
            width: 70px;
        }
        
        .items-table td:nth-child(5) {
            width: 50px;
        }
        
        .items-table td:nth-child(6) {
            width: 45px;
        }
        
        .items-table td:nth-child(7) {
            width: 90px;
        }
        
        .items-table td:nth-child(8) {
            width: 40px;
        }
        
        .items-table td:nth-child(9) {
            width: 85px;
        }
        
        .transport-details {
            display: flex;
            margin-top: 0;
        }
        
        .transport-left {
            flex: 1.2;
            border: 1px solid #000;
            border-top: none;
            padding: 6px 8px;
        }
        
        .transport-right {
            flex: 1;
            border: 1px solid #000;
            border-left: none;
            border-top: none;
        }
        
        .transport-row {
            display: flex;
            margin-bottom: 3px;
        }
        
        .transport-label {
            font-weight: bold;
            width: 140px;
            flex-shrink: 0;
        }
        
        .amount-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 8px;
            border-bottom: 1px solid #000;
        }
        
        .amount-row:last-child {
            border-bottom: none;
        }
        
        .amount-label {
            font-weight: bold;
        }
        
        .grand-total-row {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 11px;
        }
        
        .amount-in-words {
            border: 1px solid #000;
            border-top: none;
            padding: 8px 10px;
            font-size: 11px;
        }
        
        .declaration-section {
            display: flex;
            border: 1px solid #000;
            border-top: none;
            min-height: 180px;
        }
        
        .declaration-left {
            flex: 2;
            padding: 10px 12px;
            font-size: 10px;
            line-height: 1.6;
        }
        
        .declaration-right {
            flex: 1;
            border-left: 1px solid #000;
            padding: 12px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .company-name-signature {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .signature-space {
            margin-top: auto;
            padding-top: 60px;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
        }
        
        .page-number {
            text-align: right;
            font-size: 10px;
            margin-bottom: 5px;
        }
        
        .total-row {
            font-weight: bold;
            background-color: #f5f5f5;
        }
        
        .total-row td {
            padding: 6px 8px;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            
            .page {
                margin: 0;
                padding: 8mm;
                width: 210mm;
                min-height: 297mm;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="page-number">Page 1 of 1</div>
        
        <div class="header">
            <div class="tax-invoice-title">TAX INVOICE</div>
            <div class="original-stamp">ORIGINAL</div>
            <div class="gst-rule">(Issued as per Rule 1 of GOODS AND SERVICES TAX - INVOICE RULES, 2016)</div>
        </div>
        
        <div class="header">
            <h1>om engineering works</h1>
            <div class="company-address">t No. 21, MIDC Industrial Area, Andher</div>
        </div>
        
        <div class="company-details">
            <div><strong>GST No.</strong> : 27ABCDE1234F1Z5</div>
            <div style="text-align: center;"><strong>M.No.</strong> : 9560419817, <strong>Email</strong> - omengg21@gmail.com</div>
        </div>
        
        <div class="invoice-info">
            <div><strong>PAN No.</strong> : ABCDE1234F</div>
            <div><strong>STATE :</strong> Haryana <strong>STATE CODE :</strong> undefined</div>
            <div style="text-align: right; border: 1px solid #000; padding: 4px 12px;"><strong>INVOICE NO. :</strong> INV/2025-26/001 <span style="margin-left: 20px;"><strong>DATE :</strong> 30/12/2025</span></div>
        </div>
        
        <table class="party-details-table">
            <tr>
                <td colspan="2" class="party-details-header">Details of Receiver | Billed to:</td>
                <td colspan="2" class="party-details-header">Details of Consignee | Shipped to:</td>
            </tr>
            <tr>
                <td class="label">Name</td>
                <td><strong>: Ankit Patel</strong></td>
                <td class="label">Name</td>
                <td><strong>: ABC Manufacturing – Warehouse</strong></td>
            </tr>
            <tr>
                <td class="label">Address</td>
                <td><strong>:</strong> FLAT NO. C-204 TOWER C HABITAT 78 SECTOR 78</td>
                <td class="label">Address</td>
                <td><strong>:</strong> FLAT NO. C-204 TOWER C HABITAT 78 SECTOR 78</td>
            </tr>
            <tr>
                <td class="label">GST No.</td>
                <td><strong>: 24ABCDE1234F1Z9</strong></td>
                <td class="label">GST No.</td>
                <td><strong>: 24ABCDE1234F1Z9</strong></td>
            </tr>
            <tr>
                <td class="label">PAN No.</td>
                <td><strong>: ABCDE1234F</strong></td>
                <td class="label">PAN No.</td>
                <td><strong>: ABCDE1234F</strong></td>
            </tr>
            <tr>
                <td class="label">State</td>
                <td><strong>: Haryana</strong> &nbsp;&nbsp;&nbsp; <strong>State Code :</strong> 2</td>
                <td class="label">State</td>
                <td><strong>: Haryana</strong> &nbsp;&nbsp;&nbsp; <strong>State Code :</strong> 2</td>
            </tr>
            <tr>
                <td class="label">P. O. No.:-</td>
                <td>PO-2025-21</td>
                <td class="label">P. O. Date :-</td>
                <td>31/12/2025</td>
            </tr>
        </table>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th rowspan="2">S.No.</th>
                    <th rowspan="2">Description of Goods</th>
                    <th rowspan="2">HSN/SAC<br>Code</th>
                    <th rowspan="2">Rate</th>
                    <th rowspan="2">Qty.</th>
                    <th rowspan="2">Unit</th>
                    <th rowspan="2">Taxable<br>Amount</th>
                    <th colspan="2">IGST</th>
                </tr>
                <tr>
                    <th>%</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Ankit Patel<br>this is me not product</td>
                    <td>6546464</td>
                    <td>64654.00</td>
                    <td>455</td>
                    <td>Nos.</td>
                    <td>29,41,7,570.00</td>
                    <td>28</td>
                    <td>8236919.60</td>
                </tr>
                <tr class="total-row">
                    <td colspan="6" style="text-align: right; padding-right: 10px;"><strong>Total:-</strong></td>
                    <td style="text-align: right; padding-right: 10px;"><strong>29417570.00</strong></td>
                    <td colspan="2" style="text-align: right; padding-right: 10px;"><strong>8236919.60</strong></td>
                </tr>
            </tbody>
        </table>
        
        <div class="transport-details">
            <div class="transport-left">
                <div class="transport-row">
                    <span class="transport-label">Mode of Transport</span>
                    <span>: By Road</span>
                </div>
                <div class="transport-row">
                    <span class="transport-label">Vehicale No.</span>
                    <span>: 44-4-44-4</span>
                </div>
                <div class="transport-row">
                    <span class="transport-label">NO. OF PACKAGE</span>
                    <span>: 44</span>
                </div>
                <div class="transport-row">
                    <span class="transport-label">Approx. Wt. (Kgs)</span>
                    <span>: 22</span>
                </div>
            </div>
            <div class="transport-right">
                <div class="amount-row">
                    <span class="amount-label">CGST</span>
                    <span>0.00</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">SGST</span>
                    <span>0.00</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">IGST</span>
                    <span>8236919.60</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">+/-R/Off. :</span>
                    <span>0.00</span>
                </div>
                <div class="amount-row grand-total-row">
                    <span class="amount-label">Grand Total (Rs.) : -</span>
                    <span>37654489.60</span>
                </div>
            </div>
        </div>
        
        <div class="amount-in-words">
            <strong>Total Invoice Value (in words) Rs.</strong> Three Crore Seventy Six Lakh Fifty Four Thousand Four Hundred Eighty Nine and Sixty Paise
        </div>
        
        <div class="amount-in-words" style="border-top: 1px solid #000;">
            <strong>GST Payable on Reverse Charge :</strong> N.A.
        </div>
        
        <div class="declaration-section">
            <div class="declaration-left">
                <strong>Declaration :</strong> Certified that particulars given above are true & correct under GST<br>
                Act 2017 and amount indicated represents the price actually charged and that<br>
                there is no flow of additional consideration directly or indirectly from buyer.<br><br>
                1. Information of rejection must be sent within 7 days from the delivery of material.<br>
                2. Rejection if any will be accepted back in condition in which material is supplied.<br>
                3. Interest @ 24% P.A. Will be charged on invoice if not paid due date.<br>
                4. <strong>All Disputes subject to Faridabad Jurisdiction.</strong>
            </div>
            <div class="declaration-right">
                <div class="company-name-signature">
                    For om engineering works
                </div>
                <div class="signature-space">
                    (Authorised Signatory)
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm" },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=invoice.pdf",
      },
    });
  } catch (error) {
    console.error("PDF error:", error);
    return NextResponse.json({ message: "PDF failed" }, { status: 500 });
  }
}
