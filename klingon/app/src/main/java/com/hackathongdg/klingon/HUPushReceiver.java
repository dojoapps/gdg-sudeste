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
        Toast.makeText(context, "Push received", Toast.LENGTH_SHORT).show();

        try {

            if (intent == null || !(intent.hasExtra("com.parse.Data")))
                return;

            JSONObject json = new JSONObject(intent.getExtras().getString("com.parse.Data"));

            System.out.println(json.toString());

            String label = json.getString("translation");
            String title = context.getString(R.string.app_name) + " "
                    + Locale.forLanguageTag(json.getString("sourceLanguage")).getDisplayLanguage()
                    + " to "
                    + Locale.forLanguageTag(json.getString("targetLanguage")).getDisplayLanguage();

            Intent actionIntent = new Intent(context, MainActivity.class);
            PendingIntent actionPendingIntent =
                    PendingIntent.getActivity(context, 0, actionIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT);

            NotificationCompat.Action action =
                    new NotificationCompat.Action.Builder(R.drawable.ic_launcher,
                            context.getString(R.string.app_name), actionPendingIntent)
                            .build();

            NotificationCompat.Builder mBuilder =
                    new NotificationCompat.Builder(context)
                            .setSmallIcon(R.drawable.ic_launcher)
                            .setContentTitle(title)
                            .setContentText(label)
                            .setAutoCancel(true)
                            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                            .setContentIntent(actionPendingIntent)
                            .setDefaults(Notification.DEFAULT_SOUND)
                            .extend(new NotificationCompat.WearableExtender().addAction(action));

            android.app.Notification notification = new NotificationCompat.BigTextStyle(mBuilder)
                    .bigText(label).build();

            NotificationManager mNotificationManager =
                    (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            mNotificationManager.notify(1, notification);

        } catch (JSONException e) {
            Log.d(TAG, "JSONException: " + e.getMessage());
        } catch (Exception e) {
            Log.d(TAG, "Exception Push: " + e.getMessage());
        }
    }

}
