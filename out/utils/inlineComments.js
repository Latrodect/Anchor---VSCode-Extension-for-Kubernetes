"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInlineComments = void 0;
const vscode = __importStar(require("vscode"));
const ts = __importStar(require("typescript"));
function generateInlineComments() {
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
    const cyclomaticComplexity = calculateCyclomaticComplexity(selectedCode);
    const selectedLines = getSelectedLines(editor);
    if (selectedLines.length === 0) {
        vscode.window.showInformationMessage('No lines are selected.');
        return;
    }
    for (const line of selectedLines) {
        const suggested = '// def function:\n//    print("test")';
        const comment = `// Cyclomathic complexity:  ${cyclomaticComplexity} \n// For reducing complexity refactor your code like this: \n${suggested}`;
        // Insert the comment into the editor
        editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(line - 1, 0), comment + '\n');
        });
    }
    vscode.window.showInformationMessage(`${selectedLines.length} lines have been commented.`);
}
exports.generateInlineComments = generateInlineComments;
function calculateCyclomaticComplexity(code) {
    const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.ESNext, true);
    let edges = 0;
    let nodes = 0;
    let components = 0;
    function traverse(node) {
        nodes++;
        if (node.kind === ts.SyntaxKind.IfStatement ||
            node.kind === ts.SyntaxKind.WhileStatement ||
            node.kind === ts.SyntaxKind.DoStatement ||
            node.kind === ts.SyntaxKind.ForStatement ||
            node.kind === ts.SyntaxKind.CaseClause ||
            node.kind === ts.SyntaxKind.CatchClause) {
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
function getSelectedLines(editor) {
    const selectedLines = [];
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
//# sourceMappingURL=inlineComments.js.map