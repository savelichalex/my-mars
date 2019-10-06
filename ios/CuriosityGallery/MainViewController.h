//
//  MainViewController.h
//  CuriosityGallery
//
//  Created by Алексей Савельев on 06/10/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>

NS_ASSUME_NONNULL_BEGIN

@interface MainViewController : UIViewController

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@end

NS_ASSUME_NONNULL_END
