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
            margin-bottom: 10px;
            position: relative;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 900;
            margin: 4px 0;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        
        .tax-invoice-title {
            font-size: 22px;
            font-weight: 900;
            text-align: center;
            margin-bottom: 5px;
            text-decoration: underline;
            letter-spacing: 1px;
        }
        
        .original-stamp {
            position: absolute;
            right: 0;
            top: 0;
            border: 2.5px solid #000;
            padding: 5px 20px;
            font-weight: 900;
            font-size: 14px;
        }
        
        .gst-rule {
            font-size: 10px;
            text-align: center;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .company-address {
            text-align: center;
            font-size: 12px;
            margin-bottom: 8px;
            font-weight: 500;
            line-height: 1.4;
        }
        
        .company-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .company-details div {
            flex: 1;
        }
        
        .company-details strong {
            font-weight: 700;
        }
        
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 11px;
        }
        
        .invoice-info strong {
            font-weight: 700;
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
            padding: 6px 4px;
            text-align: center;
            font-weight: 700;
            font-size: 11px;
        }
        
        td {
            padding: 6px 5px;
            font-size: 11px;
        }
        
        .party-details-table td {
            padding: 6px 8px;
            vertical-align: top;
        }
        
        .party-details-table .label {
            font-weight: 700;
            width: 90px;
        }
        
        .party-details-header {
            background-color: #d3d3d3;
            font-weight: 700;
            text-align: center;
            padding: 6px;
            font-size: 11px;
        }
        
        .items-table td {
            text-align: center;
            padding: 7px 4px;
        }
        
        .items-table td:nth-child(2) {
            text-align: left;
            padding-left: 8px;
            padding-right: 8px;
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
            padding: 8px 10px;
        }
        
        .transport-right {
            flex: 1;
            border: 1px solid #000;
            border-left: none;
            border-top: none;
        }
        
        .transport-row {
            display: flex;
            margin-bottom: 4px;
            font-size: 11px;
        }
        
        .transport-label {
            font-weight: 700;
            width: 145px;
            flex-shrink: 0;
        }
        
        .amount-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 10px;
            border-bottom: 1px solid #000;
            font-size: 11px;
        }
        
        .amount-row:last-child {
            border-bottom: none;
        }
        
        .amount-label {
            font-weight: 700;
        }
        
        .grand-total-row {
            background-color: #f0f0f0;
            font-weight: 700;
            font-size: 12px;
        }
        
        .amount-in-words {
            border: 1px solid #000;
            border-top: none;
            padding: 10px 12px;
            font-size: 11px;
        }
        
        .declaration-section {
            display: flex;
            border: 1px solid #000;
            border-top: none;
            min-height: 190px;
        }
        
        .declaration-left {
            flex: 2;
            padding: 12px 14px;
            font-size: 10.5px;
            line-height: 1.65;
        }
        
        .declaration-right {
            flex: 1;
            border-left: 1px solid #000;
            padding: 14px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .company-name-signature {
            font-size: 15px;
            font-weight: 900;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .signature-space {
            margin-top: auto;
            padding-top: 65px;
            text-align: center;
            font-size: 12px;
            font-weight: 700;
        }
        
        .page-number {
            text-align: right;
            font-size: 11px;
            margin-bottom: 6px;
            font-weight: 500;
        }
        
        .total-row {
            font-weight: 700;
            background-color: #f5f5f5;
        }
        
        .total-row td {
            padding: 7px 10px;
            font-size: 11px;
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
            <div class="original-stamp">Extra</div>
            <div class="gst-rule">(Issued as per Rule 1 of GOODS AND SERVICES TAX - INVOICE RULES, 2016)</div>
        </div>
        
        <div class="header">
            <h1>${invoice.company.companyName}</h1>
            <div class="company-address">${invoice.company.address}</div>
        </div>
        
        <div class="company-details">
            <div><strong>GST No.</strong> : ${invoice.company.gstin}</div>
            <div style="text-align: center;"><strong>M.No.</strong> : ${
              invoice.company.phone
            }, <strong>Email</strong> - ${invoice.company.email}</div>
        </div>
        
        <div class="invoice-info">
            <div><strong>PAN No.</strong> : ${invoice.company.panno}</div>
           <div>
  <strong>STATE :</strong>&nbsp;${invoice.company.state}
  &nbsp;&nbsp;
  <strong>STATE CODE :</strong>&nbsp;${invoice.company.stateCode}
</div>

            <div style="text-align: right; border: 1px solid #000; padding: 5px 14px; font-weight: 600;"><strong>INVOICE NO. </strong> ${
              invoice.invoiceNumber
            } <span style="margin-left: 20px;"><strong>DATE :</strong> ${new Date(
      invoice.invoiceDate
    ).toLocaleDateString("en-GB")}</span></div>
        </div>
        
        <table class="party-details-table">
            <tr>
                <td colspan="2" class="party-details-header">Details of Receiver | Billed to:</td>
                <td colspan="2" class="party-details-header">Details of Consignee | Shipped to:</td>
            </tr>
            <tr>
                <td class="label">Name</td>
                <td><strong>: ${invoice.billedTo.name}</strong></td>
                <td class="label">Name</td>
                <td><strong>: ${invoice.shippedTo.name}</strong></td>
            </tr>
            <tr>
                <td class="label">Address</td>
                <td><strong>:</strong> ${invoice.billedTo.address}</td>
                <td class="label">Address</td>
                <td><strong>:</strong> ${invoice.shippedTo.address}</td>
            </tr>
            <tr>
                <td class="label">GST No.</td>
                <td><strong>: ${invoice.billedTo.gstin}</strong></td>
                <td class="label">GST No.</td>
                <td><strong>: ${invoice.shippedTo.gstin}</strong></td>
            </tr>
            <tr>
                <td class="label">PAN No.</td>
                <td><strong>: ${invoice.billedTo.pan}</strong></td>
                <td class="label">PAN No.</td>
                <td><strong>: ${invoice.shippedTo.pan || ""}</strong></td>
            </tr>
            <tr>
                <td class="label">State</td>
                <td><strong>: ${
                  invoice.billedTo.state
                }</strong> &nbsp;&nbsp;&nbsp; <strong>State Code :</strong> ${
      invoice.billedTo.stateCode
    }</td>
                <td class="label">State</td>
                <td><strong>: ${
                  invoice.shippedTo.state
                }</strong> &nbsp;&nbsp;&nbsp; <strong>State Code :</strong> ${
      invoice.shippedTo.stateCode
    }</td>
            </tr>
            <tr>
                <td class="label">P. O. No.:-</td>
                <td>${invoice.billedTo.poNo || ""}</td>
                <td class="label">P. O. Date :-</td>
                <td>${invoice.billedTo.poDate || ""}</td>
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
                ${invoice.items
                  .map(
                    (item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.productName}${
                      item.description ? "<br>" + item.description : ""
                    }</td>
                    <td>${item.hsn}</td>
                    <td>${item.rate.toFixed(2)}</td>
                    <td>${item.qty.toLocaleString()}</td>
                    <td>${item.unit}</td>
                    <td>${item.taxableAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</td>
                    <td>${item.gstPercent}</td>
                    <td>${item.gstAmount.toFixed(2)}</td>
                </tr>
                `
                  )
                  .join("")}
                <tr class="total-row">
                    <td colspan="6" style="text-align: right; padding-right: 10px;"><strong>Total:-</strong></td>
                    <td style="text-align: right; padding-right: 10px;"><strong>${invoice.totals.taxableAmount.toFixed(
                      2
                    )}</strong></td>
                    <td colspan="2" style="text-align: right; padding-right: 10px;"><strong>${invoice.totals.igst.toFixed(
                      2
                    )}</strong></td>
                </tr>
            </tbody>
        </table>
        
        <div class="transport-details">
            <div class="transport-left">
                <div class="transport-row">
                    <span class="transport-label">Mode of Transport</span>
                    <span>: ${invoice.transport.mode}</span>
                </div>
                <div class="transport-row">
                    <span class="transport-label">Vehicle No.</span>
                    <span>: ${invoice.transport.vehicleNo}</span>
                </div>
                <div class="transport-row">
                    <span class="transport-label">NO. OF PACKAGE</span>
                    <span>: ${invoice.transport.noOfPackages}</span>
                </div>
                <div class="transport-row">
                    <span class="transport-label">Approx. Wt. (Kgs)</span>
                    <span>: ${invoice.transport.approxWeight}</span>
                </div>
            </div>
            <div class="transport-right">
                <div class="amount-row">
                    <span class="amount-label">CGST</span>
                    <span>${invoice.totals.cgst.toFixed(2)}</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">SGST</span>
                    <span>${invoice.totals.sgst.toFixed(2)}</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">IGST</span>
                    <span>${invoice.totals.igst.toFixed(2)}</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">+/-R/Off. :</span>
                    <span>${invoice.totals.roundOff.toFixed(2)}</span>
                </div>
                <div class="amount-row grand-total-row">
                    <span class="amount-label">Grand Total (Rs.) : -</span>
                    <span>${invoice.totals.grandTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="amount-in-words">
            <strong>Total Invoice Value (in words) Rs.</strong> ${
              invoice.amountInWords
            }
        </div>
        
        <div class="amount-in-words" style="border-top: 1px solid #000;">
            <strong>GST Payable on Reverse Charge :</strong> N.A.
        </div>
        
        <div class="declaration-section">
            <div class="declaration-left">
                <strong>Declaration :</strong> Certified that particulars given above are true & correct under GST Act 2017 and amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from buyer.<br><br>
                1. Information of rejection must be sent within 7 days from the delivery of material.<br>
                2. Rejection if any will be accepted back in condition in which material is supplied.<br>
                3. Interest @ 24% P.A. Will be charged on invoice if not paid due date.<br>
                4. <strong>All Disputes subject to Faridabad Jurisdiction.</strong>
            </div>
            <div class="declaration-right">
                <div class="company-name-signature">
                    For ${invoice.company.companyName}
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
