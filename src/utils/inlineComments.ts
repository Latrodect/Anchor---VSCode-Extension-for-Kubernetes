import * as vscode from 'vscode';
import * as ts from 'typescript';

export function generateInlineComments() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const selectedCode = editor.document.getText(editor.selection);
    if (!selectedCode.trim()) {
        vscode.window.showInformationMessage('No code is selected.');
        return;
    }

    const cyclomaticComplexity = calculateCyclomaticComplexity(selectedCode)

    const selectedLines = getSelectedLines(editor);
    if (selectedLines.length === 0) {
        vscode.window.showInformationMessage('No lines are selected.');
        return;
    }

    for (const line of selectedLines) {
        const suggested = '// def function:\n//    print("test")'
        const comment = `// Cyclomathic complexity:  ${cyclomaticComplexity} \n// For reducing complexity refactor your code like this: \n${suggested}`;
        // Insert the comment into the editor
        editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(line - 1, 0), comment + '\n');
        });
    }

    vscode.window.showInformationMessage(`${selectedLines.length} lines have been commented.`);
}

function calculateCyclomaticComplexity(code: string): number {
    const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.ESNext, true);

    let edges = 0;
    let nodes = 0;
    let components = 0;

    function traverse(node: ts.Node) {
        nodes++;

        if (
            node.kind === ts.SyntaxKind.IfStatement ||
            node.kind === ts.SyntaxKind.WhileStatement ||
            node.kind === ts.SyntaxKind.DoStatement ||
            node.kind === ts.SyntaxKind.ForStatement ||
            node.kind === ts.SyntaxKind.CaseClause ||
            node.kind === ts.SyntaxKind.CatchClause
        ) {
            edges++;
        }

        if (ts.isFunctionLike(node)) {
            components++;
        }

        node.forEachChild(traverse);
    }

    traverse(sourceFile);

    const complexity = edges - nodes + (2 * components);
    return complexity;
}

function getSelectedLines(editor: vscode.TextEditor): number[] {
    const selectedLines: number[] = [];
    for (const selection of editor.selections) {
        const startLine = selection.start.line + 1; 
        const endLine = selection.end.line + 1;
        for (let line = startLine; line <= endLine; line++) {
            if (!selectedLines.includes(line)) {
                selectedLines.push(line);
            }
        }
    }
    return selectedLines;
}
