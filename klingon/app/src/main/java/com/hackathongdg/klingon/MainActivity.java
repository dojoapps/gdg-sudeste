package com.hackathongdg.klingon;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import java.util.Locale;


public class MainActivity extends Activity {

    public static final String KEY_SOURCE = "source";
    public static final String KEY_TRANSLATE = "translate";
    public static final String KEY_LANGUAGE_SOURCE = "source language";
    public static final String KEY_LANGUAGE_TRANSLATE = "translate language";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String translation = getIntent().getExtras().getString("translation");
        String source = getIntent().getExtras().getString("sourceText");
        String sourceLanguage = getIntent().getExtras().getString("sourceLanguage");
        String targetLanguage = getIntent().getExtras().getString("targetLanguage");

        TextView sourceTextView = (TextView) findViewById(R.id.source_text);
        TextView translateTextView = (TextView) findViewById(R.id.translated_text);
        TextView sourceLanguageTextView = (TextView) findViewById(R.id.source_language);
        TextView translateLanguageTextView = (TextView) findViewById(R.id.translated_language);

        translateTextView.setText(translation);
        sourceTextView.setText(source);

        sourceLanguageTextView.setText(sourceLanguage);
        translateLanguageTextView.setText(targetLanguage);

    }

    @Override
    public void onNewIntent(Intent newIntent) {
        this.setIntent(newIntent);

        String translation = getIntent().getExtras().getString("translation");
        String source = getIntent().getExtras().getString("sourceText");
        String sourceLanguage = getIntent().getExtras().getString("sourceLanguage");
        String targetLanguage = getIntent().getExtras().getString("targetLanguage");

        TextView sourceTextView = (TextView) findViewById(R.id.source_text);
        TextView translateTextView = (TextView) findViewById(R.id.translated_text);
        TextView sourceLanguageTextView = (TextView) findViewById(R.id.source_language);
        TextView translateLanguageTextView = (TextView) findViewById(R.id.translated_language);

        translateTextView.setText(translation);
        sourceTextView.setText(source);

        sourceLanguageTextView.setText(sourceLanguage);
        translateLanguageTextView.setText(targetLanguage);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
