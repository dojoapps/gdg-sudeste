package com.hackathongdg.klingon;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;

import com.parse.ParseException;
import com.parse.ParseInstallation;
import com.parse.ParsePush;
import com.parse.SaveCallback;


public class LoginActivity extends Activity {

    EditText editText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        editText = (EditText) findViewById(R.id.email_text);

        findViewById(R.id.button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                ParsePush.subscribeInBackground(editText.getText().toString().replaceAll("[^\\w\\s\\-_]", ""), new SaveCallback() {
                    @Override
                    public void done(ParseException e) {
                        startActivity(new Intent(LoginActivity.this, ImInActivity.class));
                        finish();
                    }
                });

            }
        });

        final int height = 920;

        final View view1 = findViewById(R.id.view_1);
        final View view2 = findViewById(R.id.view_2);
        final View view3 = findViewById(R.id.view_3);

        view1.post(new Runnable() {
            @Override
            public void run() {
                view1.setY(view1.getY() + height);
                view1.setAlpha(0);
                view1.setRotation(20);
                view2.setY(view2.getY() + height);
                view2.setAlpha(0);
                view2.setRotation(20);
                view3.setY(view3.getY() + height);
                view3.setAlpha(0);
                view3.setRotation(20);

                view1.animate().yBy(-height).alpha(1).setDuration(1000).start();
                view2.animate().setStartDelay(100).yBy(-height).alpha(1).setDuration(1000).start();
                view3.animate().setStartDelay(200).yBy(-height).alpha(1).setDuration(1000).start();
            }
        });

//        view1.setY(view1.getHeight() - height);
//        view1.setAlpha(0);
//        view2.setY(view2.getHeight() - height);
//        view2.setAlpha(0);
//        view3.setY(view3.getHeight() - height);
//        view3.setAlpha(0);
//
//        view1.animate().yBy(height).alpha(1).setDuration(250).start();
//        view2.animate().setStartDelay(100).yBy(height).alpha(1).setDuration(250).start();
//        view3.animate().setStartDelay(200).yBy(height).alpha(1).setDuration(250).start();

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_login, menu);
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
