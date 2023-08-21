"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const analyzeCode_1 = require("./commands/analyzeCode");
const generateInlineCommands_1 = require("./commands/generateInlineCommands");
const generateDockerFiles_1 = require("./commands/generateDockerFiles");
const generateKubernetesFiles_1 = require("./commands/generateKubernetesFiles");
const generateDockerComposeYaml_1 = require("./commands/generateDockerComposeYaml");
function activate(context) {
    console.log('Backdoor extension is now active.');
    vscode.window.showInformationMessage('Important: Use CTRL + i for open extension UI.');
    //Get config values
    const config = vscode.workspace.getConfiguration('compose-core');
    const dockerComposeAutorun = config.get('dockerComposeAutorun');
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('compose-core.analyzeCode', analyzeCode_1.analyzeCode), vscode.commands.registerCommand('compose-core.generateInlineCommands', generateInlineCommands_1.generateInlineCommands), vscode.commands.registerCommand('compose-core.generateDockerFiles', generateDockerFiles_1.generateDockerFiles), vscode.commands.registerCommand('compose-core.composeCoreDashboardInit', showBackdoorDashboard), vscode.commands.registerCommand('compose-core.generateKubernetesFiles', generateKubernetesFiles_1.generateKubernetesFiles), vscode.commands.registerCommand('compose-core.generateDockerComposeYaml', () => __awaiter(this, void 0, void 0, function* () {
        if (typeof dockerComposeAutorun === 'boolean') {
            yield (0, generateDockerComposeYaml_1.generateDockerComposeYaml)(dockerComposeAutorun);
        }
        else {
            vscode.window.showErrorMessage('Invalid value for dockerComposeAutorun.');
        }
    })));
}
exports.activate = activate;
function showBackdoorDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const panel = vscode.window.createWebviewPanel('backdoorUI', 'Backdoor UI', vscode.ViewColumn.One, {});
        panel.webview.html = getWebviewContent(panel.webview);
    });
}
function getWebviewContent(webview) {
    var _a;
    const buttonStyle = 'padding: 6px 12px; font-size: 16px; background-color:#313131; border-radius:7px; border:1px solid white; color:white; margin: 10px;';
    const extensionPath = ((_a = vscode.extensions.getExtension('Latrodect.compose-core')) === null || _a === void 0 ? void 0 : _a.extensionPath) || '';
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
function deactivate() {
    console.log('Backdoor Code Reviewer extension is now deactivated.');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map