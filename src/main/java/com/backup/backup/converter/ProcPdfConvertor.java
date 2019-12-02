package com.backup.backup.converter;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.logging.Level;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.backup.backup.utils.ConvertToPdf;
import com.backup.backup.utils.JsonUtil;
import com.backup.backup.utils.ReadJsonUtil;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class ProcPdfConvertor {

  public static void main(String[] args) {
    java.util.logging.Logger.getLogger("com.gargoylesoftware").setLevel(Level.OFF);
    java.util.logging.Logger.getLogger("com.gargoylesoftware.htmlunit.javascript").setLevel(Level.ALL);

    ProcPdfConvertor wltm = new ProcPdfConvertor();
    wltm.downHtmlToPdf();
  }

  public void downHtmlToPdf() {

    final WebClient webClient = new WebClient(BrowserVersion.CHROME);
    // webClient.waitForBackgroundJavaScript(30000); // js 응답 시간을 기다리도록 페이지 설정
    // webClient.waitForBackgroundJavaScriptStartingBefore(30000);
    // webClient.setJavaScriptTimeout(10000); // JS 실행 시간 초과 설정

    webClient.getOptions().setUseInsecureSSL(true);
    webClient.getOptions().setThrowExceptionOnScriptError(false); // js가 잘못 실행될 때 예외를 던질 지 여부
    webClient.getOptions().setCssEnabled(false); // css 지원
    webClient.getOptions().setJavaScriptEnabled(true); // js 인터프리터 사용 기본 true
    webClient.getOptions().setDownloadImages(true);
    // webClient.getOptions().setTimeout(0); // 연결 시간 초과를 설정. 0이면 무기한 대기
    // webClient.setAjaxController(new NicelyResynchronizingAjaxController());

    try {
      // #1 read template
      String orgHtml = com.backup.backup.utils.FileReaderUtil.readFromHtmlResourcesAsString("web/html/proc/proc.html");

      // #2 read sample data
      JSONObject procInfo = getData("data/proc.json");
      JSONArray kpis = getDataList("data/proc-kpis.json");
      procInfo.put("kpis", kpis);

      JSONObject mapInfo = getData("data/proc-map.json");
      mapInfo.put("mapCell", replaceMap(mapInfo.get("mapCell").toString()));

      JSONArray acts = getDataList("data/proc-acts.json");

      JsonUtil.jsonArrayFilter(acts, "deleteFlag", "Y");
      acts = getProcActs(acts);
      mapInfo.put("acts", acts);
      procInfo.put("mapInfo", mapInfo);

      // #3 ready rendered file
      File outFile = getFile("proc-render.html");
      FileWriter fileWriter = new FileWriter(outFile);
      BufferedWriter writer = new BufferedWriter(fileWriter);
      writer.write(orgHtml);

      writer.close();
      fileWriter.close();

      final HtmlPage htmlPage = webClient.getPage(outFile.toURI().toURL().toString());
      webClient.waitForBackgroundJavaScript(100 * 1000); /* will wait JavaScript to execute up to 10s */

      // javascript call
      htmlPage.executeJavaScript("setData(" + procInfo + ")");

      // Html코드를 포함한 페이지 소스코드가 담길 스트링
      String pageSource = htmlPage.asXml();
      FileUtils.writeStringToFile(outFile, pageSource, StandardCharsets.UTF_8);

      webClient.close();

      downToPdf(outFile, new Date().getTime() + "-프로세스한글명_v.3.pdf");

    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException(e);
    } finally {
      if (webClient != null && webClient.getCookieManager() != null) {
        webClient.getCookieManager().clearCookies();
      }
    }
  }

  public String replaceMap(String mapCell) {
    String atobStr = new String(Base64.decodeBase64(mapCell.getBytes()));
    try {
      String convertedString = URLDecoder.decode(atobStr, StandardCharsets.UTF_8.toString());
      System.out.println(convertedString);

      return convertedString;
    } catch (UnsupportedEncodingException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      return mapCell;
    }
  }

  /**
   * relatedProcId 가 있는 경우 연관 프로세스에서 act 조회
   * 
   * @param acts
   * @return
   */
  public JSONArray getProcActs(JSONArray acts) {
    JSONArray replaceList = new JSONArray();
    int len = acts.size();

    for (int i = 0; i < len; i++) {
      JSONObject act = (JSONObject) acts.get(i);
      String relatedProcId = (String) act.get("relatedProcId");

      if (StringUtils.isNotBlank(relatedProcId) && relatedProcId.equals("00000000000000008895")) { // test 용
        // if (StringUtils.isNotBlank(relatedProcId) {
        // act 데이터 조회
        act = getRelatedAct(relatedProcId, Integer.valueOf(act.get("relatedActSeq").toString()));
      }

      replaceList.add(act);
    }
    return replaceList;
  }

  public JSONObject getRelatedAct(String procId, int actSeq) {
    JSONObject act = getData("data/proc-act.json");
    return act;
  }

  public JSONObject getData(String dataPath) {
    JSONObject data = ReadJsonUtil.getJson(dataPath);
    JSONArray arr = (JSONArray) data.get("docs");
    return (JSONObject) arr.get(0);
  }

  public JSONArray getDataList(String dataPath) {
    JSONObject data = ReadJsonUtil.getJson(dataPath);
    JSONArray arr = (JSONArray) data.get("docs");
    return arr;
  }

  public File getFile(String fileName) throws URISyntaxException {
    System.out.println("createFile : " + fileName);
    URL url = this.getClass().getResource("/result");
    // System.out.println(url);
    File parentDirectory = new File(new URI(url.toString()));
    return new File(parentDirectory, fileName);
  }

  public void downToPdf(File inputFile, String fileName) throws Exception {
    String storePath = getFile(fileName).getPath();
    ConvertToPdf.generatePDF(inputFile, storePath);
  }
}