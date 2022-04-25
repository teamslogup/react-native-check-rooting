const tasks = {
  wipeiOSBuildFolder: {
    name: "wipe iOS build artifacts",
    command:
      'rm -rf ios/build && (killall Xcode || true) && xcrun -k && cd ios && xcodebuild -alltargets clean && cd .. && rm -rf "$(getconf DARWIN_USER_CACHE_DIR)/org.llvm.clang/ModuleCache" && rm -rf "$(getconf DARWIN_USER_CACHE_DIR)/org.llvm.clang.$(whoami)/ModuleCache" && rm -fr ~/Library/Developer/Xcode/DerivedData/ && rm -fr ~/Library/Caches/com.apple.dt.Xcode/',
    args: [],
  },
  wipeiOSPodFileLock: {
    name: "wipe Podfile.lock",
    command: "rm",
    args: ["-rf", "ios/Podfile.lock"],
  },
  wipeiOSPodsFolder: {
    name: "wipe iOS Pods folder",
    command: "rm",
    args: ["-rf", "ios/Pods"],
  },
  wipeSystemiOSPodsCache: {
    name: "wipe system iOS Pods cache",
    command: "cd ios & pod",
    args: ["cache", "clean", "--all"],
  },
  wipeUseriOSPodsCache: {
    name: "wipe user iOS Pods cache",
    command: "rm",
    args: ["-rf", "~/.cocoapods"],
  },
  cleanAndroidProject: {
    name: "clean android project",
    command: "cd android && ./gradlew clean",
    args: [],
  },
  watchmanCacheClear: {
    name: "watchman cache clear (if watchman is installed)",
    command: "watchman watch-del-all || true",
    args: [],
  },
  wipeTempCaches: {
    name: "wipe temporary caches",
    command: "rm",
    args: ["-rf", "$TMPDIR/react-*", "$TMPDIR/metro-*"],
  },
  wipeNodeModules: {
    name: "wipe node_modules",
    command: "rm",
    args: ["-rf", "node_modules"],
  },
  wipeHasteMap: {
    name: "wipe haste-map-react-native-packager",
    command: "rm",
    args: ["-rf", "$TMPDIR/haste-map-react-native-packager-*"],
  },
  wipeJest: {
    name: "wipe jest",
    command: "rm",
    args: ["-rf", "jest --clearCache"],
  },
  wipeYarnLock: {
    name: "wipe yarn.lock",
    command: "rm",
    args: ["-rf", "yarn.lock"],
  },
  yarnCacheClean: {
    name: "yarn cache clean",
    command: "yarn cache clean",
    args: [],
  },
  installYarn: {
    name: "yarn install",
    command: "yarn install",
    args: [],
  },
};

const autoTasks = [
  tasks.wipeiOSBuildFolder,
  tasks.wipeiOSPodFileLock,
  tasks.wipeiOSPodsFolder,
  tasks.wipeSystemiOSPodsCache,
  tasks.wipeUseriOSPodsCache,
  tasks.watchmanCacheClear,
  tasks.wipeTempCaches,
  tasks.wipeNodeModules,
  tasks.wipeHasteMap,
  tasks.wipeJest,
  tasks.wipeYarnLock,
  tasks.yarnCacheClean,
  tasks.installYarn,
  tasks.cleanAndroidProject,
];

const { spawn } = require("child_process");

function elapsedTime(startTime) {
  const precision = 0;
  const elapsed = process.hrtime(startTime)[1] / 1000000;
  const secondCount = process.hrtime(startTime)[0];
  const millisecondCount = elapsed.toFixed(precision);

  if (secondCount > 0) return `${secondCount}s`;
  return `${millisecondCount}ms`;
}

async function executeTask(task) {
  const startTime = process.hrtime();
  const spawnedTask = await spawn(task.command, task.args, { shell: true });

  let data = "";
  console.log(`\nℹ️  STARTED: "${task.name}"`);
  for await (const chunk of spawnedTask.stdout) {
    data += chunk;
  }

  let error = "";
  for await (const chunk of spawnedTask.stderr) {
    error += chunk;
  }

  const exitCode = await new Promise((resolve) => {
    spawnedTask.on("close", resolve);
  });

  if (exitCode) {
    throw new Error(
      `\n\nTask "${task.name}" \nError: ${error}. \nExit code: ${exitCode}\n\n`
    );
  }

  console.log(
    `✅ FINISHED: "${task.name}" task has finished running in ${elapsedTime(
      startTime
    )}.`
  );
  return data;
}

const { createInterface } = require("readline");

const rlInterface = createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  console.log("");
  console.log("Executing fully-automated project clean.");
  console.log("");

  rlInterface.close(); // if we don't do this it hangs waiting for input

  async function executeTasks() {
    for (const task of autoTasks) {
      await executeTask(task);
    }
  }

  await executeTasks();

  console.log("");
  console.log(
    "Project cleaned. Use yarn or npm, pod, etc to re-install packages."
  );
  console.log(
    "You may also want to clean the metro bundler cache. It can only be cleaned on metro startup, like this:"
  );
  console.log("react-native start --reset-cache");
  console.log("");
})();
