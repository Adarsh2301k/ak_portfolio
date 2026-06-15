// ─── Skills Data ─────────────────────────────────────────────────────────────
// Used by: EngineRoom zone

export const skillCategories = [
  {
    id: 'languages',
    label: 'Languages',
    icon: '{ }',
    skills: [
      { name: 'Java',       level: 90, years: 3 },
      { name: 'JavaScript', level: 85, years: 3 },
      { name: 'SQL',        level: 85, years: 3 },
      { name: 'C++',        level: 80, years: 4 },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: '⬙',
    skills: [
      { name: 'React.js', level: 88, years: 2 },
      { name: 'Angular',  level: 80, years: 1 },
      { name: 'HTML5',    level: 95, years: 4 },
      { name: 'CSS3',     level: 90, years: 4 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: '◈',
    skills: [
      { name: 'Spring Boot', level: 85, years: 1 },
      { name: 'Node.js',     level: 82, years: 2 },
      { name: 'Express.js',  level: 82, years: 2 },
      { name: 'REST APIs',   level: 90, years: 2 },
      { name: 'JDBC',        level: 75, years: 1 },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: '⬖',
    skills: [
      { name: 'PostgreSQL', level: 85, years: 2 },
      { name: 'MongoDB',    level: 80, years: 2 },
      { name: 'MySQL',      level: 85, years: 3 },
    ],
  },
  {
    id: 'tools',
    label: 'DevOps & Tools',
    icon: '⚙',
    skills: [
      { name: 'Git & GitHub',level: 90, years: 4 },
      { name: 'Postman',    level: 85, years: 2 },
      { name: 'Jenkins',    level: 80, years: 1 },
      { name: 'Render',     level: 85, years: 1 },
      { name: 'Netlify',    level: 85, years: 2 },
    ],
  },
];

export const stats = [
  { label: 'DSA Problems',    value: '250+' },
  { label: 'LeetCode Rating', value: '1481' },
  { label: 'HackerRank Stars',value: '4 ⭐' },
  { label: 'Stack Focus',     value: 'MERN / Spring' },
];
