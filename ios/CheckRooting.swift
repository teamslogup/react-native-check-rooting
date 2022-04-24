import UIKit
@objc(CheckRooting)
class CheckRooting: NSObject {
    
    @objc(isDeviceRooted:withRejecter:)
    func isDeviceRooted(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let isRooted = try isJailbroken()
            resolve(isRooted)
        } catch {
            reject("error", "error trying to detect jailbreaking", error)
        }
    }

    private func isJailbroken() throws -> Bool {
        #if !TARGET_IPHONE_SIMULATOR
            if let url = URL(string: "cydia://package/com.example.package") {
                if FileManager.default.fileExists(atPath: "/Applications/Cydia.app") ||
                    FileManager.default.fileExists(atPath: "/Library/MobileSubstrate/MobileSubstrate.dylib") ||
                    FileManager.default.fileExists(atPath: "/bin/bash") ||
                    FileManager.default.fileExists(atPath: "/usr/sbin/sshd") ||
                    FileManager.default.fileExists(atPath: "/etc/apt") ||
                    FileManager.default.fileExists(atPath: "/private/var/lib/apt/") ||
                    UIApplication.shared.canOpenURL(url)
                {
                    return true
                }
            }

            if let file = fopen("/bin/bash", "r") {
                fclose(file)
                return true
            }
            if let file = fopen("/Applications/Cydia.app", "r") {
                fclose(file)
                return true
            }
            if let file = fopen("/Library/MobileSubstrate/MobileSubstrate.dylib", "r") {
                fclose(file)
                return true
            }
            if let file = fopen("/usr/sbin/sshd", "r") {
                fclose(file)
                return true
            }
            if let file = fopen("/etc/apt", "r") {
                fclose(file)
                return true
            }

            do {
                try "This is a test.".write(toFile: "/private/jailbreak.txt", atomically: true, encoding: .utf8)
                try FileManager.default.removeItem(atPath: "/private/jailbreak.txt")
            } catch {
                return true
            }

        #endif
        return false
    }
}
