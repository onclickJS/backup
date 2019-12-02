package com.backup.backup.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class FileReaderUtil {
  public static InputStreamReader readFromResourcesAsInputStream(String path) {
    System.out.println(path);

    InputStream in = FileReaderUtil.class.getClassLoader().getResourceAsStream(path);
    System.out.println("in " + in);
    return new InputStreamReader(in);
  }

  public static String readFromResourcesAsString(String path) {
    System.out.println(path);

    String str = "";
    StringBuilder result = new StringBuilder("");
    try (InputStreamReader is = readFromResourcesAsInputStream(path);) {

      BufferedReader reader = new BufferedReader(is);
      if (is != null) {
        while ((str = reader.readLine()) != null) {
          result.append(str + "\n");
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException(e);
    }

    return result.toString();

  }

  public static String readFromHtmlResourcesAsString(String path) {
    URL url = ClassLoader.getSystemResource(path);
    File file;
    Document doc;

    try {
      file = new File(url.toURI());
      doc = Jsoup.parse(file, StandardCharsets.UTF_8.toString());
      return doc.toString();
    } catch (URISyntaxException e1) {
      e1.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      file = null;
      doc = null;
    }
    return "";
  }
}
