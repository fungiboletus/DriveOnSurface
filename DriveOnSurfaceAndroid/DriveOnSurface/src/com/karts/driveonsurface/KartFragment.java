package com.karts.driveonsurface;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;

import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.support.v4.view.ViewPager.OnPageChangeListener;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.view.ViewGroup;
/**
 * KartFragment : This activity allow the player to choose (the color of) his kart 
 * 
 * Last update : 15/02/2013 
 * @author : Sabrine Rouis - SI5 IHM 
 *
 */
public class KartFragment extends Activity {
   //kart selectionnée
	public static int selectedCharacter = 0;
	//couleur selectionnée
	public static String selectedColor = "";
	//tableau de karts
	public static int[] karts;
	private ViewPager viewPager;
	String pseudo;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// If the Play activity is shut down (exit clicked): finish this activity too
		boolean finish = getIntent().getBooleanExtra("finish", false);
		if (finish) {
			finish();
		}

		setContentView(R.layout.kart_layout);
		viewPager = (ViewPager) findViewById(R.id.pager);


		// List des karts à choisir : 3 types (couleurs) de karts
		karts = new int[12];
		karts[0] = R.drawable.kart01;
		karts[1] = R.drawable.kart02;
		karts[2] = R.drawable.kart03;

		viewPager.setAdapter(new KartPagerAdapter(karts));
		viewPager.setCurrentItem(selectedCharacter);
		viewPager.setOnPageChangeListener(new OnPageChangeListener() {

			@Override
			public void onPageSelected(int position) {
				selectedCharacter = position;
				Log.d("selected", selectedCharacter + " : selected");
			}

			@Override
			public void onPageScrolled(int arg0, float arg1, int arg2) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onPageScrollStateChanged(int arg0) {
				// TODO Auto-generated method stub

			}
		});

		class TapGestureListener extends
				GestureDetector.SimpleOnGestureListener {

			@Override
			public boolean onSingleTapConfirmed(MotionEvent e) {

				String color = getSelectedColor(selectedCharacter);
				//intent pour la couleur du kart : à envoyer vers l'activitié suivante
				Intent intent = new Intent(KartFragment.this,
						PlayActivity.class);

				intent.putExtra("color", color);
				KartFragment.this.startActivity(intent);
				return true;

			}
		}
		final GestureDetector tapGestureDetector = new GestureDetector(this,
				new TapGestureListener());

		viewPager.setOnTouchListener(new OnTouchListener() {
			@Override
			public boolean onTouch(View v, MotionEvent event) {
				tapGestureDetector.onTouchEvent(event);
				return false;
			}

		});

	}
/**
 * Determiner la couleur choisie par le joueur
 * @param position  
 * @return string : the selected color
 */
	public String getSelectedColor(int position) {
		String color = "";
		switch (position) {
		case 0:
			color = "Yellow";
			break;
		case 1:
			color = "Red";
			break;
		case 2:
			color = "Blue";
			break;
		default:

		}
		return color;
	}

}
