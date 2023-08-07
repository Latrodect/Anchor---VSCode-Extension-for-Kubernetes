import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function generateDockerComposeYaml(autorunBool: boolean) {
    interface DockerService {
        build: {
          context: string;
          dockerfile: string;
        };
        ports: string[];
        volumes: string[];
        environment: string[];
      }
      
      interface DockerComposeData {
        version: string;
        services: Record<string, DockerService>;
      }

    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open.');
        return;
    }
    
    const inputServiceCount = await vscode.window.showInputBox({
        prompt: 'How many service do you want to use:',
        placeHolder: 'Example Usage: 6',
    });

    if (!inputServiceCount || inputServiceCount.trim() === "") {
        vscode.window.showErrorMessage('Please provide how many service do you have.');
        return;
    }

    const serviceCount = parseInt(inputServiceCount, 10);

    if (Number.isNaN(serviceCount) || serviceCount <= 0 ) {
      vscode.window.showErrorMessage('Please provide a valid positive number of services.');
      return;
   }

   if( serviceCount >= 150){
    vscode.window.showWarningMessage('Too many services. Extension can be crash and generating your files takes too much time!');
    }

    let serviceList = []
    let envList = []

    for (let index = 0; index < serviceCount; index++) {
      const serviceInformation = await vscode.window.showInputBox({
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

      let environmentVariables = await vscode.window.showInputBox({
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
    
    const dockerComposeData: DockerComposeData = {
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
    await writeFileWithDirectoryCheck(dockerComposeYamlPath, yamlContent);

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
    
}
async function writeFileWithDirectoryCheck(filePath: string, content: string) {
    const folderPath = path.dirname(filePath);
    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(filePath, content);
}

function createEnvironmentVariables(environmentVars: string[]): string[] {
  return environmentVars.map(varName => `- ${varName}=${process.env[varName] || 'default'}`);
}

function checkSpacesAndReplace(variableList: string[]){
  return variableList.map((item) => item.replace(/ +/g, '_'))
}

module.exports = {
  generateDockerComposeYaml
};