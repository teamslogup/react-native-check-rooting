#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CheckRooting, NSObject)

RCT_EXTERN_METHOD(isDeviceRooted:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
