package com.hackathongdg.klingon;

import android.app.Application;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParseException;
import com.parse.ParseInstallation;
import com.parse.ParsePush;
import com.parse.PushService;
import com.parse.SaveCallback;

import java.lang.Override;

public class KlingonApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        Parse.initialize(this, "02iUkCJOt8dlrS6AxmNlgrLh5qy35eyWiRzD9dkm", "BOxqOVJvNa6xCwZIiODmVO2s9lND2NtIUWxMYqgP");
    }
}