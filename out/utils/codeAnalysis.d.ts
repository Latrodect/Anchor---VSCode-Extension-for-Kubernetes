export declare function runCodeAnalysis(filePath: string): CodeIssue[];
interface CodeIssue {
    line: number;
    column: number;
    message: string;
}
export {};
