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
      const doc = new PDFDocument({ margin: 50 });
      
      doc.pipe(fs.createWriteStream(filePath));

      // Header with title
      const pageWidth = doc.page.width;
      const rightMargin = pageWidth - 50;
      
      // Company name
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#666666')
         .text('Billiards Chillzone', 50, 40);
      
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text('Sales Receipt', 50, 60);
      
      // Date and time on the right
      const currentDate = new Date(sale.saleDate);
      const formattedDate = currentDate.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric', 
        year: 'numeric' 
      });
      const formattedTime = currentDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      });
      
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#666666')
         .text(`${formattedDate} • ${formattedTime}`, 50, 60, {
           align: 'right',
           width: rightMargin - 50
         });

      doc.moveDown(3);

      // Receipt Number and Customer Type sections side by side
      const leftColumnX = 50;
      const rightColumnX = 300;
      let currentY = doc.y;

      // Receipt Number (left column)
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#666666')
         .text('Receipt Number', leftColumnX, currentY);
      
      doc.fontSize(13)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text(sale.id, leftColumnX, currentY + 20);

      // Customer Type (right column)
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#666666')
         .text('Customer Type', rightColumnX, currentY);
      
      doc.fontSize(13)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text(sale.customerType, rightColumnX, currentY + 20);

      doc.moveDown(5);

      // Divider line
      currentY = doc.y;
      doc.strokeColor('#CCCCCC')
         .lineWidth(1)
         .moveTo(50, currentY)
         .lineTo(rightMargin, currentY)
         .stroke();

      doc.moveDown(2);

      // Items Purchased heading
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text('Items Purchased', 50, doc.y);

      doc.moveDown(2);

      // Table header
      currentY = doc.y;
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#666666')
         .text('ITEM', 50, currentY)
         .text('QTY', 350, currentY)
         .text('PRICE', 430, currentY)
         .text('TOTAL', 510, currentY);

      doc.moveDown(1.5);

      // Table items with borders
      let subtotal = 0;
      saleItems.forEach((item, index) => {
        currentY = doc.y;
        
        // Item details with ID and name
        const itemText = item.productName 
          ? `${item.productId} - ${item.productName}` 
          : item.productId;
        
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#000000')
           .text(itemText, 50, currentY, { width: 280 })
           .text(item.quantity.toString(), 350, currentY)
           .text(`KES ${parseFloat(item.sellingPrice).toFixed(2)}`, 430, currentY)
           .font('Helvetica-Bold')
           .text(`KES ${parseFloat(item.total).toFixed(2)}`, 510, currentY);
        
        subtotal += parseFloat(item.total);
        
        // Add bottom border after each item
        const borderY = currentY + 25;
        doc.strokeColor('#E5E5E5')
           .lineWidth(0.5)
           .moveTo(50, borderY)
           .lineTo(rightMargin, borderY)
           .stroke();
        
        doc.moveDown(1.8);
      });

      doc.moveDown(2);

      // Summary section (right-aligned)
      currentY = doc.y;
      const labelX = 420;
      const valueX = 510;

      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#000000')
         .text('Subtotal:', labelX, currentY, { width: 80, align: 'left' })
         .text(`KES ${subtotal.toFixed(2)}`, valueX, currentY, { width: 80, align: 'left' });

      currentY += 20;
      doc.text('Discount:', labelX, currentY, { width: 80, align: 'left' })
         .text(`KES ${parseFloat(sale.discount).toFixed(2)}`, valueX, currentY, { width: 80, align: 'left' });

      currentY += 30;
      doc.fontSize(13)
         .font('Helvetica-Bold')
         .text('Total:', labelX, currentY, { width: 80, align: 'left' })
         .text(`KES ${parseFloat(sale.totalAmount).toFixed(2)}`, valueX, currentY, { width: 80, align: 'left' });

      currentY += 25;
      doc.fontSize(10)
         .font('Helvetica')
         .text('Payment Method:', labelX, currentY, { width: 80, align: 'left' })
         .font('Helvetica-Bold')
         .text(sale.paymentType, valueX, currentY, { width: 80, align: 'left' });

      // Footer
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#666666')
         .text('Thank you for your purchase!', 50, doc.page.height - 100, {
           align: 'center',
           width: pageWidth - 100
         });

      doc.end();
      resolve(fileName);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateReceipt };