package com.backup.backup.utils;

import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class JsonUtil {

  @SuppressWarnings("unchecked")
  public static JSONArray sortByKey(JSONArray jsonArr, String compareKey) {
    Collections.sort(jsonArr, new Comparator<JSONObject>() {
      @Override
      public int compare(JSONObject jsonObjectA, JSONObject jsonObjectB) {
        int compare = 0;
        int keyA = Integer.valueOf(jsonObjectA.get(compareKey).toString());
        int keyB = Integer.valueOf(jsonObjectB.get(compareKey).toString());
        compare = Integer.compare(keyA, keyB);
        return compare;
      }
    });

    return jsonArr;
  }

  public static void jsonArrayFilter(JSONArray jsonArr, String key, String value) {
    for (Iterator<JSONObject> iter = jsonArr.iterator(); iter.hasNext();) {
      JSONObject obj = iter.next();
      if (obj.get(key).equals(value)) {
        iter.remove();
      }
    }
  }
}
