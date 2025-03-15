import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

const createPdfDocument = function (options = {}) {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path.join(options.basePath, "config.pdf");
            const doc = new PDFDocument();
            const writeStream = fs.createWriteStream(filePath);
            
            doc.pipe(writeStream);
            doc.text(options.jsonString); // Format JSON for readability
            doc.end();

            writeStream.on("finish", resolve); // Resolve when writing is done
            writeStream.on("error", reject);   // Reject if an error occurs
        } catch (error) {
            reject(error); // Ensure errors are handled properly
        }
    });
};

export default createPdfDocument;
