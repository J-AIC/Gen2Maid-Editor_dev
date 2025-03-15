export const FLOWCHART_ELEMENTS = [
    // Basic nodes
    /*{
      id: 'subgraph',
      name: 'Subgraph',
      sahpe: 'subgrap',
      startSymbol: 'subgraph',
      endSymbol: 'end',
      style: 'bg-gray-100',
      example: 'subgraph title\n    node1\n    node2\nend'
    },*/
    {
      id: 'rectangle',
      name: 'Rectangle',
      shape: 'rectangle',
      startSymbol: '[',
      endSymbol: ']',
      style: 'bg-purple-100',
      example: 'node[text]'
    },
    {
      id: 'rounded',
      name: 'Rounded',
      shape: 'rounded',
      startSymbol: '(',
      endSymbol: ')',
      style: 'bg-blue-100',
      example: 'node(text)'
    },
    {
      id: 'stadium',
      name: 'Stadium',
      shape: 'stadium',
      startSymbol: '([',
      endSymbol: '])',
      style: 'bg-green-100',
      example: 'node([text])'
    },
    {
      id: 'subroutine',
      name: 'Subroutine',
      shape: 'subroutine',
      startSymbol: '[[',
      endSymbol: ']]',
      style: 'bg-yellow-100',
      example: 'node[[text]]'
    },
    {
      id: 'cylinder',
      name: 'Cylinder',
      shape: 'cylinder',
      startSymbol: '[(',
      endSymbol: ')]',
      style: 'bg-red-100',
      example: 'node[(text)]'
    },
    {
      id: 'circle',
      name: 'Circle',
      shape: 'circle',
      startSymbol: '((',
      endSymbol: '))',
      style: 'bg-pink-100',
      example: 'node((text))'
    },
    {
      id: 'asymmetric',
      name: 'Asymmetric',
      shape: 'asymmetric',
      startSymbol: '>',
      endSymbol: ']',
      style: 'bg-indigo-100',
      example: 'node>text]'
    },
    {
      id: 'rhombus',
      name: 'Rhombus',
      shape: 'rhombus',
      startSymbol: '{',
      endSymbol: '}',
      style: 'bg-purple-100',
      example: 'node{text}'
    },
    {
      id: 'hexagon',
      name: 'Hexagon',
      shape: 'hexagon',
      startSymbol: '{{',
      endSymbol: '}}',
      style: 'bg-blue-100',
      example: 'node{{text}}'
    },
    {
      id: 'parallelogram',
      name: 'Parallelogram',
      shape: 'parallelogram',
      startSymbol: '[/',
      endSymbol: '/]',
      style: 'bg-green-100',
      example: 'node[/text/]'
    },
    {
      id: 'parallelogram-alt',
      name: 'Parallelogram Alt',
      shape: 'parallelogram-alt',
      startSymbol: '[\\',
      endSymbol: '\\]',
      style: 'bg-yellow-100',
      example: 'node[\\text\\]'
    },
    {
      id: 'trapezoid',
      name: 'Trapezoid',
      shape: 'trapezoid',
      startSymbol: '[/',
      endSymbol: '\\]',
      style: 'bg-red-100',
      example: 'node[/text\\]'
    },
    {
      id: 'trapezoid-alt',
      name: 'Trapezoid Alt',
      shape: 'trapezoid-alt',
      startSymbol: '[\\',
      endSymbol: '/]',
      style: 'bg-pink-100',
      example: 'node[\\text/]'
    },
    {
      id: 'double-circle',
      name: 'Double Circle',
      shape: 'double-circle',
      startSymbol: '(((',
      endSymbol: ')))',
      style: 'bg-indigo-100',
      example: 'node(((text)))'
    }
  ];