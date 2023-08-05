import * as vscode from 'vscode';
import { analyzeCode } from './commands/analyzeCode';
import { generateInlineCommands } from './commands/generateInlineCommands';
import { reviewSuggestion } from './commands/reviewSuggestion';
import { generateKubernetesFiles } from './commands/generateKubernetesFiles';

export function activate(context: vscode.ExtensionContext) {
    console.log('Backdoor extension is now active.');
    vscode.window.showInformationMessage('Important: Use CTRL + i for open extension UI.');
    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('backdoor.analyzeCode', analyzeCode),
        vscode.commands.registerCommand('backdoor.generateInlineCommands', generateInlineCommands),
        vscode.commands.registerCommand('backdoor.reviewSuggestion', reviewSuggestion),
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

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage((message) => {
        switch (message.command) {
            case 'analyzeCode':
                analyzeCode();
                break;
            // Handle other commands here...
        }
    });
}

function getWebviewContent(webview: vscode.Webview): string {
    const buttonStyle = 'padding: 6px 12px; font-size: 16px; background-color:#313131; border-radius:7px; border:1px solid white; color:white; margin: 10px;';
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Backdoor Code Reviewer</title>
        </head>
        <body>
            <h1>Backdoor Code Reviewer</h1>
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
