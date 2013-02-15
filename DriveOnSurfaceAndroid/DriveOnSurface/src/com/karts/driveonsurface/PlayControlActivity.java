package com.karts.driveonsurface;

import java.util.Arrays;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.View;

/**
 * This activity is to control the kart manually with buttons This activity was
 * just for testing and it's not used on the application
 * 
 * Date : 15/02/2013
 * 
 * @author : Sabrine ROUIS - SI5 IHM
 */
public class PlayControlActivity extends Activity {

	// Tableau contenant la commande pour le microcontroleur
	static int[] cmds = new int[5];
	ClientSocketIO cltSoc;

	/**
	 * Appelé lors de la création de l'activité
	 */
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// On charge le layout associé à cette activité
		setContentView(R.layout.play_boutons_layout);

		// On initialise la commande
		/**
		 * cmds : tableau de commander pour controler la voiture cmds[0] : état
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
			String pseudo = (String) extras.get("pseudo");
			String color = (String) extras.get("color");
			// on se connecte au serveur :
			connectToServer(pseudo, color);
		}

	}

	// Gestion du clic sur les boutons
	public void OnclickHandler(View view) throws Exception {
		switch (view.getId()) {
		case R.id.buttonForward:

			cmds[0] = 1;
			cmds[1] = 0; // UP
			cmds[2] = 1;
			cmds[3] = 0;
			cmds[4] = 0;
			Log.d("command", "GO Forward");
			break;
		case R.id.buttonBackward:
			cmds[0] = 1;
			cmds[1] = 1;// DOWN
			cmds[2] = 1;
			cmds[3] = 0;
			cmds[4] = 0;
			Log.d("command", "GO Backward");
			break;
		case R.id.buttonLeft:

			cmds[1] = 0;
			cmds[2] = 0;
			cmds[3] = 0; // LEFT
			cmds[4] = cmds[4] + 1;
			Log.d("command", "GO Left");
			break;
		case R.id.buttonStop:

			cmds[0] = 0; // STOP
			cmds[1] = 0;
			cmds[2] = 0;
			cmds[3] = 0;
			cmds[4] = 0;
			Log.d("command", "STOP");
			break;
		case R.id.buttonRight:

			cmds[0] = 0;
			cmds[1] = 0;
			cmds[2] = 0;
			cmds[3] = 1; // RIGHT
			cmds[4] = cmds[4] + 1; // I'am going right
			Log.d("command", "GO Right");
			break;
		case R.id.buttonSpeedUp:

			cmds[2] = cmds[2] + 1;
			cmds[0] = 1;
			cmds[1] = 0;
			cmds[3] = 0;
			cmds[4] = 0;
			Log.d("command", "Speed Uuup");
			break;
		case R.id.buttonSpeedDown:

			cmds[0] = 1;
			cmds[1] = 0;
			cmds[2] = cmds[2] + 1;
			cmds[3] = 0;
			cmds[4] = 0;
			Log.d("command", "Speed doooown");
			break;

		}
		// send the event to the server
		try {

			cltSoc.sendMsg("commande", Arrays.toString(cmds));
			Log.d("command", Arrays.toString(cmds));

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * Connect the server with the name and the kart color
	 * 
	 * @param name
	 * @param color
	 */
	public void connectToServer(String name, String color) {
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

}
