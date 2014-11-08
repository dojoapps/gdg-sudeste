package com.hackathongdg.klingon;

import android.annotation.TargetApi;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.SyncStateContract;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.util.Log;
import android.widget.Toast;

import com.parse.ParsePushBroadcastReceiver;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Locale;

public class HUPushReceiver extends ParsePushBroadcastReceiver {

    private static final String TAG = "HUPushReceiver";

    public HUPushReceiver() {
        // N/A
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onPushReceive(Context context, Intent intent) {

        try {

            if (intent == null || !(intent.hasExtra("com.parse.Data")))
                return;

            JSONObject json = new JSONObject(intent.getExtras().getString("com.parse.Data"));

            String translation = json.getString("translation");
            String source = json.getString("sourceText");
            String sourceLanguage = Locale.forLanguageTag(json.getString("sourceLanguage")).getDisplayLanguage();
            String targetLanguage = Locale.forLanguageTag(json.getString("targetLanguage")).getDisplayLanguage();

            String title = context.getString(R.string.app_name) + " "
                    + sourceLanguage
                    + " to "
                    + targetLanguage;

            Intent actionIntent = new Intent(context, MainActivity.class);

            actionIntent.putExtra(MainActivity.KEY_SOURCE, source);
            actionIntent.putExtra(MainActivity.KEY_TRANSLATE, translation);
            actionIntent.putExtra(MainActivity.KEY_LANGUAGE_SOURCE, sourceLanguage);
            actionIntent.putExtra(MainActivity.KEY_LANGUAGE_TRANSLATE, targetLanguage);

            PendingIntent actionPendingIntent =
                    PendingIntent.getActivity(context, 0, actionIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT);

            NotificationCompat.Action action =
                    new NotificationCompat.Action.Builder(R.drawable.ic_launcher,
                            context.getString(R.string.app_name), actionPendingIntent)
                            .build();

            NotificationCompat.BigTextStyle bigStyle = new NotificationCompat.BigTextStyle();
            bigStyle.bigText(translation);

            NotificationCompat.Builder mBuilder =
                    new NotificationCompat.Builder(context)
                            .setSmallIcon(R.drawable.ic_launcher)
                            .setContentTitle(title)
                            .setContentText(translation)
                            .setAutoCancel(true)
                            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                            .setContentIntent(actionPendingIntent)
                            .setDefaults(NotificationCompat.DEFAULT_SOUND)
                            .extend(new NotificationCompat.WearableExtender().addAction(action))
                            .setStyle(bigStyle);

            NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(context);

            notificationManagerCompat.notify(1, mBuilder.build());

        } catch (JSONException e) {
            Log.d(TAG, "JSONException: " + e.getMessage());
        } catch (Exception e) {
            Log.d(TAG, "Exception Push: " + e.getMessage());
        }
    }

}
