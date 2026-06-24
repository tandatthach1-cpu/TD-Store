package com.apichinh.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/zalopay"})
@CrossOrigin(origins = {"*"})
public class ZaloPayController {
   private static final String APP_ID = "2554";
   private static final String KEY_1 = "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn";
   private static final String ZALOPAY_CREATE_ORDER_URL = "https://sb-openapi.zalopay.vn/v2/create";

   @PostMapping("/create-order")
   public ResponseEntity<?> createOrder(@RequestBody(required = false) JsonNode body) {
      try {
         String amount = "0";
         if (body != null && body.hasNonNull("amount")) {
            amount = body.get("amount").asText("0");
         }

         long amountLong;
         try {
            amountLong = Long.parseLong(amount);
         } catch (NumberFormatException e) {
            return new ResponseEntity<>("Missing/invalid amount (not a number)", HttpStatus.BAD_REQUEST);
         }

         if (amountLong <= 0) {
            return new ResponseEntity<>("Missing/invalid amount", HttpStatus.BAD_REQUEST);
         }

         String appUser = body != null && body.hasNonNull("appUser")
               ? body.get("appUser").asText("user123")
               : "user123";
         String description = body != null && body.hasNonNull("orderInfo")
               ? body.get("orderInfo").asText("Thanh toan don hang")
               : "Thanh toan don hang";

         String item = "[]";
         String embedData = "{}";
         long appTime = System.currentTimeMillis();
         SimpleDateFormat fmt = new SimpleDateFormat("yyMMdd");
         String dateStr = fmt.format(Calendar.getInstance().getTime());
         String appTransId = dateStr + "_" + UUID.randomUUID().toString().substring(0, 6);
         String dataToMac = APP_ID + "|" + appTransId + "|" + appUser + "|" + amountLong + "|" + appTime + "|" + embedData + "|" + item;
         String mac = hmacSHA256(dataToMac, KEY_1);

         ObjectMapper mapper = new ObjectMapper();
         var orderParams = mapper.createObjectNode();
         orderParams.put("app_id", Integer.parseInt(APP_ID));
         orderParams.put("app_trans_id", appTransId);
         orderParams.put("app_user", appUser);
         orderParams.put("amount", amountLong);
         orderParams.put("app_time", appTime);
         orderParams.put("item", item);
         orderParams.put("embed_data", embedData);
         orderParams.put("description", description);
         orderParams.put("mac", mac);

         String responseZaloPay = sendPostRequest(ZALOPAY_CREATE_ORDER_URL, orderParams.toString());
         JsonNode zaloPayResult = mapper.readTree(responseZaloPay);

         if (zaloPayResult.has("return_code") && zaloPayResult.get("return_code").asInt() == 1) {
            var clientResult = mapper.createObjectNode();
            clientResult.put("zp_trans_token", zaloPayResult.get("zp_trans_token").asText());
            clientResult.put("app_trans_id", appTransId);
            if (zaloPayResult.has("order_url")) {
               clientResult.put("order_url", zaloPayResult.get("order_url").asText());
            }
            return new ResponseEntity<>(clientResult, HttpStatus.OK);
         }

         String errorMsg = zaloPayResult.has("return_message") ? zaloPayResult.get("return_message").asText() : "Unknown Error";
         return new ResponseEntity<>("ZaloPay Server Error: " + errorMsg, HttpStatus.BAD_REQUEST);
      } catch (Exception e) {
         return new ResponseEntity<>("ZaloPay create-order error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   private String sendPostRequest(String targetURL, String urlParameters) throws Exception {
      URL url = new URL(targetURL);
      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setRequestMethod("POST");
      connection.setRequestProperty("Content-Type", "application/json; utf-8");
      connection.setRequestProperty("Accept", "application/json");
      connection.setConnectTimeout(10000);
      connection.setReadTimeout(10000);
      connection.setDoOutput(true);

      try (OutputStream os = connection.getOutputStream()) {
         byte[] input = urlParameters.getBytes(StandardCharsets.UTF_8);
         os.write(input, 0, input.length);
      }

      StringBuilder response = new StringBuilder();
      try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
         String responseLine;
         while ((responseLine = br.readLine()) != null) {
            response.append(responseLine.trim());
         }
      }
      return response.toString();
   }

   private static String hmacSHA256(String data, String key) throws Exception {
      Mac mac = Mac.getInstance("HmacSHA256");
      SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
      mac.init(secretKey);
      byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
      return bytesToHex(rawHmac);
   }

   private static String bytesToHex(byte[] bytes) {
      StringBuilder sb = new StringBuilder(bytes.length * 2);
      for (byte b : bytes) {
         sb.append(String.format("%02x", b));
      }
      return sb.toString();
   }
}
