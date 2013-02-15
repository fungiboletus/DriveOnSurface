package com.karts.driveonsurface;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.ImageView;
/**
 * KartPagerAdapter
 * @author Sabrine Rouis
 *
 */
public class KartPagerAdapter  extends android.support.v4.view.PagerAdapter {

	private int[] karts;
	
	public KartPagerAdapter(int[] persos) {
		this.karts = persos;
	}

	public Object instantiateItem(View collection, int position) {
		ImageView iv = new ImageView(collection.getContext());
		iv.setImageResource(karts[position]);
		((ViewPager) collection).addView(iv, 0);
		return iv;
	}
	
	@Override
	public void destroyItem(View collection, int position, Object view) {
		((ViewPager) collection).removeView((ImageView) view);
	}

	@Override
	public int getCount() {
		return karts.length;
	}

	@Override
	public boolean isViewFromObject(View view, Object object) {
		return view == object;
	}
	
}
