// refered to
// https://github.com/shakacode/react_on_rails/blob/master/docs/additional-reading/node-server-rendering.md
import * as net from "net";
import * as fs  from "fs";

const bundlePath   = process.env["BUNDLE_PATH"] || "./node/";
let bundleFileName = process.env["BUNDLE_FILE_NAME"] || "registry.js";

let currentArg;

class Handler {
  private queue: Array<any>;
  private initialized: boolean;

  constructor() {
    this.queue = [];
    this.initialized = false;
  }

  handle(connection) {
    const callback = function () {
      connection.setEncoding("utf8");
      connection.on("data", data => {
        console.log("Processing request: " + data);
        const result = eval(data);
        connection.write(result);
      });
    };

    if (this.initialized) {
      callback();
    } else {
      this.queue.push(callback);
    }
  }

  initialize() {
    console.log("Processing " + this.queue.length + " pending requests");
    let callback;
    while (callback = this.queue.pop()) {
      callback();
    }
    this.initialized = true;
  }

  isInitialized() {
    return this.initialize;
  }
}

const handler = new Handler();

process.argv.forEach(val => {
  if (val[0] === "-") {
    currentArg = val.slice(1);
    return;
  }

  if (currentArg === "s") {
    bundleFileName = val;
  }
});

try {
  fs.mkdirSync(bundlePath);
} catch (e) {
  if (e.code !== "EEXIST") throw e;
}

fs.watchFile(bundlePath + bundleFileName, (curr) => {
  if (curr && curr.blocks && curr.blocks > 0) {
    if (handler.isInitialized()) {
      console.log("Reloading server bundle must be implemented by restarting the node process!");
      return;
    }

    require(bundlePath + bundleFileName);
    console.log("Loaded server bundle: " + bundlePath + bundleFileName);
    handler.initialize();
  }
});

const unixServer = net.createServer(function(connection) {
  handler.handle(connection);
});

process.on("SIGINT", () => {
  unixServer.close();
  process.exit();
});

require("../PerlReact");
handler.initialize();

export function start() { unixServer.listen("node.sock"); }
