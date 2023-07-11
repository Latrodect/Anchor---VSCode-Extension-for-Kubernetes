const vscode = require("vscode");

function activate(context) {
  // Create a webview panel
  const panel = vscode.window.createWebviewPanel(
    "myExtension",
    "My Extension",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );
  let disposable = vscode.commands.registerCommand(
    "help.helloWorld",
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from Anchor!");
    }
  );
  // Load the HTML content into the webview
  panel.webview.html = getWebviewContent();

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage((message) => {
    if (message.command === "buttonClicked") {
      vscode.window.showInformationMessage("Button clicked!");
    }
  });
}

function getWebviewContent() {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font-family: Arial, sans-serif;
      }

      h1 {
        color: #333;
      }

      button {
        padding: 10px 20px;
        background-color: #007ACC;
        color: #FFF;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      #message {
        margin-top: 20px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>Anchor K8S</h1>
	<p>This a basics of extension.</p>
    <button id="btnClick">Click me</button>
    <p id="message"></p>
	<h4>Helm Chart List</h4>
	<input style="width:350px; height:100px;" placeholder="Give a list of helm charts you want to use."></input>
    <script>
      const vscode = acquireVsCodeApi();

      // Handle button click event
      document.getElementById("btnClick").addEventListener("click", function() {
        var messageElement = document.getElementById("message");
        messageElement.textContent = "Button clicked!";
        
        // Send a message to the extension code
        vscode.postMessage({ command: 'buttonClicked' });
      });
    </script>
  </body>
  </html>`;
}

module.exports = {
  activate,
};
