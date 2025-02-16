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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const goParser_1 = require("./goParser");
function activate(context) {
    vscode.window.showInformationMessage('Go Code Visualizer is now active!');
    let disposable = vscode.commands.registerCommand('goCodeVisualizer.visualize', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'go') {
            const code = editor.document.getText();
            const flow = (0, goParser_1.parseGoCode)(code);
            const graph = (0, goParser_1.generateGraph)(flow);
            const panel = vscode.window.createWebviewPanel('goCodeVisualizer', 'Go Code Visualizer', vscode.ViewColumn.Two, {});
            panel.webview.html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Go Code Visualizer</title>
                    <script src="https://d3js.org/d3.v6.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/graphviz.umd.js"></script>
                </head>
                <body>
                    <div id="graph"></div>
                    <script>
                        const graph = \`${graph}\`;
                        const svg = d3.select("#graph").graphviz().renderDot(graph);
                    </script>
                </body>
                </html>
            `;
        }
        else {
            vscode.window.showErrorMessage('Open a Go file to visualize the code.');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map