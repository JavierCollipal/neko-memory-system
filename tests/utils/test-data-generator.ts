/**
 * Test Data Generator
 *
 * Generates GENERIC/FAKE data for testing
 * NO real personal information, credentials, or sensitive data
 */

export class TestDataGenerator {
  /**
   * Generate fake project names
   */
  static generateProjectName(): string {
    const adjectives = ['Modern', 'Agile', 'Scalable', 'Innovative', 'Robust', 'Cloud-Native'];
    const nouns = ['E-Commerce', 'Analytics', 'Dashboard', 'Platform', 'Portal', 'System'];
    const suffixes = ['Pro', 'Suite', 'Hub', 'Engine', 'Framework', ''];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${adj} ${noun} ${suffix}`.trim();
  }

  /**
   * Generate fake username
   */
  static generateUsername(): string {
    const prefixes = ['user', 'dev', 'admin', 'test', 'demo'];
    const number = Math.floor(Math.random() * 10000);

    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${number}`;
  }

  /**
   * Generate fake email
   */
  static generateEmail(): string {
    const domains = ['example.com', 'test.org', 'demo.net', 'sample.io'];
    const username = this.generateUsername();
    const domain = domains[Math.floor(Math.random() * domains.length)];

    return `${username}@${domain}`;
  }

  /**
   * Generate architectural decision document
   */
  static generateArchitecturalDecision(topic: string): string {
    return `
# Architectural Decision: ${topic}

## Date
${new Date().toISOString().split('T')[0]}

## Context
${this.generateParagraph()}

## Decision
We have decided to ${topic.toLowerCase()} to improve system scalability and maintainability.

## Rationale
${this.generateParagraph()}

## Consequences
### Positive
- Improved performance
- Better scalability
- Enhanced maintainability

### Negative
- Initial implementation cost
- Learning curve for team

## Status
Accepted
    `.trim();
  }

  /**
   * Generate debugging insight document
   */
  static generateDebuggingInsight(issue: string): string {
    return `
# Debugging: ${issue}

## Problem
${this.generateParagraph()}

## Root Cause
The issue was caused by ${this.generateSentence()}.

## Solution
${this.generateParagraph()}

## Result
- Performance improved by ${Math.floor(Math.random() * 50 + 10)}%
- Error rate reduced to < 0.1%
- User satisfaction increased

## Lessons Learned
${this.generateSentence()}
    `.trim();
  }

  /**
   * Generate research findings document
   */
  static generateResearchFindings(topic: string): string {
    const sources = [
      'Academic Journal 2024',
      'Industry Report 2025',
      'Technical Conference Proceedings',
      'Government Statistics Database'
    ];

    return `
# Research: ${topic}

## Key Findings
${this.generateBulletList(5)}

## Methodology
${this.generateParagraph()}

## Data Sources
${sources.map(s => `- ${s}`).join('\n')}

## Conclusions
${this.generateParagraph()}

## Future Research
${this.generateSentence()}
    `.trim();
  }

  /**
   * Generate code pattern document
   */
  static generateCodePattern(patternName: string): string {
    return `
# Design Pattern: ${patternName}

## Intent
${this.generateSentence()}

## When to Use
${this.generateBulletList(3)}

## Structure
\`\`\`typescript
// Example implementation
class ${patternName.replace(/\s+/g, '')} {
  constructor() {
    // Initialize
  }

  execute(): void {
    // Implementation
  }
}
\`\`\`

## Benefits
${this.generateBulletList(4)}

## Drawbacks
- Increased complexity
- Potential performance overhead

## Related Patterns
- Factory Pattern
- Observer Pattern
- Strategy Pattern
    `.trim();
  }

  /**
   * Generate performance optimization document
   */
  static generatePerformanceOptimization(): string {
    const improvement = Math.floor(Math.random() * 70 + 10);

    return `
# Performance Optimization: Database Query Optimization

## Before
- Query time: ${Math.floor(Math.random() * 1000 + 500)}ms
- CPU usage: ${Math.floor(Math.random() * 40 + 60)}%
- Memory usage: ${Math.floor(Math.random() * 500 + 500)}MB

## Changes Applied
${this.generateBulletList(4)}

## After
- Query time: ${Math.floor(Math.random() * 200 + 50)}ms
- CPU usage: ${Math.floor(Math.random() * 30 + 20)}%
- Memory usage: ${Math.floor(Math.random() * 200 + 200)}MB

## Improvement
${improvement}% faster, ${Math.floor(improvement * 0.6)}% less resource usage

## Next Steps
${this.generateSentence()}
    `.trim();
  }

