package com.hackathongdg.klingon;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
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

        Drawable sourceFlag = getResources().getDrawable(getStringResource(sourceLanguage));
        Drawable translationFlag = getResources().getDrawable(getStringResource(targetLanguage));

        sourceLanguageTextView.setCompoundDrawablesRelativeWithIntrinsicBounds(sourceFlag, null, null, null);
        translateLanguageTextView.setCompoundDrawablesRelativeWithIntrinsicBounds(translationFlag, null, null, null);

        Bitmap bitmap = ((BitmapDrawable)sourceFlag).getBitmap();

        Palette.generateAsync(bitmap, new Palette.PaletteAsyncListener() {
            public void onGenerated(Palette palette) {
                getWindow().setStatusBarColor(palette.getVibrantColor(getResources().getColor(R.color.colorPrimaryDark)));
            }
        });
    }

    public int getStringResource(String stringName){
        return this.getResources().getIdentifier(stringName.toLowerCase(), "drawable", this.getPackageName());
    }
}
