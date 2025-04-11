# Mermaid Graphical Editor

A Powerful, user-friendly web application for creating and editing Mermaid diagrams with a visual interface. This project combines the flexibilty of Mermaid's text-based diagram syntax with an intuitive drag-and-drop interface, making diagram creation accessible to both techinacl and non=technical users. Demo page is [here](https://j-aic.github.io/mermaid_graphical_editor_dev/)

## Features 

### Visual Editor
- Drag-and-drop interface for diagram elements
- Real-time preview of changes
- Support for multiple diagram types:
    - Flowcharts
    - Sequence diagrams(in the works)
    - Class diagrams(in the works)
    - State diagrams(in the works)
    - Entity Relationship diagrams(in the works)
    - User Journey diagrams(in the works)
    - Gantt charts(in the works)

### Interactive Editing
- direct manipulation of nodes and edges
- Real-time synchronization between visual and text representations
- Rich formatting options for nodes and edges
- Customizable styles and themes

### Export Capabilities
- Multiple export formats:
    - SVG (vector graphics)
    - PNG with transparency support
    - PDF (coming soon)
- Customizable export options:
    - Custom dimensions
    - Background colors
    - Style inclusion

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/J-AIC_git_account/mermaid-editor.git
cd mermaid-editor
```

2. Install dependencies:
```bash
npm install
# or 
yarn install
```

3. Start the dedevelopment server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build\` directory.

# Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Shared components
│   ├── Editor/         # Text and visual editor components
│   ├── Elements/       # Diagram element components
│   ├── Graph/          # Graph rendering components
│   └── Toolbar/        # Toolbar components
├── constants/          # Configuration and constants
├── hooks/              # Custom React hooks
└── utils/             # Utility functions
```

## Technical Architecture

The application is built using:
- React for the UI framework
- react-dnd for drag and drp functionality
- Mermaid.js for diagram rendering
- Tailwind CSS for styling

[Diagram: High-level architecture diagram showing component relationships]
![alt text](Mermaid%20Project%20diagram.png)

## Development 

### Running Tests
```bash
npm test
# or
yarn test
```

### Code Style 
The project uses ESLint and Prettier for code formatting. Run linting with:
```bash
npm run lint
# or
yarn lint
```


## Known Issues and Limitations

Current limitations:
1. Diagram Element renderings are not consistent
2. Complex diagrams might have performance issues in real-time preview
3. PDF export functionality is not yet implemented
4. The element Grid is a bit broken
5. Node and Edge editing is not consistent

## Roadmap

Planned features and improvements:
- [ ] Complete PDF export implementation
- [ ] Add undo/redo functionality
- [ ] Implement diagram history
- [ ] Add collaboration features
- [ ] Add auto-layout algorithms
- [ ] Add keyboard shortcuts
- [ ] Implement a mini-map for large diagrams
- [ ] Add zoom controls
- [ ] Add grid snapping
- [ ] Implement multi-select for nodes
- [ ] Add copy/paste functionality

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Mermaid.js](https://mermaid-js.github.io/)
- Uses [React](https://reactjs.org/) framework
- Styling with [Tailwind CSS](https://tailwindcss.com/)
