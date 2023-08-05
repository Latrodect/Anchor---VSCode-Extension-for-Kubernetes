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
exports.reviewSuggestion = void 0;
const vscode = __importStar(require("vscode"));
const reviewerSuggestions_1 = require("../utils/reviewerSuggestions");
function reviewSuggestion() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    // Generate review suggestions
    const suggestions = (0, reviewerSuggestions_1.generateReviewerSuggestions)(selectedText);
    // Display suggestions
    if (suggestions.length > 0) {
        const suggestionList = suggestions.map(suggestion => `- ${suggestion}`).join('\n');
        vscode.window.showInformationMessage(`Review Suggestions:\n${suggestionList}`);
    }
    else {
        vscode.window.showInformationMessage('No suggestions generated.');
    }
}
exports.reviewSuggestion = reviewSuggestion;
//# sourceMappingURL=reviewSuggestion.js.map