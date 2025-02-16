import * as vscode from 'vscode';
import { parseGoCode, generateGraph } from './goParser';

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Go Code Visualizer is now active!');

    let disposable = vscode.commands.registerCommand('goCodeVisualizer.visualize', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'go') {
            const code = editor.document.getText();
            const flow = parseGoCode(code);
            const graph = generateGraph(flow);

            const panel = vscode.window.createWebviewPanel(
                'goCodeVisualizer',
                'Go Code Visualizer',
                vscode.ViewColumn.Two,
                {}
            );

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
        } else {
            vscode.window.showErrorMessage('Open a Go file to visualize the code.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}