import * as vscode from 'vscode';
import { addInlineComment } from '../utils/inlineComments';

export function generateInlineCommands() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found. Please open the page you want to run.');
        return;
    }

    const selection = editor.selection;
    const selectedLine = selection.active.line + 1;

    // Generate inline comment
    addInlineComment(selectedLine, 'Review this code.');

    vscode.window.showInformationMessage('Inline comment added.');
}
