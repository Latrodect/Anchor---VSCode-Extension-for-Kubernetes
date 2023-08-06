import * as vscode from 'vscode';
import * as path from 'path';
import { analyzeCode } from './commands/analyzeCode';
import { generateInlineCommands } from './commands/generateInlineCommands';
import { generateDockerFiles } from './commands/generateDockerFiles';
import { generateKubernetesFiles } from './commands/generateKubernetesFiles';

export function activate(context: vscode.ExtensionContext) {
    console.log('Backdoor extension is now active.');
    vscode.window.showInformationMessage('Important: Use CTRL + i for open extension UI.');
    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('backdoor.analyzeCode', analyzeCode),
        vscode.commands.registerCommand('backdoor.generateInlineCommands', generateInlineCommands),
        vscode.commands.registerCommand('backdoor.generateDockerFiles', generateDockerFiles),
        vscode.commands.registerCommand('backdoor.backdoorDashboardInit', showBackdoorDashboard),
        vscode.commands.registerCommand('backdoor.generateKubernetesFiles', generateKubernetesFiles)
    );
}

async function showBackdoorDashboard() {
    const panel = vscode.window.createWebviewPanel(
        'backdoorUI',
        'Backdoor UI',
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = getWebviewContent(panel.webview);

}

function getWebviewContent(webview: vscode.Webview): string {
    const buttonStyle = 'padding: 6px 12px; font-size: 16px; background-color:#313131; border-radius:7px; border:1px solid white; color:white; margin: 10px;';
    const extensionPath = vscode.extensions.getExtension('Latrodect.backdoor')?.extensionPath || '';
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline' 'unsafe-eval';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Backdoor Code Reviewer</title>
        </head>
        <body>
            <div style="display:flex;">
            <img src="${webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'images', 'backdoor.png')))}" />
            <h1>Backdoor Code Reviewer</h1>
            </div>
            <p>${webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'images', 'backdoor.png')))}</p>
            <p style="color:white;"> Backdoor is a free code reviewer assistant. It helps developers with AI support, increases code quality with highlighter and linter features.<p>
            <br>
            <hr>
            <h2>Generate Kubernetes Deployment Files</h2>
            <p style="color:white;"> Type CTRL + l for generate kubernetes deployment files. When you type this command input box will open. <br>Type your apps like backend, frontned with comma seperation. Enjoy.<p>
            <button id="analyzeButton" style="${buttonStyle}">Enable Code Analysis</button>
            <button id="analyzeButton" style="${buttonStyle}">Enable AI Support</button>
            <button id="analyzeButton" style="${buttonStyle}">Enable Highlighter</button>
            <script src="${webview.asWebviewUri(vscode.Uri.file(__dirname + '/script.js'))}"></script>
        </body>
        </html>
    `;
}

export function deactivate() {
    console.log('Backdoor Code Reviewer extension is now deactivated.');
}
