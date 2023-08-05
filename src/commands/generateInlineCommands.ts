import * as vscode from 'vscode';
import { generateInlineComments } from '../utils/inlineComments';

export function generateInlineCommands() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found. Please open the page you want to run.');
        return;
    }

    const selection = editor.selection;
    const selectedLine = selection.active.line + 1;

    generateInlineComments();

    vscode.window.showInformationMessage('Inline comment added.');
}
