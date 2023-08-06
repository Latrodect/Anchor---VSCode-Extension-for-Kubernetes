import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function generateDockerFiles() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open.');
        return;
    }

    const projectRoot = await vscode.window.showInputBox({
        prompt: 'Root of your project:',
        placeHolder: '/code/src',
      });

    const contApplicaitonsPath = await vscode.window.showInputBox({
      prompt: 'Your Apps Path:',
      placeHolder: 'frontned, backend, sync',
    });

    if (!contApplicaitonsPath) {
      vscode.window.showWarningMessage('Please specify atleast one application path.');
      return;
  }
  if (!projectRoot) {
    vscode.window.showWarningMessage('Please provide root path.');
    return;
}
  const dockerFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'docker');
    fs.mkdirSync(dockerFolder.fsPath, { recursive: true });

  const dockerApplications = contApplicaitonsPath.split(',').map(name => name.trim());
    dockerApplications.map(async appName => {
        const appFolder = vscode.Uri.joinPath(dockerFolder, appName);
        fs.mkdirSync(appFolder.fsPath, { recursive: true });

        const folderPath = findApplicationFolder(projectRoot, appName);
        if (folderPath) {
        
        const dockerFile = `
        # Use a base image
        FROM node:14
        
        # Set the working directory inside the container
        WORKDIR /app
        
        # Install dependencies
        RUN npm install (example)
        
        # Copy the rest of the application code to the container
        COPY ${folderPath} ./src/${appName}
        
        # Expose a port (if needed)
        EXPOSE 3000
        
        # Specify the command to run when the container starts
        CMD ["npm run start"]
        
          `;

      await writeFileWithDirectoryCheck(path.join(appFolder.fsPath, `Dockerfile`), dockerFile);
    }
    });

  await Promise.all(dockerApplications);

}

async function writeFileWithDirectoryCheck(filePath: string, content: string) {
  const folderPath = path.dirname(filePath);
  await fs.promises.mkdir(folderPath, { recursive: true });
  await fs.promises.writeFile(filePath, content);
}

function findApplicationFolder(projectRoot: string, applicationName: string): string | undefined {
    const folders = fs.readdirSync(projectRoot);
    for (const folder of folders) {
        const folderPath = path.join(projectRoot, folder);
        const stat = fs.statSync(folderPath);
        
        if (stat.isDirectory() && folder === applicationName) {
            return folderPath;
        }
    }
    return undefined;
}