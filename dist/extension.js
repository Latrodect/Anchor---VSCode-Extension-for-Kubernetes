/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
const analyzeCode_1 = __webpack_require__(2);
const generateInlineCommands_1 = __webpack_require__(4);
const reviewSuggestion_1 = __webpack_require__(5);
function activate(context) {
    console.log('Code Review Assistant extension is now active.');
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('code-review-assistant.analyzeCode', analyzeCode_1.analyzeCode), vscode.commands.registerCommand('code-review-assistant.addInlineComment', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedLine = selection.active.line + 1;
            (0, generateInlineCommands_1.addInlineComment)(selectedLine, '');
        }
    }), vscode.commands.registerCommand('code-review-assistant.suggestReview', reviewSuggestion_1.suggestReview));
}
exports.activate = activate;
function deactivate() {
    // Clean up resources when the extension is deactivated
    console.log('Code Review Assistant extension is now deactivated.');
}
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.analyzeCode = void 0;
const vscode = __importStar(__webpack_require__(1));
const child_process = __importStar(__webpack_require__(3));
function analyzeCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const document = editor.document;
    const filePath = document.uri.fsPath;
    // Run ESLint on the current file
    child_process.exec(`eslint ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error analyzing code: ${error.message}`);
            return;
        }
        if (stdout) {
            // Process ESLint output and highlight issues
            const issues = parseEslintOutput(stdout);
            highlightCodeIssues(issues);
        }
        else {
            vscode.window.showInformationMessage('Code analysis completed. No issues found.');
        }
    });
}
exports.analyzeCode = analyzeCode;
function parseEslintOutput(output) {
    // Parse ESLint output and extract issue details (line, column, message, etc.)
    const issues = [];
    // ... implement your parsing logic here ...
    return issues;
}
function highlightCodeIssues(issues) {
    const decorations = [];
    issues.forEach(issue => {
        const range = new vscode.Range(issue.line - 1, issue.column - 1, issue.line - 1, issue.column);
        const decoration = {
            range: range,
            hoverMessage: issue.message
        };
        decorations.push(decoration);
    });
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.setDecorations(vscode.window.createTextEditorDecorationType({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'red'
        }), decorations);
    }
}


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addInlineComment = void 0;
const vscode = __importStar(__webpack_require__(1));
function addInlineComment(lineNumber, commentText) {
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
exports.addInlineComment = addInlineComment;


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.suggestReview = void 0;
const vscode = __importStar(__webpack_require__(1));
function suggestReview() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const document = editor.document;
    const selectedText = document.getText(editor.selection);
    // Mock AI-powered model to generate review suggestions
    const suggestions = generateSuggestions(selectedText);
    if (suggestions.length === 0) {
        vscode.window.showInformationMessage('No suggestions generated.');
        return;
    }
    // Display suggestions as a bulleted list
    const suggestionList = suggestions.map(suggestion => `- ${suggestion}`).join('\n');
    vscode.window.showInformationMessage(`Review Suggestions:\n${suggestionList}`);
}
exports.suggestReview = suggestReview;
function generateSuggestions(text) {
    // Mock AI model logic to generate review suggestions based on input text
    // Replace this with actual AI/ML integration in your extension
    return [
        'Consider using a more descriptive variable name.',
        'Avoid nested loops to improve code readability.',
        'Add comments to explain complex logic.',
        'Use consistent indentation throughout the code.',
    ];
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map