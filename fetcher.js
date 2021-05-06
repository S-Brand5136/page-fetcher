const userInput = process.argv.slice(2);

const fs = require("fs");
const request = require("request");
const readline = require("readline");
const path = `./data/${userInput[1]}`;

if (userInput.length === 2) {
  request(userInput[0], (error, response, body) => {
    if (response.statusCode !== 200) {
      return errorLog(response.statusCode + " Try again");
    }
    fs.access(path, fs.F_OK, (err) => {
      if (err) {
        writeFile(body);
      } else {
        askPermission(body);
      }
    });
    if (error) {
      return errorLog(`${error} \n Could not retrieve Data`);
    }
  });
}

const askPermission = (body) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Do you want to overRide the file? ", (answer) => {
    if (answer === "y") {
      writeFile(body);
    } else if (answer === "n") {
      process.exit();
    } else {
      rl.close();
    }
  });
};

const writeFile = (body) => {
  fs.writeFile(path, body, (err) => {
    if (err) {
      errorLog("File path is invalid!" + err);
    }
    fs.stat(path, (err, stats) => {
      console.log(
        `Downloaded and saved ${stats.blksize} bytes to ${userInput[1]}`
      );
      process.exit();
    });
  });
};

const errorLog = (string) => {
  console.log(string);
  process.exit();
};
