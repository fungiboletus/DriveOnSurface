package com.karts.driveonsurface;

import android.os.Bundle;
import android.preference.PreferenceManager;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

/**
 * FirstMenuActivity : First activity to show : allow the player to put in his
 * pseudo and change the server's parametres
 * 
 * Last update : 15/02/2013
 * 
 * @author Sabrine ROUIS - SI5 IHM
 * 
 */
@SuppressLint("NewApi")
public class FirstMenuActivity extends Activity {

	private Button btnPlay; // bouton play
	private EditText txtPseudo; // Text pseudo
	private TextView txtView;
	private static ClientSocketIO cltSoc; // socket.io client
	private static final int RESULT_SETTINGS = 1;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_first_menu);

		btnPlay = (Button) findViewById(R.id.btnPlay);
		txtPseudo = (EditText) findViewById(R.id.txtPseudo);
		txtView = (TextView) findViewById(R.id.txtView);

		// for saving shared data (here the player's pseudo)
		final SharedPreferences sharedPrefs = PreferenceManager
				.getDefaultSharedPreferences(this);

		// button on click event
		btnPlay.setOnClickListener(new View.OnClickListener() {

			public void onClick(View v) {
				String pseudo = txtPseudo.getText().toString();
				// Ne passe pas au suivant tant que le joueur n'a pas donné son
				// pseudo
				if (pseudo.isEmpty()) {
					txtView.setText("Please give a pseudo!");
				} else {
					Log.d("pseudo", pseudo);

					Intent intent = new Intent(FirstMenuActivity.this,
							KartFragment.class);
					// save shared data and commit it
					SharedPreferences.Editor editor = sharedPrefs.edit();
					editor.putString("UserName", pseudo); // value to store
					editor.commit();
					startActivity(intent);

				}

			}

		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.activity_first_menu, menu);
		return true;
	}

	// gestion de menu pour le parametrage du serveur
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {

		case R.id.menu_settings:
			Intent i = new Intent(this, SettingActivity.class);
			startActivityForResult(i, RESULT_SETTINGS);
			break;
		}

		return true;
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);

		switch (requestCode) {
		case RESULT_SETTINGS:
			break;

		}

	}
}
