import * as vscode from 'vscode';
import * as path from 'path';
import { analyzeCode } from './commands/analyzeCode';
import { generateInlineCommands } from './commands/generateInlineCommands';
import { generateDockerFiles } from './commands/generateDockerFiles';
import { generateKubernetesFiles } from './commands/generateKubernetesFiles';
import { generateDockerComposeYaml } from './commands/generateDockerComposeYaml'

export function activate(context: vscode.ExtensionContext) {
    console.log('Backdoor extension is now active.');
    vscode.window.showInformationMessage('Important: Use CTRL + i for open extension UI.');
    //Get config values
    const config = vscode.workspace.getConfiguration('backdoor');
    const dockerComposeAutorun = config.get('dockerComposeAutorun');
    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('backdoor.analyzeCode', analyzeCode),
        vscode.commands.registerCommand('backdoor.generateInlineCommands', generateInlineCommands),
        vscode.commands.registerCommand('backdoor.generateDockerFiles', generateDockerFiles),
        vscode.commands.registerCommand('backdoor.backdoorDashboardInit', showBackdoorDashboard),
        vscode.commands.registerCommand('backdoor.generateKubernetesFiles', generateKubernetesFiles),
        vscode.commands.registerCommand('backdoor.generateDockerComposeYaml', async () => {
            if (typeof dockerComposeAutorun === 'boolean') {
                await generateDockerComposeYaml(dockerComposeAutorun);
            } else {
                vscode.window.showErrorMessage('Invalid value for dockerComposeAutorun.');
            }
        })
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
            <h1>Backdoor Code Reviewer</h1>
            </div>
            <p style="color:white;"> Backdoor is a free code reviewer assistant. It helps developers with AI support, increases code quality with highlighter and linter features.<p>
            <br>
            <hr>
            <h2>How to Generate docker-compose.yaml File</h2>
            <p style="color:white;"> If autorun enabled, make sure <stron>docker compose</strong> setup correctly. <p>
            <p style="color:white;"> Type CTRL + SHIFT + P and select <strong>Backdoor Docker Compose: Generate Docker Compose YAML</strong>. Provide how many services do you have. <p>
            <p style="color:white;"> Type your service name and port. After that step specify your environment variables. <p>
            <p style="color:white;"> Apply this steps for each service. <p>
            <p style="color:white;"> Your <strong>docker-compose.yaml</strong> will be created. Happy coding !!! <p>

            <hr>

            <h2>How to Generate Docker Files</h2>
            <p style="color:white;"> Type CTRL + SHIFT + P and select <strong>Backdoor Docker: Generate Docker files</strong>. Provide information about root of your project. <p>
            <p style="color:white;"> Type your application names which exist on your root.  <p>
            <p style="color:white;"> Your <strong>Dockerfiles</strong> will be created and we create a bash script for you. Happy building !!! <p>

            <hr>

            <h2>How to Generate Kubernetes Files</h2>
            <p style="color:white;"> Type CTRL + SHIFT + P and select <strong>Backdoor Kubernetes: Generate K8S files</strong>.  <p>
            <p style="color:white;"> Provide information about your services.  <p>
            <p style="color:white;"> Your <strong>k8s yaml</strong> and <strong>folder structure</strong> will be created. Happy deployment !!! <p>
            <script src="${webview.asWebviewUri(vscode.Uri.file(__dirname + '/script.js'))}"></script>
        </body>
        </html>
    `;
}

export function deactivate() {
    console.log('Backdoor Code Reviewer extension is now deactivated.');
}
