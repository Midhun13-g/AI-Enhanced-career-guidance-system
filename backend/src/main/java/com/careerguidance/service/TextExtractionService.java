package com.careerguidance.service;

import com.careerguidance.exception.ParsingFailedException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class TextExtractionService {

    public String extractText(Path filePath) {
        String fileName = filePath.getFileName().toString().toLowerCase();
        try (InputStream is = Files.newInputStream(filePath)) {
            if (fileName.endsWith(".pdf")) {
                return extractFromPdf(is);
            } else if (fileName.endsWith(".docx")) {
                return extractFromDocx(is);
            }
            throw new ParsingFailedException("Unsupported file type: " + fileName);
        } catch (IOException e) {
            throw new ParsingFailedException("Failed to extract text from resume: " + e.getMessage(), e);
        }
    }

    private String extractFromPdf(InputStream is) throws IOException {
        try (PDDocument doc = Loader.loadPDF(is.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc).trim();
            if (text.isBlank()) throw new ParsingFailedException("Resume PDF appears to be empty or image-based");
            return text;
        }
    }

    private String extractFromDocx(InputStream is) throws IOException {
        try (XWPFDocument doc = new XWPFDocument(is)) {
            StringBuilder sb = new StringBuilder();
            doc.getParagraphs().forEach(p -> sb.append(p.getText()).append("\n"));
            String text = sb.toString().trim();
            if (text.isBlank()) throw new ParsingFailedException("Resume DOCX appears to be empty");
            return text;
        }
    }
}
