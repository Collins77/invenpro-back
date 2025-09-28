// utils/receipt.js
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

async function generateReceipt(sale, saleItems) {
  return new Promise((resolve, reject) => {
    try {
      const receiptDir = path.join(__dirname, "../receipts");
      if (!fs.existsSync(receiptDir)) {
        fs.mkdirSync(receiptDir);
      }

      const fileName = `receipt-${sale.id}.pdf`;
      const filePath = path.join(receiptDir, fileName);

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));

      doc.fontSize(20).text("Receipt", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Sale ID: ${sale.id}`);
      doc.text(`Date: ${sale.saleDate}`);
      doc.text(`Payment Type: ${sale.paymentType}`);
      doc.text(`Customer Type: ${sale.customerType}`);
      doc.moveDown();

      saleItems.forEach(item => {
        doc.text(`${item.quantity} x ${item.productId} @ ${item.sellingPrice} = ${item.total}`);
      });

      doc.text(`\nSubtotal: ${saleItems.reduce((a, i) => a + i.total, 0)}`);
      doc.text(`Discount: ${sale.discount}`);
      doc.text(`Total: ${sale.totalAmount}`);

      doc.end();

      resolve(fileName); // only return the filename, not the PDF itself
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateReceipt };
