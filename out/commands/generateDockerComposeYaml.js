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
function generateDockerComposeYaml() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage('No workspace is open.');
            return;
        }
        const inputServiceCount = yield vscode.window.showInputBox({
            prompt: 'How many service do you want to use:',
            placeHolder: '6',
        });
        if (!inputServiceCount || inputServiceCount === "0") {
            vscode.window.showErrorMessage('Please provide how much service do you have.');
            return;
        }
        const serviceCount = parseInt(inputServiceCount, 10);
        let serviceList = [];
        for (let index = 0; index < serviceCount; index++) {
            const serviceInformation = yield vscode.window.showInputBox({
                prompt: 'Service Information:',
                placeHolder: 'Example Usage: frontend, 8000, volume/path, NODE_ENV=development(environment example)',
            });
            if (!serviceInformation) {
                vscode.window.showErrorMessage('Please provide your service information.');
                return;
            }
            const service = serviceInformation.split(',').map(name => name.trim());
            if (service.length === 4) {
                serviceList.push(service);
            }
            else {
                vscode.window.showErrorMessage('Some information is missing');
            }
        }
        const dockerComposeFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'docker_compose');
        fs.mkdirSync(dockerComposeFolder.fsPath, { recursive: true });
        const dockerComposeData = {
            version: '3',
            services: {}
        };
        serviceList.forEach(([serviceName, port]) => {
            dockerComposeData.services[serviceName] = {
                build: {
                    context: `./path/to/${serviceName}`,
                    dockerfile: 'Dockerfile'
                },
                ports: [`${port}:${port}`],
                volumes: [`./path/to/${serviceName}:/app/src/${serviceName}`],
                environment: [
                    `NODE_ENV=development`
                ]
            };
        });
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
      - "${serviceData.environment[0]}"`)
            .join('\n')}`;
        const dockerComposeYamlPath = path.join(dockerComposeFolder.fsPath, 'docker-compose.yaml');
        yield writeFileWithDirectoryCheck(dockerComposeYamlPath, yamlContent);
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
//# sourceMappingURL=generateDockerComposeYaml.js.map