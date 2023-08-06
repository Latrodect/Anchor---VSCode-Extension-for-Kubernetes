# Backdoor Code Reviewer Extension

The **Backdoor Code Reviewer** extension for Visual Studio Code aims to enhance the code review process, streamline collaboration, and improve code quality within your projects.

## Features

- Automated code analysis to identify common issues and coding standards violations.
- Add inline comments to specific lines of code for discussions and feedback.
- AI-powered suggestions to provide constructive feedback for code reviews.
- ... (add more features as you develop them)

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon in the sidebar or press `Ctrl+Shift+X`.
3. Search for "Backdoor Code Reviewer" and click "Install".

## Usage

### Generate Kubernetes Deployment Files

1. Use the keyboard shortcut `Ctrl+L` to trigger the "Generate Kubernetes Files" command.
2. Enter the names of your apps (e.g., backend, frontend) separated by commas.
3. Backdoor will create Kubernetes YAML files for your apps.

### Generate Docker Files

1. Use the keyboard shortcut `Ctrl+L` to trigger the "Generate Kubernetes Files" command.
2. Enter the root of your project (e.g., /src/fronend) separated by commas.
3. Enter the names of your apps (e.g., backend, frontend) separated by commas.
4. Backdoor will create Dockerfile template for your project.

### Analyze Code

1. Open a code file you want to analyze.
2. Use the command palette (`Ctrl+Shift+P`) and search for "Backdoor Code Reviewer: Analyze Code".
3. The extension will highlight potential issues and coding standards violations within the code.

### Add Inline Comment

1. Select the line of code where you want to add an inline comment.
2. Use the command palette (`Ctrl+Shift+P`) and search for "Backdoor Code Reviewer: Add Inline Comment".
3. An inline comment will be added to the selected line.


## Configuration

This extension provides customizable configuration settings that you can adjust to your preferences. Check the VS Code settings for options related to the Backdoor Code Reviewer extension.

## Contributing

Contributions are welcome! To contribute to this extension, follow these steps:

1. Fork this repository.
2. Clone your forked repository to your local machine.
3. Make your changes and improvements.
4. Test your changes thoroughly.
5. Commit your changes with clear commit messages.
6. Push your changes to your forked repository.
7. Create a pull request to this repository.

Please follow the [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This extension is licensed under the [MIT License](LICENSE).

---

Feel free to customize this template with your specific project details, additional sections, and any relevant links or resources. Remember to update the documentation as your extension evolves and new features are added.
