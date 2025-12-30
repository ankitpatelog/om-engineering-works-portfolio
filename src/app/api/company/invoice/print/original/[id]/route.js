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
<html>
<head>
<meta charset="UTF-8" />
<title>Tax Invoice</title>

<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    margin: 0;
    padding: 14px;
  }

  .invoice-box {
    border: 1px solid #000;
    padding: 10px;
  }

  .center { text-align: center; }
  .bold { font-weight: bold; }
  .left { text-align: left; }
  .right { text-align: right; }

  table {
    width: 100%;
    border-collapse: collapse;
    page-break-inside: auto;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  table th,
  table td {
    border: 1px solid #000;
    padding: 4px;
    text-align: center;
  }

  .watermark {
    position: fixed;
    top: 20px;
    right: 20px;
    font-weight: bold;
    border: 1px solid #000;
    padding: 4px 10px;
  }

  .page-break {
    page-break-before: always;
  }
</style>
</head>

<body>

<div class="invoice-box">

  <!-- HEADER -->
  <div class="center bold">TAX INVOICE</div>
  <div class="center">
    (Issued as per Rule 1 of Goods and Services Tax – Invoice Rules, 2016)
  </div>

  <div class="watermark">ORIGINAL</div>

  <h2 class="center">${invoice.company.companyName}</h2>
  <div class="center">
    ${invoice.company.address}<br/>
    GST No: ${invoice.company.gstin} |
    PAN: ${invoice.company.panno}<br/>
    M: ${invoice.company.phone} |
    Email: ${invoice.company.email}<br/>
    State: ${invoice.company.state} |
    State Code: ${invoice.company.stateCode}
  </div>

  <hr/>

  <!-- INVOICE META -->
  <table>
    <tr>
      <td class="left"><b>Invoice No:</b> ${invoice.invoiceNumber}</td>
      <td class="left"><b>Date:</b> ${new Date(
        invoice.invoiceDate
      ).toLocaleDateString()}</td>
    </tr>
  </table>

  <!-- BILL TO / SHIP TO -->
  <table>
    <tr>
      <th>Details of Receiver (Billed To)</th>
      <th>Details of Consignee (Shipped To)</th>
    </tr>
    <tr>
      <td class="left">
        <b>Name:</b> ${invoice.billedTo.name}<br/>
        <b>Address:</b> ${invoice.billedTo.address}<br/>
        <b>GST No:</b> ${invoice.billedTo.gstin}<br/>
        <b>PAN:</b> ${invoice.billedTo.pan}<br/>
        <b>State:</b> ${invoice.billedTo.state}<br/>
        <b>State Code:</b> ${invoice.billedTo.stateCode}<br/>
        <b>P.O. No:</b> ${invoice.billedTo.poNo || ""}<br/>
        <b>P.O. Date:</b> ${invoice.billedTo.poDate || ""}
      </td>
      <td class="left">
        <b>Name:</b> ${invoice.shippedTo.name}<br/>
        <b>Address:</b> ${invoice.shippedTo.address}<br/>
        <b>GST No:</b> ${invoice.shippedTo.gstin}<br/>
        <b>PAN:</b> ${invoice.shippedTo.pan}<br/>
        <b>State:</b> ${invoice.shippedTo.state}<br/>
        <b>State Code:</b> ${invoice.shippedTo.stateCode}
      </td>
    </tr>
  </table>

  <!-- ITEMS TABLE (DYNAMIC + PAGE SAFE) -->
  <table>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Description of Goods</th>
        <th>HSN/SAC</th>
        <th>Rate</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Taxable Amount</th>
        <th>GST %</th>
        <th>GST Amt</th>
        <th>Total</th>
      </tr>
    </thead>

    <tbody>
      ${invoice.items
        .map(
          (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td class="left">${item.productName}<br/>${
            item.description || ""
          }</td>
          <td>${item.hsn}</td>
          <td>${item.rate.toFixed(2)}</td>
          <td>${item.qty}</td>
          <td>${item.unit}</td>
          <td>${item.taxableAmount.toFixed(2)}</td>
          <td>${item.gstPercent}%</td>
          <td>${item.gstAmount.toFixed(2)}</td>
          <td>${item.totalAmount.toFixed(2)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <!-- TOTALS (WILL MOVE TO NEW PAGE IF NEEDED) -->
  <div class="page-break"></div>

  <table>
    <tr>
      <td class="left">
        <b>Mode of Transport:</b> ${invoice.transport.mode}<br/>
        <b>Vehicle No:</b> ${invoice.transport.vehicleNo}<br/>
        <b>No. of Packages:</b> ${invoice.transport.noOfPackages}<br/>
        <b>Approx Wt (Kgs):</b> ${invoice.transport.approxWeight}
      </td>
      <td class="right">
        <b>Taxable Amount:</b> ₹${invoice.totals.taxableAmount.toFixed(2)}<br/>
        <b>CGST:</b> ₹${invoice.totals.cgst.toFixed(2)}<br/>
        <b>SGST:</b> ₹${invoice.totals.sgst.toFixed(2)}<br/>
        <b>IGST:</b> ₹${invoice.totals.igst.toFixed(2)}<br/>
        <b>Round Off:</b> ₹${invoice.totals.roundOff.toFixed(2)}<br/>
        <h3>Grand Total: ₹${invoice.totals.grandTotal.toFixed(2)}</h3>
      </td>
    </tr>
  </table>

  <p><b>Amount in Words:</b> ${invoice.amountInWords}</p>

  <p>
    Declaration: Certified that the particulars given above are true & correct under GST Act 2017.
  </p>

  <div style="display:flex; justify-content:space-between; margin-top:40px;">
    <div>Subject to jurisdiction.</div>
    <div class="center">
      For <b>${invoice.company.companyName}</b><br/><br/>
      Authorised Signatory
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
