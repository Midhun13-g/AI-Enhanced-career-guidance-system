import java.net.*;
import java.io.*;

public class TestConnection {

    public static void main(String[] args) {
        test("https://www.google.com");
        test("https://huggingface.co");
        test("https://midhun-2542-career-guidance-system.hf.space");
    }

    static void test(String url) {
        System.out.println("\nTesting: " + url);

        try {
            URL u = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) u.openConnection();

            conn.setConnectTimeout(30000);
            conn.setReadTimeout(30000);
            conn.setRequestMethod("GET");

            System.out.println("Response: " + conn.getResponseCode());
            System.out.println("Success: Java can connect");

            conn.disconnect();

        } catch (Exception e) {
            System.out.println("FAILED: " + e.getClass().getName());
            System.out.println("Message: " + e.getMessage());
        }
    }
}