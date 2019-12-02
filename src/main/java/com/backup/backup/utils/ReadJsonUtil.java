package com.backup.backup.utils;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class ReadJsonUtil {
  public static JSONObject getJson(String path) {
    JSONParser parser = new JSONParser();

    try {
      Object obj = parser.parse(new InputStreamReader(new FileInputStream(ClassLoader.getSystemResource(path).getPath()), StandardCharsets.UTF_8));

      JSONObject jsonObject = (JSONObject) obj;

      return jsonObject;

    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }
}
