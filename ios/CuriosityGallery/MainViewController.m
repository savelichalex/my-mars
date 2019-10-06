//
//  MainViewController.m
//  CuriosityGallery
//
//  Created by Алексей Савельев on 06/10/2019.
//

#import "MainViewController.h"
#import <React/RCTSurfaceHostingView.h>
#import <React/RCTSurfaceSizeMeasureMode.h>
#import <React/RCTSurface.h>

@interface MainViewController ()

@end

@implementation MainViewController {
  RCTBridge *_bridge;
  UIView *containerWrapper;
  UIView *container;
  BOOL isCreatedSurface;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
  self = [super init];
  if (self) {
    _bridge = bridge;
    isCreatedSurface = NO;
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.navigationController.navigationBarHidden = YES;
  self.view.backgroundColor = [UIColor whiteColor];
  
  // Need to have a wrapper to implement bottom margin with safe area
  containerWrapper = [[UIView alloc] init];
  containerWrapper.translatesAutoresizingMaskIntoConstraints = NO;
  
  container = [[UIView alloc] init];
  container.translatesAutoresizingMaskIntoConstraints = NO;
  
  [self.view addSubview:containerWrapper];
  
  if (@available(iOS 11.0, *)) {
    [containerWrapper.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor].active = YES;
    [containerWrapper.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor constant:-17].active = YES;
    [containerWrapper.leadingAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.leadingAnchor].active = YES;
    [containerWrapper.trailingAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.trailingAnchor].active = YES;
  } else {
    [containerWrapper.topAnchor constraintEqualToAnchor:self.topLayoutGuide.bottomAnchor].active = YES;
    [containerWrapper.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor].active = YES;
    [containerWrapper.leadingAnchor constraintEqualToAnchor:self.view.layoutMarginsGuide.leadingAnchor].active = YES;
    [containerWrapper.trailingAnchor constraintEqualToAnchor:self.view.layoutMarginsGuide.trailingAnchor].active = YES;
  }
  
  [containerWrapper addSubview:container];
  
  [container.topAnchor constraintEqualToAnchor:containerWrapper.topAnchor].active = YES;
  if (@available(iOS 11.0, *)) {
    [container.bottomAnchor constraintEqualToAnchor:containerWrapper.safeAreaLayoutGuide.bottomAnchor].active = YES;
  } else {
    [container.bottomAnchor constraintEqualToAnchor:containerWrapper.bottomAnchor].active = YES;
  }
  [container.leadingAnchor constraintEqualToAnchor:containerWrapper.leadingAnchor].active = YES;
  [container.trailingAnchor constraintEqualToAnchor:containerWrapper.trailingAnchor].active = YES;
  
  [container setNeedsLayout];
  [container layoutIfNeeded];
}

- (void)viewDidLayoutSubviews {
  if (!isCreatedSurface) {
    RCTSurfaceHostingView *surfaceView = [[RCTSurfaceHostingView alloc] initWithBridge:_bridge moduleName:@"MainScreen" initialProperties:@{} sizeMeasureMode:RCTSurfaceSizeMeasureModeWidthExact | RCTSurfaceSizeMeasureModeHeightExact];
    
    CGSize minimumSize = (CGSize){0, 0};
    CGFloat height;
    if (@available(iOS 11.0, *)) {
      height = containerWrapper.frame.size.height - containerWrapper.safeAreaInsets.bottom;
    } else {
      height = containerWrapper.frame.size.height;
    }
    CGSize maximumSize = (CGSize){container.frame.size.width, height};
    [surfaceView.surface setMinimumSize:minimumSize maximumSize:maximumSize];
    
    surfaceView.translatesAutoresizingMaskIntoConstraints = NO;
    
    [container addSubview:surfaceView];
    
    isCreatedSurface = YES;
  }
}

@end
