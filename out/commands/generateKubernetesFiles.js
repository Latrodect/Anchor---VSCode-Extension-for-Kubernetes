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
exports.generateKubernetesFiles = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function generateKubernetesFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage('No workspace is open.');
            return;
        }
        const namespaceName = '';
        const deploymentsInput = yield vscode.window.showInputBox({
            prompt: 'Your Deployment Files:',
            placeHolder: 'frontend, backend, redis',
        });
        if (!deploymentsInput) {
            vscode.window.showInformationMessage('Please specify atleast one deployment name.');
            return;
        }
        const deploymentNames = deploymentsInput.split(',').map(name => name.trim());
        const kubernetesFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'kubernetes');
        fs.mkdirSync(kubernetesFolder.fsPath, { recursive: true });
        const namespacesFolder = vscode.Uri.joinPath(kubernetesFolder, 'namespaces');
        fs.mkdirSync(namespacesFolder.fsPath, { recursive: true });
        const deploymentsFolder = vscode.Uri.joinPath(kubernetesFolder, 'deployments');
        fs.mkdirSync(deploymentsFolder.fsPath, { recursive: true });
        const servicesFolder = vscode.Uri.joinPath(kubernetesFolder, 'services');
        fs.mkdirSync(servicesFolder.fsPath, { recursive: true });
        const ingressFolder = vscode.Uri.joinPath(kubernetesFolder, 'ingess');
        fs.mkdirSync(ingressFolder.fsPath, { recursive: true });
        const configmapsFolder = vscode.Uri.joinPath(kubernetesFolder, 'configmaps');
        fs.mkdirSync(configmapsFolder.fsPath, { recursive: true });
        const secretsFolder = vscode.Uri.joinPath(kubernetesFolder, 'secrets');
        fs.mkdirSync(secretsFolder.fsPath, { recursive: true });
        const jobsFolder = vscode.Uri.joinPath(kubernetesFolder, 'jobs');
        fs.mkdirSync(jobsFolder.fsPath, { recursive: true });
        const namespaceYAML = "apiVersion: v1\nkind: Namespace\nmetadata:name: ${namespaceName}";
        fs.writeFileSync(path.join(namespacesFolder.fsPath, 'development.yaml'), namespaceYAML);
        fs.writeFileSync(path.join(namespacesFolder.fsPath, 'staging.yaml'), namespaceYAML);
        fs.writeFileSync(path.join(namespacesFolder.fsPath, 'production.yaml'), namespaceYAML);
        const promises = deploymentNames.map((deploymentName) => __awaiter(this, void 0, void 0, function* () {
            const deploymentYAML = `
          apiVersion: apps/v1
          kind: Deployment
          metadata:
          name: ${deploymentName}
          namespace: ${namespaceName}
          # Add other deployment details here
          `;
            yield writeFileWithDirectoryCheck(path.join(deploymentsFolder.fsPath, `${deploymentName}.yaml`), deploymentYAML);
            const serviceYAML = `
          apiVersion: v1
          kind: Service
          metadata:
          name: ${deploymentName}-service
          namespace: ${namespaceName}
          spec:
          selector:
            app: ${deploymentName}
          ports:
            - protocol: TCP
              port: 80
              targetPort: 8080
          `;
            yield writeFileWithDirectoryCheck(path.join(servicesFolder.fsPath, `${deploymentName}-service.yaml`), serviceYAML);
            const ingressYAML = `
          apiVersion: networking.k8s.io/v1
          kind: Ingress
          metadata:
          name: ${deploymentName}-ingress
          namespace: ${namespaceName}
          spec:
          rules:
            - host: ${deploymentName}.example.com
              http:
                paths:
                  - path: /
                    pathType: Prefix
                    backend:
                      service:
                        name: ${deploymentName}-service
                        port:
                          number: 80
          `;
            yield writeFileWithDirectoryCheck(path.join(ingressFolder.fsPath, `${deploymentName}-ingress.yaml`), ingressYAML);
            const secretYAML = `
          apiVersion: v1
          kind: Secret
          metadata:
            name: ${deploymentName}-secret
            namespace: ${namespaceName}
          type: Opaque
          data:
            username: ${Buffer.from('my-username').toString('base64')}
            password: ${Buffer.from('my-password').toString('base64')}
          `;
            yield writeFileWithDirectoryCheck(path.join(secretsFolder.fsPath, `${deploymentName}-secret.yaml`), secretYAML);
            const configMapYAML = `
            apiVersion: v1
            kind: ConfigMap
            metadata:
              name: ${deploymentName}-configmap
              namespace: ${namespaceName}
            data:
              config.properties: |
                key1=value1
                key2=value2
            `;
            yield writeFileWithDirectoryCheck(path.join(configmapsFolder.fsPath, `${deploymentName}-configmap.yaml`), configMapYAML);
        }));
        yield Promise.all(promises);
        vscode.window.showInformationMessage(`${deploymentNames.length} deployment, service, and ingress files generated successfully.`);
    });
}
exports.generateKubernetesFiles = generateKubernetesFiles;
function writeFileWithDirectoryCheck(filePath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path.dirname(filePath);
        yield fs.promises.mkdir(folderPath, { recursive: true });
        yield fs.promises.writeFile(filePath, content);
    });
}
//# sourceMappingURL=generateKubernetesFiles.js.map