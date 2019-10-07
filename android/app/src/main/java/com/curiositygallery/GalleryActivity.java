package com.curiositygallery;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.util.ArrayList;

public class GalleryActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return true;
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "GalleryScreen";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new GalleryActivityDelegate(GalleryActivity.this, getMainComponentName());
    }

    public static class GalleryActivityDelegate extends ReactActivityDelegate {
        private Bundle mInitialProps = null;
        private final @Nullable
        ReactActivity mActivity;

        public GalleryActivityDelegate(ReactActivity activity, String mainComponentName) {
            super(activity, mainComponentName);
            this.mActivity = activity;
        }

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            Bundle props = mActivity.getIntent().getExtras();

            if (props == null) {
                props = new Bundle();
                props.putSerializable("photos", new ArrayList());
            }

            mInitialProps = props;

            super.onCreate(savedInstanceState);
        }

        @Override
        protected ReactRootView createRootView() {
            return new RNGestureHandlerEnabledRootView(mActivity);
        }

        @Nullable
        @Override
        protected Bundle getLaunchOptions() {
            return mInitialProps;
        }
    }
}
