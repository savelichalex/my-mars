//
//  GalleryViewController.h
//  CuriosityGallery
//
//  Created by Алексей Савельев on 07/10/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>

NS_ASSUME_NONNULL_BEGIN

@interface GalleryViewController : UIViewController

- (instancetype)initWithBridge:(RCTBridge *)bridge andProps:(NSDictionary *)props;

@end

NS_ASSUME_NONNULL_END
