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
exports.analyzeCode = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
function analyzeCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const messageRules = {
        length: '',
        naming: '',
        strings: ''
    };
    const document = editor.document;
    const allowedLanguages = {
        javascript: 80,
        python: 79,
        typescript: 120
    };
    if (!allowedLanguages[document.languageId]) {
        vscode.window.showErrorMessage('Code analysis allow only TypeScript, Javascript, Python files.');
        return;
    }
    const filePath = document.uri.fsPath;
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            vscode.window.showErrorMessage('Error reading file: ' + err.message);
            return;
        }
        const lines = data.split('\n');
        const longLines = lines.filter(line => line.length > allowedLanguages[document.languageId]);
        if (longLines.length === 0) {
            messageRules.length = 'No lines exceed the character limit.';
            vscode.window.showInformationMessage('No lines exceed the character limit.');
        }
        else {
            messageRules.length = `${longLines.length} lines exceed the character limit.`;
            vscode.window.showWarningMessage(`${longLines.length} lines exceed the character limit.`);
        }
        if (document.languageId === "javascript") {
            const lowerCamelCaseVars = [];
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const variableRegex = /\b(?:const|let|var)\s+([a-zA-Z][a-zA-Z0-9]*)\b/g;
                let match;
                while ((match = variableRegex.exec(line)) !== null) {
                    const variableName = match[1];
                    if (checkCamelCaseStrings(variableName)) {
                        lowerCamelCaseVars.push({ name: variableName, line: i + 1 });
                    }
                }
            }
            if (lowerCamelCaseVars.length === 0) {
                messageRules.naming = 'All variable names are in camelCase.';
                vscode.window.showInformationMessage('All variable names are in camelCase.');
            }
            else {
                const nonCamelCaseInfo = lowerCamelCaseVars
                    .map(variable => `${variable.name} (Line ${variable.line})`)
                    .join(', ');
                messageRules.naming = `Non-camelCase variables found: ${nonCamelCaseInfo}`;
                vscode.window.showWarningMessage(`Non-camelCase variables found: ${nonCamelCaseInfo}`);
            }
            let modifiedContent = data;
            const stringLiteralRegex = /"(.*?)"/g;
            let match;
            while ((match = stringLiteralRegex.exec(data)) !== null) {
                const originalString = match[0];
                const convertedString = originalString.replace(/"/g, "'");
                modifiedContent = modifiedContent.replace(originalString, convertedString);
            }
            fs.writeFile(filePath, modifiedContent, 'utf-8', (writeErr) => {
                if (writeErr) {
                    vscode.window.showErrorMessage('Error writing file: ' + writeErr.message);
                    return;
                }
                messageRules.naming = 'String literals with double quotes converted to single quotes.';
                vscode.window.showInformationMessage('String literals with double quotes converted to single quotes.');
            });
        }
    });
}
exports.analyzeCode = analyzeCode;
function checkCamelCaseStrings(str) {
    const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
    return camelCaseRegex.test(str);
}
//# sourceMappingURL=analyzeCode.js.map