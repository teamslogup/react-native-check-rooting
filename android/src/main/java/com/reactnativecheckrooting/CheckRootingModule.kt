package com.reactnativecheckrooting

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

class CheckRootingModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "CheckRooting"
  }

  @ReactMethod
  fun isDeviceRooted(promise: Promise) {
    try {
      val isRooted =
        checkRootMethod1() || checkRootMethod2() || checkRootMethod3() || canExecuteSu()
      promise.resolve(isRooted)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  private fun checkRootMethod1(): Boolean {
    val buildTags = Build.TAGS
    return buildTags != null && buildTags.contains("test-keys")
  }

  private fun checkRootMethod2(): Boolean {
    val paths = arrayOf(
      "/system/app/Superuser.apk",
      "/sbin/su",
      "/system/bin/su",
      "/system/xbin/su",
      "/data/local/xbin/su",
      "/data/local/bin/su",
      "/system/sd/xbin/su",
      "/system/bin/failsafe/su",
      "/data/local/su"
    )
    for (path in paths) {
      if (File(path).exists()) return true
    }
    return false
  }

  private fun checkRootMethod3(): Boolean {
    var process: Process? = null
    return try {
      process = Runtime.getRuntime().exec(arrayOf("/system/xbin/which", "su"))
      val `in` = BufferedReader(InputStreamReader(process.inputStream))
      `in`.readLine() != null
    } catch (t: Throwable) {
      false
    } finally {
      process?.destroy()
    }
  }

  private fun canExecuteSu() = try {
    Runtime.getRuntime().exec("su")
    true
  } catch (e: Exception) {
    false
  }
}
