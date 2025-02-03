import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.resolve(__dirname, '../assets/mv.pdf');  
const jsonOutputPath = path.resolve(__dirname, '../../public/fragments.json');


const processPdf = async (pdfPath, jsonOutputPath) => {
  
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);

    const jsonData = {
      titulo: 'Virtual Mentor info, RAG to assistent',
      contenido: pdfData.text,
    };

    console.log("💾 Guardando JSON en", jsonOutputPath);
    fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));

  } catch (error) {
    console.error("❌ Error to process PDF:", error);
  }
};


processPdf(pdfPath, jsonOutputPath);