  /**
   * Generate fake paragraph
   */
  static generateParagraph(): string {
    const sentences = Math.floor(Math.random() * 3) + 2;
    return Array.from({ length: sentences }, () => this.generateSentence()).join(' ');
  }

  /**
   * Generate fake sentence
   */
  static generateSentence(): string {
    const templates = [
      'This approach provides significant benefits for large-scale applications.',
      'The implementation follows industry best practices and standards.',
      'Team collaboration improved measurably after adopting this methodology.',
      'System reliability increased through comprehensive testing procedures.',
      'User experience enhancements led to higher engagement metrics.',
      'Technical debt reduction became a primary focus area.',
      'Performance monitoring revealed several optimization opportunities.',
      'Code quality metrics showed consistent improvement over time.',
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate bullet list
   */
  static generateBulletList(count: number): string {
    const items = [
      'Improved system scalability and performance',
      'Enhanced user experience and interface design',
      'Reduced technical debt and code complexity',
      'Increased test coverage and reliability',
      'Better documentation and knowledge sharing',
      'Streamlined deployment and CI/CD processes',
      'Optimized database queries and caching',
      'Enhanced security and compliance measures',
    ];

    return Array.from({ length: count }, (_, i) =>
      `- ${items[i % items.length]}`
    ).join('\n');
  }

  /**
   * Generate fake code example
   */
  static generateCodeExample(language: string = 'typescript'): string {
    return `
\`\`\`${language}
// Example ${language} code
function processData(input: any[]): any[] {
  return input
    .filter(item => item.isValid)
    .map(item => ({ ...item, processed: true }))
    .sort((a, b) => a.priority - b.priority);
}

export default processData;
\`\`\`
    `.trim();
  }

  /**
   * Generate large dataset for testing
   */
  static generateLargeDataset(sizeKB: number): string {
    const targetSize = sizeKB * 1024;
    let content = '# Large Dataset\n\n';

    while (content.length < targetSize) {
      content += this.generateParagraph() + '\n\n';
    }

    return content;
  }

  /**
   * Generate fake user story
   */
  static generateUserStory(): string {
    const roles = ['user', 'admin', 'customer', 'developer', 'manager'];
    const actions = ['browse', 'search', 'filter', 'export', 'manage', 'view'];
    const features = ['products', 'reports', 'settings', 'data', 'analytics', 'content'];

    const role = roles[Math.floor(Math.random() * roles.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const feature = features[Math.floor(Math.random() * features.length)];

    return `As a ${role}, I want to ${action} ${feature} so that I can improve my productivity.`;
  }

  /**
   * Generate test memory with specific category and content
   */
  static generateTestMemory(category: string, count: number = 1): Array<{ filename: string; content: string }> {
    const memories = [];

    for (let i = 0; i < count; i++) {
      const id = Math.random().toString(36).substring(7);

      let content: string;
      let filename: string;

      switch (category) {
        case 'technical':
          filename = `tech-${id}.md`;
          content = this.generateCodePattern(`Pattern ${id}`);
          break;
        case 'research':
          filename = `research-${id}.md`;
          content = this.generateResearchFindings(`Topic ${id}`);
          break;
        case 'debugging':
          filename = `debug-${id}.md`;
          content = this.generateDebuggingInsight(`Issue ${id}`);
          break;
        case 'architecture':
          filename = `arch-${id}.md`;
          content = this.generateArchitecturalDecision(`Decision ${id}`);
          break;
        default:
          filename = `memory-${id}.md`;
          content = `# Memory ${id}\n\n${this.generateParagraph()}`;
      }

      memories.push({ filename, content });
    }

    return memories;
  }
}

/**
 * Faker-style random data generators
 */
export const faker = {
  project: {
    name: () => TestDataGenerator.generateProjectName()
  },
  user: {
    username: () => TestDataGenerator.generateUsername(),
    email: () => TestDataGenerator.generateEmail()
  },
  document: {
    architecture: (topic: string) => TestDataGenerator.generateArchitecturalDecision(topic),
    debugging: (issue: string) => TestDataGenerator.generateDebuggingInsight(issue),
    research: (topic: string) => TestDataGenerator.generateResearchFindings(topic),
    codePattern: (name: string) => TestDataGenerator.generateCodePattern(name),
    performance: () => TestDataGenerator.generatePerformanceOptimization()
  },
  text: {
    paragraph: () => TestDataGenerator.generateParagraph(),
    sentence: () => TestDataGenerator.generateSentence(),
    bulletList: (count: number) => TestDataGenerator.generateBulletList(count)
  },
  code: {
    example: (lang?: string) => TestDataGenerator.generateCodeExample(lang)
  },
  userStory: () => TestDataGenerator.generateUserStory()
};
