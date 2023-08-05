import * as vscode from 'vscode';
import { generateReviewerSuggestions } from '../utils/reviewerSuggestions';

export function reviewSuggestion() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    // Generate review suggestions
    const suggestions = generateReviewerSuggestions(selectedText);

    // Display suggestions
    if (suggestions.length > 0) {
        const suggestionList = suggestions.map(suggestion => `- ${suggestion}`).join('\n');
        vscode.window.showInformationMessage(`Review Suggestions:\n${suggestionList}`);
    } else {
        vscode.window.showInformationMessage('No suggestions generated.');
    }
}
