import * as vscode from 'vscode';

export function addInlineComment(lineNumber: number, commentText: string) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const position = new vscode.Position(lineNumber - 1, 0);
    const text = `// TODO: ${commentText}`;

    editor.edit(editBuilder => {
        editBuilder.insert(position, `${text}\n`);
    });

    vscode.window.showInformationMessage(`Added inline comment at line ${lineNumber}`);
}
