/**
 * Cross-Session Persistence Tests
 *
 * Tests that memories persist across different sessions
 * Simulates stopping and restarting the system
 */

import { FileBackendImpl } from '../../src/backends/FileBackend.impl';
import * as path from 'path';
import * as os from 'os';

describe('Cross-Session Persistence', () => {
  let testMemoryRoot: string;

  beforeAll(() => {
    testMemoryRoot = path.join(os.tmpdir(), `neko-session-test-${Date.now()}`);
  });

  afterAll(async () => {
    // Clean up
    const backend = new FileBackendImpl(testMemoryRoot);
    await backend.clear();
  });

  it('should persist memories across sessions (Session 1: Store)', async () => {
    // Simulate Session 1
    const session1 = new FileBackendImpl(testMemoryRoot);
    await session1.initialize();

    // Store architectural decisions
    await session1.store('arch-decision-1.md', `
# Decision: Microservices Architecture

## Date
2025-11-08

## Context
Need to scale different parts of the application independently.

## Decision
Adopt microservices architecture with separate services for:
- User authentication
- Payment processing
- Order management
- Inventory tracking

## Expected Benefits
- Independent scaling
- Technology flexibility per service
- Isolated failure domains
    `.trim());

    // Store debugging insights
    await session1.store('debug-insight-1.md', `
# Debugging: Database Connection Pool Exhaustion

## Problem
Application hanging under load.

## Root Cause
Database connection pool size set to default (10).

## Solution
Increased pool size to 50, added connection timeout monitoring.

## Result
Application handles 5x more concurrent requests.
    `.trim());

    const stats = await session1.getStats();
    expect(stats.totalFiles).toBeGreaterThanOrEqual(2);
  });

  it('should retrieve memories in new session (Session 2: Retrieve)', async () => {
    // Simulate Session 2 - completely new instance
    const session2 = new FileBackendImpl(testMemoryRoot);
    await session2.initialize();

    // Retrieve memories from Session 1
    const { content: archDecision } = await session2.retrieve('arch-decision-1.md');
    const { content: debugInsight } = await session2.retrieve('debug-insight-1.md');

    expect(archDecision).toContain('Microservices Architecture');
    expect(archDecision).toContain('2025-11-08');
    expect(debugInsight).toContain('Database Connection Pool');

    const stats = await session2.getStats();
    expect(stats.totalFiles).toBeGreaterThanOrEqual(2);
  });

  it('should update memories in third session (Session 3: Update)', async () => {
    // Simulate Session 3 - another new instance
    const session3 = new FileBackendImpl(testMemoryRoot);
    await session3.initialize();

    // Append new findings to existing memory
    await session3.append('debug-insight-1.md', `

## Follow-up (2025-11-08)
Added connection pool monitoring dashboard.
Implemented alerts for pool utilization > 80%.
    `.trim());

    const { content: updated } = await session3.retrieve('debug-insight-1.md');

    expect(updated).toContain('Database Connection Pool');
    expect(updated).toContain('Follow-up (2025-11-08)');
    expect(updated).toContain('monitoring dashboard');
  });

  it('should maintain access counts across sessions', async () => {
    const session4 = new FileBackendImpl(testMemoryRoot);
    await session4.initialize();

    // Access the same file multiple times
    await session4.retrieve('arch-decision-1.md');
    await session4.retrieve('arch-decision-1.md');
    await session4.retrieve('arch-decision-1.md');

    const stats = await session4.getStats();
    const archFile = stats.mostAccessed.find(f => f.filePath.includes('arch-decision-1.md'));

    expect(archFile).toBeDefined();
    expect(archFile!.accessCount).toBeGreaterThan(0);
  });

  it('should handle session crash and recovery', async () => {
    const session5 = new FileBackendImpl(testMemoryRoot);
    await session5.initialize();

    // Store important data
    await session5.store('critical-data.md', 'Very important information');

    // Simulate crash - don't clean up properly
    // Just abandon the session

    // New session should still retrieve the data
    const session6 = new FileBackendImpl(testMemoryRoot);
    await session6.initialize();

    const { content } = await session6.retrieve('critical-data.md');
    expect(content).toBe('Very important information');
  });

  it('should build knowledge over multiple sessions', async () => {
    // Session 1: Initial knowledge
    const s1 = new FileBackendImpl(testMemoryRoot);
    await s1.initialize();
    await s1.store('project-knowledge.md', '# Project Knowledge\n\n## Day 1\nInitialized project structure');

    // Session 2: Add more knowledge
    const s2 = new FileBackendImpl(testMemoryRoot);
    await s2.initialize();
    await s2.append('project-knowledge.md', '\n\n## Day 2\nImplemented authentication module');

    // Session 3: Add even more
    const s3 = new FileBackendImpl(testMemoryRoot);
    await s3.initialize();
    await s3.append('project-knowledge.md', '\n\n## Day 3\nAdded payment processing');

    // Session 4: Verify accumulated knowledge
    const s4 = new FileBackendImpl(testMemoryRoot);
    await s4.initialize();
    const { content } = await s4.retrieve('project-knowledge.md');

    expect(content).toContain('Day 1');
    expect(content).toContain('Day 2');
    expect(content).toContain('Day 3');
    expect(content).toContain('project structure');
    expect(content).toContain('authentication');
    expect(content).toContain('payment');
  });
});
