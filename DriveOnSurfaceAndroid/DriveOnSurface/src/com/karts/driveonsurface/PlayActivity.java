
package com.karts.driveonsurface;
/**
 * PlayActivity is to control the kart with the accelerometre
 * here we manage also the bonus, rank, speed and the position on the kart
 * 
 * Date : 15/02/2013
 * @author : Sabrine Rouis - SI5 IHM
 */
import android.os.*;
import java.util.Arrays;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class PlayActivity extends Activity {

	// Pour gérer l'accéléromètre
	private SensorManager mSensorManager;
	// Champ de texte pour la direction
	private TextView text_dir;
	// Champ de texte pour la vitesse de l'accéléromètre
	private TextView text_vit;
	// Champ de texte pour la vitesse du kart
	private TextView text_kart_vit;
	// Champ de texte pour le rank du kart
	private TextView text_kart_rank;
	private TextView text_kart_position;
	// Tableau contenant la commande pour le microcontroleur
	static int[] cmds = new int[5];

	// les images des bonus
	private ImageView rabbit;
	private ImageView train;
	private ImageView nails;
	private ImageView engine;
	private ImageView noBonus;
	// Pour locker l'écran
	private PowerManager.WakeLock wl;
	// Client socket io
	private ClientSocketIO cltSoc;

	/**
	 * Appelé lors de la création de l'activité
	 */

	@SuppressWarnings("deprecation")
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// On charge le layout associé à cette activité
		setContentView(R.layout.play_layout);
		// This is for blocking the screen from turning off
		// Wake Lock : stay wake all the while
		PowerManager pm = (PowerManager) this
				.getSystemService(Context.POWER_SERVICE);
		wl = pm.newWakeLock(PowerManager.SCREEN_BRIGHT_WAKE_LOCK
				| PowerManager.ON_AFTER_RELEASE, this.getClass().getName());

		// On se connecte à l'accéléromètre
		mSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
		mSensorManager.registerListener(mSensorListener,
				mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
				SensorManager.SENSOR_DELAY_NORMAL);

		// On se connecte au champs textes
		text_dir = (TextView) findViewById(R.id.textDir); // direction
		text_vit = (TextView) findViewById(R.id.textVit); // vitesse de l'accelerometre
		text_kart_vit = (TextView) findViewById(R.id.textKartVit); // vitesse de kart
		text_kart_rank = (TextView) findViewById(R.id.textKartRk); // rank
		text_kart_position = (TextView) findViewById(R.id.textPos); // position
																	

		// On se connecte aux images bonus
		rabbit = (ImageView) findViewById(R.id.bonusRabbit);
		train = (ImageView) findViewById(R.id.bonusTrain);
		nails = (ImageView) findViewById(R.id.bonusNails);
		engine = (ImageView) findViewById(R.id.bonusEngine);
		noBonus = (ImageView) findViewById(R.id.noBonus);

		// au chargement de l'activité : hide bonus
		rabbit.setVisibility(View.INVISIBLE);
		train.setVisibility(View.INVISIBLE);
		nails.setVisibility(View.INVISIBLE);
		engine.setVisibility(View.INVISIBLE);
	//	noBonus.setVisibility(View.INVISIBLE);

		// On initialise la commande
		/**
		 * cmds : tableau de commandes pour controler la voiture cmds[0] : état
		 * du jeu : actif ou pas 0 : STOP , 1 : GO cmds[1] : position : avancer
		 * ou reculer : 1 : UP, 0 :DOWN cmds[2] : vitesse : entre 0 et 10
		 * cmds[3] : direction : tourner : 0 : LEFT, 1 : RIGHT cmds[4] : vitesse
		 * de rotation : entre 0 et 5
		 * */
		cmds[0] = 0;
		cmds[1] = 0;
		cmds[2] = 0;
		cmds[3] = 0;
		cmds[4] = 0;

		Bundle extras = getIntent().getExtras();
		if (extras != null) {

			// On récupere nos parametres String
			String color = (String) extras.get("color");
			SharedPreferences sharedPrefs = PreferenceManager
					.getDefaultSharedPreferences(this);
			String pseudo = sharedPrefs.getString("UserName", "NULL");

			if (pseudo != null) {

				// on se connecte au serveur :
				connectToServer(pseudo, color);

			}
		}

	}

	/**
	 * Met à jour l'affichage avec les nouvelles valeurs de la position par
	 * rapport à l'accéléromètre
	 * 
	 * @param iY
	 *            La position en Y (Direction)
	 * @param iZ
	 *            La position en Z (Vitesse)
	 * @return void
	 */
	public void Position(float iY, float iZ) {
		text_dir.setText(" " + (byte) iY);
		text_vit.setText(" " + (byte) iZ);

	}

	// Permet de détecter les modifications au niveau de l'accéléromètre
	private final SensorEventListener mSensorListener = new SensorEventListener() {

		// En cas de changement
		public void onSensorChanged(SensorEvent se) {
			// On récupère la valeur en y
			float y = se.values[1];
			// On récupère la valeur en z
			float z = se.values[2];
			Position(y, z);

			// Mettre à jour la vitesse, le rang et la position du Kart
			text_kart_vit.setText(" " + cltSoc.getSpeed());
			Log.v("speed : ", "" + cltSoc.getSpeed());
			text_kart_rank.setText(" " + cltSoc.getRank());
			Log.v("rank : ", "" + cltSoc.getRank());
			text_kart_position.setText(" " + cltSoc.getPosition());

			/* Affiche ou cache le bonus reçu du serveur */

			Log.e("bonus", "to show : " + cltSoc.getEnableBonus());
			Log.e("bonus", "to hide : " + cltSoc.getDisableBonus());
			showBonus(cltSoc.getEnableBonus());
			hideBonus(cltSoc.getDisableBonus());
			/*
			 * On étudie les cas possibles : -> Si la valeur est positive, on
			 * transmet la commande "Forward" -> Si la valeur est négative, on
			 * transmet la commande "Backward", et on prend la valeur absolue de
			 * la mesure
			 */
			if (z > 0) {
				cmds[1] = 1;
				Log.d("sensor", "GO Backward");
			} else {
				cmds[1] = 0;
				Log.d("sensor", "GO Forward");
				z = -z;
			}
			cmds[2] = (int) z;

			/*
			 * On étudie les cas possibles : -> Si la valeur est positive, on
			 * transmet la commande "Right" -> Si la valeur est négative, on
			 * transmet la commande "Left", et on prend la valeur absolue de la
			 * mesure
			 */
			if (y > 0) {
				cmds[3] = 1;
				Log.d("sensor", "GO Right");
			} else {
				cmds[3] = 0;
				Log.d("sensor", "GO Left");
				y = -y;
			}
			cmds[4] = (int) y;
			// On met à jour les valeurs sur l'écran
			Position(y, z);
			// On teste si l'on a validé la commande (Appuie sur GO)
			if (cmds[0] != 0) {
				// On envoie la commande sur le serveur
				try {

					cltSoc.sendMsg("commande", Arrays.toString(cmds));
					Log.d("command", Arrays.toString(cmds));

				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
			// en fin du tour, on affiche le rank final
			if (cltSoc.isFinished()) {
				showFinalrank(cltSoc.getFinalRank());
			}

		}

		@Override
		public void onAccuracyChanged(Sensor sensor, int accuracy) {
			// TODO Auto-generated method stub

		}
	};

	@Override
	protected void onResume() {
		super.onResume();
		mSensorManager.registerListener(mSensorListener,
				mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
				SensorManager.SENSOR_DELAY_NORMAL);
	}

	@Override
	protected void onStop() {
		mSensorManager.unregisterListener(mSensorListener);
		super.onStop();
	}

	// Gestion du clic sur les boutons
	public void OnclickHandler(View view) throws Exception {

		Button goOrStop = (Button) findViewById(R.id.buttonGo);
		String curText = (String) goOrStop.getText();
		switch (view.getId()) {
		case R.id.buttonGo:
			if (curText.equals("GO")) {
				cmds[0] = 1;
				goOrStop.setText("STOP");
			}

			if (curText.equals("STOP")) {
				cmds[0] = 0;
				goOrStop.setText("GO");
			}
			break;

		case R.id.buttonExit:
			
			showFinalrank(cltSoc.getFinalRank());
			break;
			
		case R.id.bonusRabbit:
			cltSoc.sendMsg("bonus", "Rabbit");
			rabbit.setVisibility(View.INVISIBLE);
			break;
			
		case R.id.bonusTrain:
			cltSoc.sendMsg("bonus", "Train");
			train.setVisibility(View.INVISIBLE);
			break;
			
		case R.id.bonusNails:
			cltSoc.sendMsg("bonus", "Nails");
			nails.setVisibility(View.INVISIBLE);
			break;
			
		case R.id.bonusEngine:
			cltSoc.sendMsg("bonus", "BiggerEngine");
			engine.setVisibility(View.INVISIBLE);
			break;

		}

	}

	/**
	 * exit et log out from the game
	 */
	public void exit() {

		cltSoc.sendMsg("exit", "kill this kart");
		//fermer l'activité et aller en arriére (vers la page de connexion)
		Intent intent = new Intent(getApplicationContext(), KartFragment.class);
		intent.putExtra("finish", true);
		intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP); // To clean up all
															// activities
		startActivity(intent);
		finish();

		super.finish();
		System.exit(0);

	}

	/**
	 * Connecting to the server
	 * 
	 * @param name
	 *            : pseudo of the player
	 * @param color
	 *            : kart's color
	 * 
	 */
	public void connectToServer(String name, String color) {
		//On récupére les IP et Port qui sont des variables partagées sur toute l'application :
		SharedPreferences sharedPrefs = PreferenceManager
				.getDefaultSharedPreferences(this);
		String IP = sharedPrefs.getString("prefServerIP", "NULL");
		String port = sharedPrefs.getString("prefServerPort", "NULL");
		Log.v("sIP", "IP=" + IP);
		Log.v("sIP", "Port=" + port);
		try {
			Log.v("socket.io", "Trying to connect....");

			cltSoc = new ClientSocketIO(IP, port);
			cltSoc.sendMsg("pseudo", name);
			cltSoc.sendMsg("kart", color);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Show a bonus
	 * 
	 * @param nameBn
	 *            : the name of the bonus to show
	 */
	public void showBonus(String nameBn) {
		Log.v("bonus", "to show : " + nameBn);
		if (!nameBn.equals("")) {
			noBonus.setVisibility(View.INVISIBLE);
		}
		if (nameBn.equals("Rabbit")) {
			rabbit.setVisibility(View.VISIBLE);
		}
		if (nameBn.equals("Train")) {
			train.setVisibility(View.VISIBLE);
		}
		if (nameBn.equals("Nails")) {
			nails.setVisibility(View.VISIBLE);
		}
		if (nameBn.equals("BiggerEngine")) {
			engine.setVisibility(View.VISIBLE);
		}

		else {
			Log.v("error", "bonus unknown");
		}

	}

	/**
	 * Hide bonus
	 * 
	 * @param nameBn
	 *            : the name of the bonus to hide
	 */

	public void hideBonus(String nameBn) {
		Log.d("bonus", "to hide : " + nameBn);
		if (nameBn.equals("Rabbit")) {
			rabbit.setVisibility(View.INVISIBLE);
		}
		if (nameBn.equals("Train")) {
			train.setVisibility(View.INVISIBLE);
		}
		if (nameBn.equals("Nails")) {
			nails.setVisibility(View.INVISIBLE);
		}
		if (nameBn.equals("BiggerEngine")) {
			engine.setVisibility(View.INVISIBLE);
		}

		else {

			Log.d("error", "bonus unknown");
		}

	}
/**
 * Show the final rank of the kart
 * @param rank : final rank
 */
	public void showFinalrank(int rank) {
		Log.v("rank", "show final");
		String msg = "";
		//une boite de dialogue pour afficher le rang :
		AlertDialog.Builder builder1 = new AlertDialog.Builder(this);
		if (rank == 1)
			msg = " Great Job...";
		builder1.setMessage(msg + "Your final rank is " + rank );
		builder1.setCancelable(true);
		builder1.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int id) {
				dialog.cancel();
				exit();
			}
		});
		AlertDialog alert11 = builder1.create();
		alert11.show();
	}
	
	public void onStart() {
		super.onStart();
		if (wl != null) {
			wl.acquire();
		}
	}

	public void onDestroy() {

		super.onDestroy();
		if (wl != null) {
			wl.release();
		}

	}


}
