const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(accStat, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, accStat);
  generateHeading(doc);
  generateInvoiceTable(doc, accStat);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 40, {width: 180})
    .moveDown();
}


function generateCustomerInformation(doc, accStat) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Personal Information:", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(formatDate(new Date()), 50, customerInformationTop + 45)

    .font("Helvetica-Bold")
    .text(accStat.AccInfo.name, 50, customerInformationTop)
    .font("Helvetica")
    .text(accStat.AccInfo.address, 50, customerInformationTop + 15)
    .text(
      accStat.AccInfo.city +
        ", " +
        accStat.AccInfo.country,
      50,
      customerInformationTop + 30
    )
    .text(accStat.AccInfo.zakat_status, 50, customerInformationTop + 60)
    .moveDown();
}

function generateHeading(doc) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("ACCOUNT STATEMENT", 240,320);

  generateHr(doc, 340);
}

function generateInvoiceTable(doc, accStat) {
  let i;
  const accStatTableTop = 350;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    accStatTableTop,
    "Date",
    "Fund",
    "Type",
    "Amount",
    "Units",
    "Bal Units",
    "Value in Rs."
  );
  generateHr(doc, accStatTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < accStat.items.length; i++) {
    const item = accStat.items[i];
    const position = accStatTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

  }

  const subtotalPosition = accStatTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(accStat.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(accStat.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(accStat.subtotal - accStat.paid)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  date,
  fund,
  type,
  amount,
  units,
  bal_units,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(date, 50, y)
    .text(fund, 100, y)
    .text(type, 170, y, { width: 90, align: "right" })
    .text(amount, 240, y, { width: 90, align: "right" })
    .text(units, 310, y, {width:90, align: "right"})
    .text(bal_units, 380, y, {width: 90, align:"right"})
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return  (cents).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};
