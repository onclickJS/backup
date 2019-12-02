package com.backup.backup.converter;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.logging.Level;

import org.apache.commons.io.FileUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.backup.backup.utils.ConvertToPdf;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class DocumentPdfConvertor {

  public static void main(String[] args) {
    java.util.logging.Logger.getLogger("com.gargoylesoftware").setLevel(Level.OFF);

    DocumentPdfConvertor wltm = new DocumentPdfConvertor();
    wltm.downHtmlToPdf();
  }

  public void downHtmlToPdf() {

    final WebClient webClient = new WebClient(BrowserVersion.CHROME);
    webClient.waitForBackgroundJavaScript(30000); // js 응답 시간을 기다리도록 페이지 설정
    // webClient.setJavaScriptTimeout(10000); // JS 실행 시간 초과 설정

    webClient.getOptions().setUseInsecureSSL(true);
    webClient.getOptions().setThrowExceptionOnScriptError(true); // js가 잘못 실행될 때 예외를 던질 지 여부
    webClient.getOptions().setCssEnabled(true); // css 지원
    webClient.getOptions().setJavaScriptEnabled(true); // js 인터프리터 사용 기본 true
    // webClient.getOptions().setTimeout(0); // 연결 시간 초과를 설정. 0이면 무기한 대기

    File outFile = null;
    try {
      // #1 read template
      String orgHtml = com.backup.backup.utils.FileReaderUtil.readFromHtmlResourcesAsString("web/html/doc/doc.html");
      System.out.println("orgHtml" + orgHtml);
      outFile = getFile("doc-render.html");

      // #2 read sample data
      JSONObject json = com.backup.backup.utils.ReadJsonUtil.getJson("data/doc.json");
      JSONArray docs = (JSONArray) json.get("docs");
      JSONObject docInfo = (JSONObject) docs.get(0);
      System.out.println(docInfo);

      // #3 ready rendered file
      FileWriter fileWriter = new FileWriter(outFile);
      BufferedWriter writer = new BufferedWriter(fileWriter);
      writer.write(orgHtml);

      writer.close();
      fileWriter.close();

      final HtmlPage htmlPage = webClient.getPage(outFile.toURI().toURL().toString());
//      webClient.waitForBackgroundJavaScriptStartingBefore(30000);

      // javascript call
      htmlPage.executeJavaScript("setData(" + docInfo + ")");

      // Html코드를 포함한 페이지 소스코드가 담길 스트링
      String pageSource = htmlPage.asXml();

      FileUtils.writeStringToFile(outFile, pageSource, StandardCharsets.UTF_8);

      webClient.close();

      downToPdf(outFile, new Date().getTime() + "-문서한글_v.3.pdf");

    } catch (Exception e) {
      
      if(outFile != null && outFile.exists()) {
        outFile.delete();
      }
      
      e.printStackTrace();
      throw new RuntimeException(e);
    } finally {
      if (webClient != null && webClient.getCookieManager() != null) {
        webClient.getCookieManager().clearCookies();
      }

    }
  }

  public File getFile(String fileName) throws URISyntaxException {
    System.out.println("createFile : " + fileName);
    URL url = this.getClass().getResource("/result");
    System.out.println(url);
    File parentDirectory = new File(new URI(url.toString()));
    return new File(parentDirectory, fileName);
  }

  public void downToPdf(File inputFile, String fileName) throws Exception {
    String storePath = getFile(fileName).getPath();
    ConvertToPdf.generatePDF(inputFile, storePath);
  }
}
