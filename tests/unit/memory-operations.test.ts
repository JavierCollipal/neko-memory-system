/**
 * Memory Operations Tests
 *
 * Tests CREATE, READ, UPDATE, DELETE, APPEND, LIST operations
 * Uses GENERIC/FAKE data only - NO real personal information
 */

import { FileBackendImpl } from '../../src/backends/FileBackend.impl';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs/promises';

describe('Memory Operations', () => {
  let backend: FileBackendImpl;
  let testMemoryRoot: string;

  beforeEach(async () => {
    // Create temporary test directory
    testMemoryRoot = path.join(os.tmpdir(), `neko-memory-test-${Date.now()}`);
    backend = new FileBackendImpl(testMemoryRoot);
    await backend.initialize();
  });

  afterEach(async () => {
    // Clean up test directory
    await backend.clear();
  });

  describe('CREATE Operation', () => {
    it('should create a new memory file', async () => {
      const filename = 'test-decision.md';
      const content = `
# Architectural Decision: Use TypeScript

## Context
We need type safety for our large codebase.

## Decision
Adopt TypeScript for all new code.

## Rationale
- Better IDE support
- Catch errors at compile time
- Improved maintainability
      `.trim();

      const metadata = await backend.store(filename, content);

      expect(metadata.filePath).toContain(filename);
      expect(metadata.contentHash).toBeDefined();
      expect(metadata.size).toBeGreaterThan(0);
      expect(metadata.accessCount).toBe(0);
    });

    it('should create memories in different categories', async () => {
      await backend.store('system-note.md', 'System memory', 'system');
      await backend.store('personal-note.md', 'Personal memory', 'personalities');
      await backend.store('project-note.md', 'Project memory', 'projects');

      const systemFiles = await backend.list('system');
      const personalityFiles = await backend.list('personalities');
      const projectFiles = await backend.list('projects');

      expect(systemFiles.length).toBe(1);
      expect(personalityFiles.length).toBe(1);
      expect(projectFiles.length).toBe(1);
    });

    it('should handle large content (10KB+)', async () => {
      const largeContent = 'A'.repeat(10000);
      const metadata = await backend.store('large-file.md', largeContent);

      expect(metadata.size).toBeGreaterThan(10000);
    });
  });

  describe('READ Operation', () => {
    it('should retrieve stored memory', async () => {
      const filename = 'debugging-insight.md';
      const content = `
# Debugging Insight: Memory Leak in Event Listeners

## Problem
Application was consuming excessive memory over time.

## Root Cause
Event listeners were not being removed when components unmounted.

## Solution
Implemented cleanup in useEffect hooks.

## Result
Memory usage reduced by 60%.
      `.trim();

      await backend.store(filename, content);
      const { content: retrieved, metadata } = await backend.retrieve(filename);

      expect(retrieved).toBe(content);
      expect(metadata.accessCount).toBe(1);
    });

    it('should increment access count on each read', async () => {
      await backend.store('test.md', 'Test content');

      await backend.retrieve('test.md');
      const { metadata: meta1 } = await backend.retrieve('test.md');
      const { metadata: meta2 } = await backend.retrieve('test.md');

      expect(meta2.accessCount).toBeGreaterThan(meta1.accessCount);
    });

    it('should throw error for non-existent file', async () => {
      await expect(backend.retrieve('non-existent.md')).rejects.toThrow('not found');
    });
  });

  describe('UPDATE Operation', () => {
    it('should update existing memory', async () => {
      const filename = 'performance-note.md';
      const originalContent = 'Original optimization note';
      const updatedContent = 'Updated optimization note with new findings';

      await backend.store(filename, originalContent);
      const metadata = await backend.update(filename, updatedContent);

      const { content } = await backend.retrieve(filename);

      expect(content).toBe(updatedContent);
      expect(metadata.contentHash).not.toBe(
        require('crypto').createHash('sha256').update(originalContent).digest('hex')
      );
    });

    it('should throw error when updating non-existent file', async () => {
      await expect(backend.update('non-existent.md', 'content')).rejects.toThrow();
    });
  });

  describe('APPEND Operation', () => {
    it('should append content to existing memory', async () => {
      const filename = 'research-findings.md';
      const initialContent = '# Research Findings\n\n## Finding 1\nInitial discovery';
      const appendContent = '## Finding 2\nAdditional discovery';

      await backend.store(filename, initialContent);
      await backend.append(filename, appendContent);

      const { content } = await backend.retrieve(filename);

      expect(content).toContain('Finding 1');
      expect(content).toContain('Finding 2');
    });
  });

  describe('DELETE Operation', () => {
    it('should delete memory file', async () => {
      const filename = 'temp-note.md';
      await backend.store(filename, 'Temporary content');

      await backend.remove(filename);

      await expect(backend.retrieve(filename)).rejects.toThrow('not found');
    });

    it('should throw error when deleting non-existent file', async () => {
      await expect(backend.remove('non-existent.md')).rejects.toThrow();
    });
  });

  describe('LIST Operation', () => {
    it('should list all memories', async () => {
      await backend.store('note1.md', 'Content 1');
      await backend.store('note2.md', 'Content 2');
      await backend.store('note3.md', 'Content 3');

      const files = await backend.list();

      expect(files.length).toBeGreaterThanOrEqual(3);
    });

    it('should list memories by category', async () => {
      await backend.store('sys1.md', 'System 1', 'system');
      await backend.store('sys2.md', 'System 2', 'system');
      await backend.store('proj1.md', 'Project 1', 'projects');

      const systemFiles = await backend.list('system');
      const projectFiles = await backend.list('projects');

      expect(systemFiles.length).toBe(2);
      expect(projectFiles.length).toBe(1);
    });

    it('should sort by most recent first', async () => {
      await backend.store('old.md', 'Old content');
      await new Promise(resolve => setTimeout(resolve, 10));
      await backend.store('new.md', 'New content');

      const files = await backend.list();

      expect(files[0].filePath).toContain('new.md');
    });
  });

  describe('Performance', () => {
    it('should complete CREATE operation in < 50ms', async () => {
      const start = Date.now();
      await backend.store('perf-test.md', 'Performance test content');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(50);
    });

    it('should complete READ operation in < 50ms', async () => {
      await backend.store('perf-test.md', 'Performance test content');

      const start = Date.now();
      await backend.retrieve('perf-test.md');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(50);
    });

    it('should handle 100 concurrent operations', async () => {
      const operations = Array.from({ length: 100 }, (_, i) =>
        backend.store(`concurrent-${i}.md`, `Content ${i}`)
      );

      await expect(Promise.all(operations)).resolves.toBeDefined();

      const files = await backend.list();
      expect(files.length).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Statistics', () => {
    it('should provide accurate statistics', async () => {
      await backend.store('file1.md', 'A'.repeat(100));
      await backend.store('file2.md', 'B'.repeat(200));

      const stats = await backend.getStats();

      expect(stats.totalFiles).toBeGreaterThanOrEqual(2);
      expect(stats.totalSize).toBeGreaterThanOrEqual(300);
      expect(stats.categories).toContain('system');
    });

    it('should track most accessed files', async () => {
      await backend.store('popular.md', 'Popular content');
      await backend.store('unpopular.md', 'Unpopular content');

      // Access popular file multiple times
      for (let i = 0; i < 5; i++) {
        await backend.retrieve('popular.md');
      }

      const stats = await backend.getStats();
      const topFile = stats.mostAccessed[0];

      expect(topFile.filePath).toContain('popular.md');
      expect(topFile.accessCount).toBeGreaterThanOrEqual(5);
    });
  });
});
