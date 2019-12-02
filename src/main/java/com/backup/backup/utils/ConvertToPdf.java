package com.backup.backup.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

import org.xhtmlrenderer.pdf.ITextRenderer;

//import com.lowagie.text.DocumentException;

public class ConvertToPdf {
  public static void generatePDF(File inputFile, String outputPdfPath) throws Exception {

    OutputStream out = new FileOutputStream(outputPdfPath);

    // Flying Saucer part
    ITextRenderer renderer = new ITextRenderer();

    renderer.setDocument(inputFile);
    System.out.println(renderer.getDocument().toString());
    renderer.layout(); // css
    renderer.createPDF(out);
    out.close();
  }
}
