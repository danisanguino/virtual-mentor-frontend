import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.resolve(__dirname, '../assets/mv.pdf');  
const jsonOutputPath = path.resolve(__dirname, '../data/fragments.json');


const processPdf = async (pdfPath, jsonOutputPath) => {
  try {
    console.log("📖 Leyendo el archivo PDF...");
    const dataBuffer = fs.readFileSync(pdfPath);
    
    console.log("✅ Archivo PDF leído correctamente");
    const pdfData = await pdfParse(dataBuffer);
    console.log("📄 PDF procesado");


    const jsonData = {
      titulo: 'Virtual Mentor to RAG',
      contenido: pdfData.text,
    };

    console.log("💾 Guardando JSON en", jsonOutputPath);
    fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
    console.log(`✅ JSON guardado correctamente en ${jsonOutputPath}`);
  } catch (error) {
    console.error("❌ Error al procesar el PDF:", error);
  }
};


processPdf(pdfPath, jsonOutputPath);
