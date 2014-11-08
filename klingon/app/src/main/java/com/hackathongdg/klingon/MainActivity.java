package com.hackathongdg.klingon;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.support.v7.graphics.Palette;
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

        updateLayout();

    }

    @Override
    public void onNewIntent(Intent newIntent) {
        this.setIntent(newIntent);

        updateLayout();
    }

    private void updateLayout() {
        String translation = getIntent().getExtras().getString(KEY_TRANSLATE);
        String source = getIntent().getExtras().getString(KEY_SOURCE);
        String sourceLanguage = getIntent().getExtras().getString(KEY_LANGUAGE_SOURCE);
        String targetLanguage = getIntent().getExtras().getString(KEY_LANGUAGE_TRANSLATE);

        TextView sourceTextView = (TextView) findViewById(R.id.source_text);
        TextView translateTextView = (TextView) findViewById(R.id.translated_text);
        TextView sourceLanguageTextView = (TextView) findViewById(R.id.source_language);
        TextView translateLanguageTextView = (TextView) findViewById(R.id.translated_language);

        translateTextView.setText(translation);
        sourceTextView.setText(source);

        sourceLanguageTextView.setText(sourceLanguage);
        translateLanguageTextView.setText(targetLanguage);

        Bitmap bitmap = ((BitmapDrawable)getResources().getDrawable(getStringResource(source))).getBitmap();

        Palette.generateAsync(bitmap, new Palette.PaletteAsyncListener() {
            public void onGenerated(Palette palette) {
                getWindow().setStatusBarColor(palette.getVibrantColor(getResources().getColor(R.color.colorPrimaryDark)));
            }
        });
    }
    
    public int getStringResource(String stringName){
        return this.getResources().getIdentifier(stringName.toLowerCase(), "drawable", this.getPackageName());
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
