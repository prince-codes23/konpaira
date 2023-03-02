const fs = require("fs");
const childProcess = require("child_process");
const compile = require("./compilationlog.json")
JSON.stringify(compile);
const { randomUUID } = require("crypto");
const dataBase = require("./database.js");

// Created Directory and File
const dir = __dirname + "/Contests";
let filename = randomUUID();
let file = dir + "/Contests/" + filename + ".";

//For creating The file 
const createFile = async (sourceCode, language, inputFile, userID, callerID) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  };
  filename = Date.now();
  file = dir + "/" + filename + ".";
  if (callerID === "1")
    dataBase.insert(filename, language, userID, sourceCode);
  fs.writeFileSync(file + language, sourceCode)
  fs.writeFileSync(file + "in", inputFile)
};

// To execute the File
const execute = async (language, callerID) => {
  let commandLast = ".command";
  let commandVal = "compile.languages." + language + commandLast;
  let val = eval(commandVal);
  return new Promise((resolve, reject) => {
    childProcess.exec(eval(val)
      , (error, stdout, stderr) => {
        if (error) {
          if (callerID === "1")
            dataBase.update(filename, "0");  // Update databse with status = Compilation error
          else reject(error);
        }
        else if (stderr != "") {
          if (callerID === "1")
            dataBase.update(filename, "1");  // Update databse with status = Runtime error
          else reject(stderr);
        } else {
          if (callerID === "1") {
            dataBase.update(filename, "2");
          }
          else { resolve(stdout); }
        }
      });
  });
};

//Exporting the modules which we created
module.exports = {
  execute, createFile
}
