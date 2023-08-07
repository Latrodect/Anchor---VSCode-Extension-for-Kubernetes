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
exports.generateDockerComposeYaml = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function generateDockerComposeYaml(autorunBool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage('No workspace is open.');
            return;
        }
        const inputServiceCount = yield vscode.window.showInputBox({
            prompt: 'How many service do you want to use:',
            placeHolder: 'Example Usage: 6',
        });
        if (!inputServiceCount || inputServiceCount.trim() === "") {
            vscode.window.showErrorMessage('Please provide how many service do you have.');
            return;
        }
        const serviceCount = parseInt(inputServiceCount, 10);
        if (Number.isNaN(serviceCount) || serviceCount <= 0) {
            vscode.window.showErrorMessage('Please provide a valid positive number of services.');
            return;
        }
        if (serviceCount >= 150) {
            vscode.window.showWarningMessage('Too many services. Extension can be crash and generating your files takes too much time!');
        }
        let serviceList = [];
        let envList = [];
        for (let index = 0; index < serviceCount; index++) {
            const serviceInformation = yield vscode.window.showInputBox({
                prompt: 'Service Information:',
                placeHolder: 'Example Usage: frontend(Service Name), 8000(Service Port)',
            });
            if (!serviceInformation || inputServiceCount.trim() === "") {
                vscode.window.showErrorMessage('Please provide your service information.');
                return;
            }
            const service = checkSpacesAndReplace(serviceInformation.split(',').map(name => name.trim()));
            if (service.length !== 2) {
                vscode.window.showErrorMessage('Please provide service information in the correct format: "Service Name, Service Port".');
                return;
            }
            let environmentVariables = yield vscode.window.showInputBox({
                prompt: 'Specify Environment Variables:',
                placeHolder: 'Example Usage: mongo_host: 127.0.0.1, mongo_port: 4000, ...',
            });
            if (!environmentVariables || environmentVariables.trim() === "") {
                vscode.window.showInformationMessage('Default item setted to environment variables.');
                environmentVariables = "env_var=default";
            }
            const environmentVars = checkSpacesAndReplace(environmentVariables.split(',').map(name => name.trim()));
            const formattedEnvironmentVar = createEnvironmentVariables(environmentVars);
            serviceList.push(service);
            envList.push(formattedEnvironmentVar);
        }
        const dockerComposeFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'docker_compose');
        fs.mkdirSync(dockerComposeFolder.fsPath, { recursive: true });
        const dockerComposeData = {
            version: '3',
            services: {}
        };
        for (let index = 0; index < serviceList.length; index++) {
            const [serviceName, port] = serviceList[index];
            const environmentEntries = envList[index];
            const formattedEnvironmentStrings = environmentEntries.map(entry => `${entry}`).join('\n      ');
            dockerComposeData.services[serviceName] = {
                build: {
                    context: `./path/to/${serviceName}`,
                    dockerfile: 'Dockerfile'
                },
                ports: [`${port}:${port}`],
                volumes: [`./path/to/${serviceName}:/app/src/${serviceName}`],
                environment: [
                    formattedEnvironmentStrings
                ]
            };
        }
        const yamlContent = `
version: '${dockerComposeData.version}'
services:
${Object.entries(dockerComposeData.services)
            .map(([serviceName, serviceData]) => `  
  ${serviceName}:
    build:
      context: ${serviceData.build.context}
      dockerfile: ${serviceData.build.dockerfile}
    ports:
      - "${serviceData.ports[0]}"
    volumes:
      - "${serviceData.volumes[0]}"
    environment:
      ${serviceData.environment[0]}`)
            .join('\n')}`;
        const dockerComposeYamlPath = path.join(dockerComposeFolder.fsPath, 'docker-compose.yaml');
        yield writeFileWithDirectoryCheck(dockerComposeYamlPath, yamlContent);
        const config = vscode.workspace.getConfiguration('backdoor');
        const dockerComposeAutorun = config.get('dockerComposeAutorun');
        if (dockerComposeAutorun === true) {
            console.log('Running Docker Compose...');
            const workspaceDir = dockerComposeFolder.fsPath;
            const terminal = vscode.window.createTerminal({
                name: 'Cmd in Workspace',
                cwd: workspaceDir,
            });
            terminal.sendText('docker compose up docker-compose.yaml');
            terminal.show();
        }
    });
}
exports.generateDockerComposeYaml = generateDockerComposeYaml;
function writeFileWithDirectoryCheck(filePath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path.dirname(filePath);
        yield fs.promises.mkdir(folderPath, { recursive: true });
        yield fs.promises.writeFile(filePath, content);
    });
}
function createEnvironmentVariables(environmentVars) {
    return environmentVars.map(varName => `- ${varName}=${process.env[varName] || 'default'}`);
}
function checkSpacesAndReplace(variableList) {
    return variableList.map((item) => item.replace(/ +/g, '_'));
}
module.exports = {
    generateDockerComposeYaml
};
//# sourceMappingURL=generateDockerComposeYaml.js.map