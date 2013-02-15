package com.karts.driveonsurface;

import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import io.socket.*;


/**
 * ClientSocketIO : this is the client socket.io : used to send/receive events
 * from/to the server
 * This class is using the library io.socket 
 * 
 *  
 * Last update : 02/13/2013
 * @author Sabrine ROUIS - SI5 IHM
 * 
 */
public class ClientSocketIO {

	private SocketIO socket;// = new SocketIO("http://192.168.1.11:3333/");
	private int rank = 0;
	private String speed = "0";
	private String position = "0";
	private boolean finished = false;
	private int finalrank = 0;
	String enableBonus = "";
	String disableBonus = "";

	/**
	 * 
	 * @param IP
	 * @param port
	 * @throws Exception
	 */
	public ClientSocketIO(String IP, String port) throws Exception {

		// Server address :
		String sIP = "http://" + IP + ":" + port + "/";
		socket = new SocketIO(sIP);
		socket.connect(new IOCallback() {
			@Override
			public void onMessage(JSONObject json, IOAcknowledge ack) {
				try {
					Log.v("socket.io", "Server said:" + json.toString(2));
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}

			@Override
			public void onMessage(String data, IOAcknowledge ack) {
				Log.v("socket.io", "Server said: " + data);
			}

			@Override
			public void onError(SocketIOException socketIOException) {
				Log.e("socket.io", "an Error occured");
				socketIOException.printStackTrace();
			}

			@Override
			public void onDisconnect() {
				Log.v("socket.io", "Connection terminated.");
			}

			@Override
			public void onConnect() {
				Log.v("socket.io", "Connection established");
				Log.v("socket.io", "Connecteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed");

			}

			@Override
			public void on(String event, IOAcknowledge ack, Object... args) {
				Log.e("socket.io", "Server triggered event '" + event + "'"
						+ "with args " + args[0]);
				//receive the speed 
				if (event.equals("speed")) {
					setSpeed(args[0]);

				}
				//receive the rank
				if (event.equals("rank")) {
					setRank(args[0]);
				}
				//receive the position
				if (event.equals("position")) {
					Log.d("position", "got position : " + args[0]);
					position = args[0].toString();
				}
				//receive enabled bonus
				if (event.equals("enableBonus")) {

					setEnableBonus("" + args[0]);

				}
				//receive disabled bonus
				if (event.equals("disableBonus")) {

					setDisableBonus("" + args[0]);
				}
				//receive the final rank
				if (event.equals("rankEnd")) {
					finished = true;
					finalrank = (Integer) args[0];
				}
			}
		});

	}
/**
 * Send an event to the server
 * @param event : name of the event
 * @param msg   : the value of the event
 */
	public void sendMsg(String event, String msg) {
		// This line is cached until the connection is established.
		socket.emit(event, msg);	
		Log.e("socket.io", msg + " sent");

	}
/**
 * Getters and Setters of the class
 */
	public void setSpeed(Object arg) {
		speed = arg.toString();
	}

	public void setRank(Object arg) {
		rank = (Integer) arg;
	}

	public String getSpeed() {
		return speed;
	}

	public int getRank() {
		return rank;
	}

	public String getEnableBonus() {
		return enableBonus;

	}

	public String getDisableBonus() {

		return disableBonus;
	}

	public void setEnableBonus(String eb) {
		enableBonus = eb;
	}

	public void setDisableBonus(String db) {
		disableBonus = db;
	}
	public String getPosition(){
		return position;
	}
	public boolean isFinished(){
		return finished;
	}
	public int getFinalRank(){
		return finalrank;
	}
}
