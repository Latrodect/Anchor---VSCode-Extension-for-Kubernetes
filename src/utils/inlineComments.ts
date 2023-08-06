import * as vscode from 'vscode';
import axios from 'axios'; // Install axios using npm or yarn

export async function generateInlineComments() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const selectedCode = getSelectedCode(editor);
    if (!selectedCode) {
        vscode.window.showInformationMessage('No code is selected.');
        return;
    }

    const generatedComment = await generateComment(selectedCode);
    insertComment(editor, generatedComment);
}

function getSelectedCode(editor: vscode.TextEditor): string | undefined {
    const selection = editor.selection;
    if (selection.isEmpty) {
        return undefined;
    }

    return editor.document.getText(selection);
}

async function generateComment(code: string): Promise<string> {
    const apiKey = await vscode.window.showInputBox({
        prompt: 'ChatGPT API Key',
        placeHolder: 'sk-..JKuaJ',
      });
    const prompt = `Code to review:\n\n${code}\n\nPlease provide a comment for this code.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt,
                max_tokens: 50, 
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating comment:', error);
        return 'Unable to generate comment at the moment.';
    }
}

function insertComment(editor: vscode.TextEditor, comment: string) {
    // Insert the generated comment at the end of the selected code
    const selection = editor.selection;
    const position = selection.end;
    editor.edit(editBuilder => {
        editBuilder.insert(position, '\n// Generated Comment: ' + comment);
    });

    vscode.window.showInformationMessage('Comment generated and inserted.');
}
