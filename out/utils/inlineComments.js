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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInlineComments = void 0;
const vscode = __importStar(require("vscode"));
// import axios from 'axios';
function generateInlineComments() {
    return __awaiter(this, void 0, void 0, function* () {
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
        // await generateComment(selectedCode);
        const generatedComment = "Axios will be added soon.";
        insertComment(editor, generatedComment);
    });
}
exports.generateInlineComments = generateInlineComments;
function getSelectedCode(editor) {
    const selection = editor.selection;
    if (selection.isEmpty) {
        return undefined;
    }
    return editor.document.getText(selection);
}
// async function generateComment(code: string): Promise<string> {
//     const apiKey = await vscode.window.showInputBox({
//         prompt: 'ChatGPT API Key',
//         placeHolder: 'sk-..JKuaJ',
//       });
//     const prompt = `Code to review:\n\n${code}\n\nPlease provide a comment for this code.`;
//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/engines/davinci-codex/completions',
//             {
//                 prompt,
//                 max_tokens: 50, 
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${apiKey}`,
//                 },
//             }
//         );
//         return response.data.choices[0].text.trim();
//     } catch (error) {
//         console.error('Error generating comment:', error);
//         return 'Unable to generate comment at the moment.';
//     }
// }
function insertComment(editor, comment) {
    const selection = editor.selection;
    const position = selection.end;
    editor.edit(editBuilder => {
        editBuilder.insert(position, '\n// Generated Comment: ' + comment);
    });
    vscode.window.showInformationMessage('Comment generated and inserted.');
}
//# sourceMappingURL=inlineComments.js.map