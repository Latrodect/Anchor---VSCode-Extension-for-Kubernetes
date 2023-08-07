import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function generateDockerComposeYaml() {
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
        placeHolder: '6',
    });

    if (!inputServiceCount || inputServiceCount === "0") {
        vscode.window.showErrorMessage('Please provide how much service do you have.');
        return;
    }

    const serviceCount = parseInt(inputServiceCount, 10);
    let serviceList = []
    for (let index = 0; index < serviceCount; index++) {
        const serviceInformation = await vscode.window.showInputBox({
            prompt: 'Service Information:',
            placeHolder: 'Example Usage: frontend, 8000, volume/path, NODE_ENV=development(environment example)',
        });

        if (!serviceInformation) {
            vscode.window.showErrorMessage('Please provide your service information.');
            return;
        }

        const service = serviceInformation.split(',').map(name => name.trim());
        if(service.length === 4){
            serviceList.push(service)
        }else{
            vscode.window.showErrorMessage('Some information is missing');
        }
    }

    const dockerComposeFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'docker_compose');
    fs.mkdirSync(dockerComposeFolder.fsPath, { recursive: true });
    
    const dockerComposeData: DockerComposeData = {
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
            await writeFileWithDirectoryCheck(dockerComposeYamlPath, yamlContent);
}

async function writeFileWithDirectoryCheck(filePath: string, content: string) {
    const folderPath = path.dirname(filePath);
    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(filePath, content);
}

