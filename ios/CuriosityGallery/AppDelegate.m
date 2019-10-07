/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "MainViewController.h"
#import "GalleryViewController.h"

@implementation AppDelegate {
  RCTBridge *_bridge;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  
  UIViewController *vc = [[MainViewController alloc] initWithBridge:_bridge];
  UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:vc];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.rootViewController = nav;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)present:(NSString *)screenName andProps:(NSDictionary *)props {
  if ([screenName isEqualToString:@"GalleryScreen"]) {
    UIViewController *vc = [[GalleryViewController alloc] initWithBridge:_bridge andProps:props];
    [(UINavigationController *)self.window.rootViewController pushViewController:vc animated:YES];
  }
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
