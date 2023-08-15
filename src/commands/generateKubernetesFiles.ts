import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function generateKubernetesFiles() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open.');
        return;
    }
    const namespaceName = ''; 

    const namespaceInput = await vscode.window.showInputBox({
      prompt: 'Your Namespace:',
      placeHolder: 'Example: my-application',
    });

    if (!namespaceInput) {
      vscode.window.showWarningMessage('Please specify a namespace.');
      return;
  }

    const deploymentsInput = await vscode.window.showInputBox({
      prompt: 'Your Deployment Files:',
      placeHolder: 'frontend, backend, redis',
    });

    if (!deploymentsInput) {
      vscode.window.showWarningMessage('Please specify atleast one deployment name.');
      return;
  }

    const deploymentNames = checkSpacesAndReplace(deploymentsInput.split(',').map(name => name.trim()));

    const kubernetesFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'kubernetes');
        fs.mkdirSync(kubernetesFolder.fsPath, { recursive: true });

    for(const deployment of deploymentNames){
        const deploymentFolder = vscode.Uri.joinPath(kubernetesFolder, `${deployment}-service`);
        fs.mkdirSync(deploymentFolder.fsPath, { recursive: true });
    }
        
    const configmapsFolder = vscode.Uri.joinPath(kubernetesFolder, 'configmaps');
    fs.mkdirSync(configmapsFolder.fsPath, { recursive: true });

    const secretsFolder = vscode.Uri.joinPath(kubernetesFolder, 'secrets');
    fs.mkdirSync(secretsFolder.fsPath, { recursive: true });

    const jobsFolder = vscode.Uri.joinPath(kubernetesFolder, 'jobs');
    fs.mkdirSync(jobsFolder.fsPath, { recursive: true });

    const namespaceYAML = "apiVersion: v1\nkind: Namespace\nmetadata:name: ${namespaceName}";
    fs.writeFileSync(path.join(kubernetesFolder.fsPath, 'namespace.yaml'), namespaceYAML);

    // Folder Structure design change. Files will added under service folders.

    const promises = deploymentNames.map(async deploymentName => {
      const serviceFolder = vscode.Uri.joinPath(kubernetesFolder, `${deploymentName}-service`);
      const deploymentYAML = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${deploymentName}
  namespace: ${namespaceName}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-container
          image: nginx:latest
          ports:
            - containerPort: 80
          `;
      await writeFileWithDirectoryCheck(path.join(serviceFolder.fsPath, `${deploymentName}-deployment.yaml`), deploymentYAML);

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
      await writeFileWithDirectoryCheck(path.join(serviceFolder.fsPath, `${deploymentName}-service.yaml`), serviceYAML);

      const ingressYAML = `
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
name: ${deploymentName}-ingress
namespace: ${namespaceName}
spec:
rules:
  - host: ${deploymentName}.com
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
      await writeFileWithDirectoryCheck(path.join(serviceFolder.fsPath, `${deploymentName}-ingress.yaml`), ingressYAML);

      

  await Promise.all(promises);
  
  
  vscode.window.showInformationMessage(`${deploymentNames.length} deployment, service, and ingress files generated successfully.`);
});
const secretYAML = `
apiVersion: v1
kind: Secret
metadata:
  name: application-secret
  namespace: ${namespaceName}
type: Opaque
data:
  username: ${Buffer.from('my-username').toString('base64')}
  password: ${Buffer.from('my-password').toString('base64')}
          `;
        await writeFileWithDirectoryCheck(path.join(secretsFolder.fsPath, `application-secret.yaml`), secretYAML);

        const configMapYAML = `
apiVersion: v1
kind: ConfigMap
metadata:
  name: application-configmap
  namespace: ${namespaceName}
data:
  config.properties: |
    key1=value1
    key2=value2
            `;
        await writeFileWithDirectoryCheck(path.join(configmapsFolder.fsPath, `application-configmap.yaml`), configMapYAML);
    
  }
async function writeFileWithDirectoryCheck(filePath: string, content: string) {
  const folderPath = path.dirname(filePath);
  await fs.promises.mkdir(folderPath, { recursive: true });
  await fs.promises.writeFile(filePath, content);
}

function checkSpacesAndReplace(variableList: string[]){
  return variableList.map((item) => item.replace(/ +/g, '_'))
}