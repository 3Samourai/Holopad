const {
  app,
  BrowserWindow,
  ipcMain, Menu, dialog
} = require("electron");
const path = require("path");
const fs = require("fs");
var pathE = require('path')

var win;

async function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#2e2c29',
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    }
  });

  // Load app
  var template = [
      {label: 'App', submenu: [
        {role: 'about'},
        {type: 'separator'},
        {label: 'Quit', click: function() {app.quit();}}
      ]},
      {label: 'File', submenu: [
        {label: 'New', click:  function() {New();}, accelerator: 'CommandOrControl+N'},
        {label: 'Open', click: function() {Open();}, accelerator: 'CommandOrControl+O'},
        {label: 'Save', click: function() {toSave();}, accelerator: 'CommandOrControl+S'},
        {label: 'Save As', click: console.log("view")},
        {label: 'Close', click: console.log("view")}
        ]},
        {label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]}
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
      win.loadFile(path.join(__dirname, "index.html"));
//win.webContents.openDevTools()
win.webContents.on('did-finish-load', function() {
   console.log("loaded");
});
}

app.setAboutPanelOptions({
    applicationName: "Holopad", 
    applicationVersion: "0.1 Beta",
    credits: "3Samourai",
    copyright: "GPLv3"
  });
app.on("ready", createWindow);
var pathFile;

function New() {
	createWindow()
}
function toSave()
{
	const promise1 = new Promise((resolve, reject) => {
		let pathFile2 = dialog.showSaveDialog();
  resolve(pathFile2);
});
promise1.then((value) => {
	console.log(value);
	if (value.canceled == true) {
		console.log("cancel");
		}
		else{
  console.log(value.filePath);
   win.webContents.send("toSave", value.filePath);
   }
});
}
function Open(){
	const promise1 = new Promise((resolve, reject) => {
		let pathFile2 = dialog.showOpenDialog({properties: ['openFile']});
  resolve(pathFile2);
});
	promise1.then((value) => {
	if (value.canceled == true) {
		console.log("cancel");
		}
		else{
  fs.readFile(value.filePaths[0], 'utf8', function (err, data) {
  if (err) {
  return console.log(err);
  }
  console.log(data);
  let ext = path.extname(value.filePaths[0])
  console.log(ext);
  let fullData = {
	extension: ext,
		 code: data
	 };
  win.webContents.send("toOpen", fullData);

  });
    }
});
}
	
ipcMain.on("SaveCode", (event, args) => {
	console.log(args);
	let name = args.name;
	let code = args.code;
	console.log(name);
  fs.writeFile(name, code, 'utf8', function (err) {
  if (err) 
  return console.log(err);
  });
});
