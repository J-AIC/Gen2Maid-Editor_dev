export const DIAGRAM_TEMPLATES = {
    Flowchart: `flowchart LR`,
  
    Sequence: `sequenceDiagram
      Alice->>John: Hello John, how are you?
      John-->>Alice: Great!
      Alice->>John: See you later!`,
  
    Class: `classDiagram
      class Animal {
        +name: string
        +makeSound(): void
      }`,
  
    State: `stateDiagram-v2
      [*] --> Still
      Still --> Moving
      Moving --> Still
      Moving --> Crash
      Crash --> [*]`,
  
    'Git Graph': `gitGraph
      commit
      commit
      branch develop
      commit
      commit
      checkout main
      commit`,
  
    'Entity Relationship': `erDiagram
      CUSTOMER ||--o{ ORDER : places
      ORDER ||--|{ LINE-ITEM : contains`,
  
    'User Journey': `journey
      title My working day
      section Go to work
        Make tea: 5: Me
        Go upstairs: 3: Me
        Do work: 1: Me, Cat`,
  
    'Gantt Chart': `gantt
      title A Gantt Diagram
      section Section
      A task           :a1, 2014-01-01, 30d
      Another task     :after a1, 20d`
  };