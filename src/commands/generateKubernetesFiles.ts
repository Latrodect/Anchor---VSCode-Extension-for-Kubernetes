import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function generateKubernetesFiles() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open.');
        return;
    }

    // Namespace Input 
    const namespaceInput = await vscode.window.showInputBox({
      prompt: 'Your Namespace:',
      placeHolder: 'Example: my-application',
    });

    
    if (!namespaceInput) {
      vscode.window.showWarningMessage('Please specify a namespace.');
      return;
    }

    const namespace = checkSpacesAndReplace([namespaceInput])

    // Deployment Input 
    const deploymentsInput = await vscode.window.showInputBox({
      prompt: 'Your Deployment Files:',
      placeHolder: 'Example: frontend, backend, redis',
    });

    if (!deploymentsInput) {
      vscode.window.showWarningMessage('Please specify atleast one deployment name.');
      return;
  }

    const deploymentNames = checkSpacesAndReplace(deploymentsInput.split(',').map(name => name.trim()));

    // Jobs Input 
    const jobsInput = await vscode.window.showInputBox({
      prompt: 'Your Jobs:',
      placeHolder: 'Example: collector, pickle',
    });

    if (!jobsInput) {
      vscode.window.showWarningMessage('Please specify atleast one deployment name.');
      return;
  }

    const jobNames = checkSpacesAndReplace(jobsInput.split(',').map(name => name.trim()));

    // Folder Generation
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

    // Deployment Yaml fs operations
    const namespaceYAML = `
apiVersion: v1
kind: Namespace
metadata:
  name:
   ${namespace}`;
    fs.writeFileSync(path.join(kubernetesFolder.fsPath, 'namespace.yaml'), namespaceYAML);

    const promises = deploymentNames.map(async deploymentName => {
      const serviceFolder = vscode.Uri.joinPath(kubernetesFolder, `${deploymentName}-service`);
      const deploymentYAML = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${deploymentName}
  namespace: ${namespace}
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
namespace: ${namespace}
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
namespace: ${namespace}
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
      
  
  
});
const secretYAML = `
apiVersion: v1
kind: Secret
metadata:
  name: application-secret
  namespace: ${namespace}
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
  namespace: ${namespace}
data:
  config.properties: |
    key1=value1
    key2=value2
            `;
        await writeFileWithDirectoryCheck(path.join(configmapsFolder.fsPath, `application-configmap.yaml`), configMapYAML);
  
  await Promise.all(promises);
  vscode.window.showInformationMessage(`${deploymentNames.length} deployment, service, and ingress files generated successfully.`);

  // Jobs Yaml fs operations
  const JobPromises = jobNames.map(async jobNames => {})
  const jobYAML = `
apiVersion: batch/v1
kind: Job
metadata:
  name: ${jobNames}
spec:
  completions: 1
  template:
    metadata:
      name: ${jobNames}-pod
    spec:
      containers:
        - name: ${jobNames}-container
          image: nginx
      restartPolicy: Never
  
        `;
        await writeFileWithDirectoryCheck(path.join(jobsFolder.fsPath, `${jobNames}-job.yaml`), jobYAML);
  }
async function writeFileWithDirectoryCheck(filePath: string, content: string) {
  const folderPath = path.dirname(filePath);
  await fs.promises.mkdir(folderPath, { recursive: true });
  await fs.promises.writeFile(filePath, content);
}

function checkSpacesAndReplace(variableList: string[]){
  return variableList.map((item) => item.replace(/ +/g, '_'))
}