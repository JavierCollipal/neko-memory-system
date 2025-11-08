/**
 * Personality Isolation Tests
 *
 * Tests that different AI personalities maintain separate memory spaces
 * Uses GENERIC personality examples - NO real personal data
 */

import { FileBackendImpl } from '../../src/backends/FileBackend.impl';
import * as path from 'path';
import * as os from 'os';

describe('Personality Isolation', () => {
  let backend: FileBackendImpl;
  let testMemoryRoot: string;

  beforeEach(async () => {
    testMemoryRoot = path.join(os.tmpdir(), `neko-personality-test-${Date.now()}`);
    backend = new FileBackendImpl(testMemoryRoot);
    await backend.initialize();
  });

  afterEach(async () => {
    await backend.clear();
  });

  describe('Separate Memory Spaces', () => {
    it('should isolate technical personality memories', async () => {
      const category = 'personalities/technical';

      await backend.store('coding-patterns.md', `
# Technical Coding Patterns

## Pattern 1: Repository Pattern
Use repository pattern for data access abstraction.

## Pattern 2: Factory Pattern
Use factories for complex object creation.

## Pattern 3: Observer Pattern
Use observers for event-driven architecture.
      `.trim(), category);

      await backend.store('performance-tips.md', `
# Performance Optimization Tips

- Use memoization for expensive calculations
- Implement lazy loading for large datasets
- Cache frequently accessed data
- Use connection pooling
      `.trim(), category);

      const technicalMemories = await backend.list(category);
      expect(technicalMemories.length).toBe(2);
    });

    it('should isolate research personality memories', async () => {
      const category = 'personalities/research';

      await backend.store('climate-research.md', `
# Climate Change Research Summary

## Key Findings
- Global average temperature increased 1.1°C since pre-industrial
- Arctic ice declining at 13% per decade
- Sea levels rising 3.3mm per year

## Sources Reviewed
- IPCC AR6 Report
- NASA Climate Data
- NOAA Temperature Records
      `.trim(), category);

      await backend.store('ai-research.md', `
# AI Development Trends

## Current Trends
- Large Language Models scaling to trillions of parameters
- Multimodal AI combining vision, language, audio
- AI safety and alignment research growing

## Open Questions
- How to ensure AI alignment with human values?
- Scaling limits for current architectures?
      `.trim(), category);

      const researchMemories = await backend.list(category);
      expect(researchMemories.length).toBe(2);
    });

    it('should isolate creative personality memories', async () => {
      const category = 'personalities/creative';

      await backend.store('story-ideas.md', `
# Creative Story Ideas

## Idea 1: The Time Traveler's Library
A library where books change based on timeline alterations.

## Idea 2: Digital Ghosts
Consciousness uploads that haunt the internet.

## Idea 3: The Last Algorithm
An AI that predicts the end of computation.
      `.trim(), category);

      const creativeMemories = await backend.list(category);
      expect(creativeMemories.length).toBe(1);
    });
  });

  describe('No Cross-Contamination', () => {
    it('should prevent technical memories from appearing in research context', async () => {
      // Store technical memory
      await backend.store('tech-note.md', 'Technical content', 'personalities/technical');

      // Store research memory
      await backend.store('research-note.md', 'Research content', 'personalities/research');

      // List research memories - should NOT include technical
      const researchMemories = await backend.list('personalities/research');

      expect(researchMemories.length).toBe(1);
      expect(researchMemories[0].filePath).toContain('research-note.md');
      expect(researchMemories[0].filePath).not.toContain('tech-note.md');
    });

    it('should maintain separate access counts per personality', async () => {
      // Technical personality accesses its memory
      await backend.store('tech-memo.md', 'Tech content', 'personalities/technical');
      await backend.retrieve('tech-memo.md', 'personalities/technical');
      await backend.retrieve('tech-memo.md', 'personalities/technical');
      await backend.retrieve('tech-memo.md', 'personalities/technical');

      // Research personality accesses different memory
      await backend.store('research-memo.md', 'Research content', 'personalities/research');
      await backend.retrieve('research-memo.md', 'personalities/research');

      const techStats = await backend.list('personalities/technical');
      const researchStats = await backend.list('personalities/research');

      const techMemo = techStats.find(f => f.filePath.includes('tech-memo.md'));
      const researchMemo = researchStats.find(f => f.filePath.includes('research-memo.md'));

      expect(techMemo!.accessCount).toBeGreaterThan(researchMemo!.accessCount);
    });
  });

  describe('Personality-Specific Knowledge Building', () => {
    it('should build specialized knowledge for analyst personality', async () => {
      const category = 'personalities/analyst';

      // Day 1: Initial data analysis patterns
      await backend.store('analysis-patterns.md', `
# Data Analysis Patterns

## Pattern: Exploratory Data Analysis
1. Check data types and missing values
2. Visualize distributions
3. Identify outliers
4. Examine correlations
      `.trim(), category);

      // Day 2: Add statistical methods
      await backend.append('analysis-patterns.md', `

## Pattern: Statistical Testing
1. Define null and alternative hypotheses
2. Choose appropriate test (t-test, ANOVA, chi-square)
3. Check assumptions
4. Interpret p-values and effect sizes
      `.trim(), category);

      // Day 3: Add machine learning approaches
      await backend.append('analysis-patterns.md', `

## Pattern: Predictive Modeling
1. Split data (train/validation/test)
2. Feature engineering and selection
3. Model selection and hyperparameter tuning
4. Evaluate with appropriate metrics
      `.trim(), category);

      const { content } = await backend.retrieve('analysis-patterns.md', category);

      expect(content).toContain('Exploratory Data Analysis');
      expect(content).toContain('Statistical Testing');
      expect(content).toContain('Predictive Modeling');
    });

    it('should build specialized knowledge for educator personality', async () => {
      const category = 'personalities/educator';

      await backend.store('teaching-strategies.md', `
# Effective Teaching Strategies

## Strategy 1: Scaffolding
Break complex topics into manageable steps.
Build on prior knowledge progressively.

## Strategy 2: Active Learning
Engage students with hands-on activities.
Use problem-based learning approaches.

## Strategy 3: Formative Assessment
Check understanding frequently.
Adjust teaching based on feedback.

## Strategy 4: Multiple Representations
Present concepts visually, verbally, and kinesthetically.
Use analogies and real-world examples.
      `.trim(), category);

      const { content } = await backend.retrieve('teaching-strategies.md', category);

      expect(content).toContain('Scaffolding');
      expect(content).toContain('Active Learning');
      expect(content).toContain('Formative Assessment');
    });
  });

  describe('Multi-Personality Collaboration', () => {
    it('should allow different personalities to work independently', async () => {
      // Technical personality works on code
      await backend.store('api-design.md', 'REST API patterns', 'personalities/technical');

      // Research personality gathers requirements
      await backend.store('user-research.md', 'User needs analysis', 'personalities/research');

      // Creative personality designs UX
      await backend.store('ux-concepts.md', 'Interface mockups', 'personalities/creative');

      // Analyst personality reviews metrics
      await backend.store('kpi-tracking.md', 'Performance metrics', 'personalities/analyst');

      // Verify each personality has its own memory
      const tech = await backend.list('personalities/technical');
      const research = await backend.list('personalities/research');
      const creative = await backend.list('personalities/creative');
      const analyst = await backend.list('personalities/analyst');

      expect(tech.length).toBe(1);
      expect(research.length).toBe(1);
      expect(creative.length).toBe(1);
      expect(analyst.length).toBe(1);
    });
  });

  describe('Real-World Scenario: Multi-Day Development Project', () => {
    it('should maintain personality isolation across multi-day project', async () => {
      // Day 1: Requirements gathering (Research personality)
      await backend.store('requirements.md', `
# Project Requirements - E-Commerce Platform

## User Stories
- As a customer, I want to browse products by category
- As a customer, I want to add items to cart
- As a customer, I want secure checkout

## Non-Functional Requirements
- Support 10,000 concurrent users
- 99.9% uptime
- PCI DSS compliance for payments
      `.trim(), 'personalities/research');

      // Day 2: Technical architecture (Technical personality)
      await backend.store('architecture.md', `
# Technical Architecture

## Tech Stack
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Cache: Redis
- Queue: RabbitMQ

## Services
- auth-service
- product-catalog-service
- cart-service
- payment-service
- order-service
      `.trim(), 'personalities/technical');

      // Day 3: UX Design (Creative personality)
      await backend.store('ux-design.md', `
# UX Design Concepts

## Homepage
- Hero section with featured products
- Category navigation
- Search bar with autocomplete
- Trending products carousel

## Product Page
- Image gallery
- Product details and specs
- Reviews and ratings
- Add to cart CTA
      `.trim(), 'personalities/creative');

      // Day 4: Metrics planning (Analyst personality)
      await backend.store('metrics.md', `
# Key Performance Indicators

## Business Metrics
- Conversion rate
- Average order value
- Cart abandonment rate
- Customer lifetime value

## Technical Metrics
- API response time (p95, p99)
- Error rate
- Database query performance
- Cache hit rate
      `.trim(), 'personalities/analyst');

      // Verify isolation - each personality only sees its own work
      const researchWork = await backend.list('personalities/research');
      const technicalWork = await backend.list('personalities/technical');
      const creativeWork = await backend.list('personalities/creative');
      const analystWork = await backend.list('personalities/analyst');

      expect(researchWork[0].filePath).toContain('requirements.md');
      expect(technicalWork[0].filePath).toContain('architecture.md');
      expect(creativeWork[0].filePath).toContain('ux-design.md');
      expect(analystWork[0].filePath).toContain('metrics.md');

      // No cross-contamination
      expect(researchWork.length).toBe(1);
      expect(technicalWork.length).toBe(1);
      expect(creativeWork.length).toBe(1);
      expect(analystWork.length).toBe(1);
    });
  });
});
