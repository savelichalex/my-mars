//
//  GalleryViewController.m
//  CuriosityGallery
//
//  Created by Алексей Савельев on 07/10/2019.
//

#import "GalleryViewController.h"
#import <React/RCTSurfaceHostingView.h>
#import <React/RCTSurfaceSizeMeasureMode.h>
#import <React/RCTSurface.h>

@interface GalleryViewController ()

@end

@implementation GalleryViewController {
  RCTBridge *_bridge;
  NSDictionary *_props;
  UIView *container;
  BOOL isCreatedSurface;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge andProps:(NSDictionary *)props {
  self = [super init];
  if (self) {
    _bridge = bridge;
    _props = props;
    isCreatedSurface = NO;
  }
  return self;
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
  self.navigationItem.title = @"Favorite";
  [self.navigationController setNavigationBarHidden:NO animated:YES];
  self.navigationController.navigationBar.tintColor = [UIColor colorWithRed:0.92 green:0.34 blue:0.34 alpha:1.0];
}

- (void)viewWillDisappear:(BOOL)animated {
  [super viewWillDisappear:animated];
  [self.navigationController setNavigationBarHidden:YES animated:YES];
}

- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view.
  
  self.view.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  container = [[UIView alloc] init];
  container.translatesAutoresizingMaskIntoConstraints = NO;
  
  [self.view addSubview:container];
  
  if (@available(iOS 11.0, *)) {
    [container.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor].active = YES;
    [container.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor].active = YES;
    [container.leadingAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.leadingAnchor].active = YES;
    [container.trailingAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.trailingAnchor].active = YES;
  } else {
    [container.topAnchor constraintEqualToAnchor:self.topLayoutGuide.bottomAnchor].active = YES;
    [container.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor].active = YES;
    [container.leadingAnchor constraintEqualToAnchor:self.view.layoutMarginsGuide.leadingAnchor].active = YES;
    [container.trailingAnchor constraintEqualToAnchor:self.view.layoutMarginsGuide.trailingAnchor].active = YES;
  }
}

- (void)viewDidLayoutSubviews {
  if (!isCreatedSurface) {
    RCTSurfaceHostingView *view = [[RCTSurfaceHostingView alloc] initWithBridge:_bridge moduleName:@"GalleryScreen" initialProperties:_props sizeMeasureMode:RCTSurfaceSizeMeasureModeWidthExact | RCTSurfaceSizeMeasureModeHeightExact];
    
    CGSize minimumSize = (CGSize){0, 0};
    CGSize maximumSize = (CGSize){container.frame.size.width, container.frame.size.height};
    [view.surface setMinimumSize:minimumSize maximumSize:maximumSize];
    
    view.translatesAutoresizingMaskIntoConstraints = NO;
    
    [container addSubview:view];
    isCreatedSurface = YES;
  }
}

@end
