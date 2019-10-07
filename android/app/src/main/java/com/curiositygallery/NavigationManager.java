package com.curiositygallery;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class NavigationManager extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    @NonNull
    @Override
    public String getName() {
        return "NavigationManager";
    }

    NavigationManager(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @ReactMethod
    public void present(String screen, ReadableMap props) {
        if (screen.equals("GalleryScreen")) {
            Intent intent = new Intent(reactContext.getCurrentActivity(), GalleryActivity.class);
            intent.putExtras(Arguments.toBundle(props));
            reactContext.getCurrentActivity().startActivity(intent);
        }
    }
}
