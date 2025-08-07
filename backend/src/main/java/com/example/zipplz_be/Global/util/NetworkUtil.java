package com.example.zipplz_be.Global.util;


import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public class NetworkUtil {

    public static boolean isNetworkConnected() {
        try {
            URL url = new URL("http://www.google.com"); // 나중에 서버 판 후, url 넣어야 함.
            HttpURLConnection urlConnect = (HttpURLConnection) url.openConnection();
            urlConnect.setConnectTimeout(3000);
            urlConnect.connect();
            return urlConnect.getResponseCode() == 200;
        } catch (IOException e) {
            return false;
        }
    }
}
