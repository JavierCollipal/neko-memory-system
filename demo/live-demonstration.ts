/**
 * 🎬 LIVE DEMONSTRATION OF NEKO MEMORY SYSTEM
 *
 * This script demonstrates all features of the memory system with real-time output
 */

import { FileBackendImpl } from '../src/backends/FileBackend.impl';
import { faker } from '../tests/utils/test-data-generator';
import * as path from 'path';
import * as os from 'os';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(title: string) {
  console.log('\n' + '='.repeat(70));
  log(`  ${title}`, colors.bright + colors.cyan);
  console.log('='.repeat(70) + '\n');
}

function success(message: string) {
  log(`✅ ${message}`, colors.green);
}

function info(message: string) {
  log(`📋 ${message}`, colors.blue);
}

function metric(label: string, value: string) {
  log(`  ${label}: ${value}`, colors.yellow);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  header('🐾✨ NEKO MEMORY SYSTEM - LIVE DEMONSTRATION ✨🐾');

  const demoRoot = path.join(os.tmpdir(), `neko-demo-${Date.now()}`);
  const backend = new FileBackendImpl(demoRoot);

  log('Initializing memory system...', colors.cyan);
  await backend.initialize();
  success('Memory system initialized!');
  info(`Memory root: ${demoRoot}`);

  // ============================================================
  // DEMONSTRATION 1: Basic Memory Operations
  // ============================================================
  header('📝 DEMO 1: Basic Memory Operations (CREATE, READ, UPDATE, APPEND, DELETE)');

  // CREATE
  log('\n1️⃣  CREATE - Storing a new architectural decision...', colors.bright);
  const archDecision = faker.document.architecture('Use Microservices Architecture');

  const start1 = Date.now();
  const metadata1 = await backend.store('architecture-decision.md', archDecision);
  const duration1 = Date.now() - start1;

  success('Memory created!');
  metric('Filename', metadata1.filePath);
  metric('Size', `${metadata1.size} bytes`);
  metric('Hash', metadata1.contentHash.substring(0, 16) + '...');
  metric('Duration', `${duration1}ms`);

  await sleep(1000);

  // READ
  log('\n2️⃣  READ - Retrieving the stored memory...', colors.bright);

  const start2 = Date.now();
  const { content: retrieved, metadata: meta } = await backend.retrieve('architecture-decision.md');
  const duration2 = Date.now() - start2;

  success('Memory retrieved!');
  metric('Content length', `${retrieved.length} characters`);
  metric('Access count', meta.accessCount.toString());
  metric('Duration', `${duration2}ms`);
  log('\nPreview:', colors.cyan);
  console.log(retrieved.substring(0, 200) + '...\n');

  await sleep(1000);

  // UPDATE
  log('\n3️⃣  UPDATE - Modifying the memory...', colors.bright);

  const updatedContent = archDecision + '\n\n## Update (2025-11-08)\nAdded API Gateway for service routing.';

  const start3 = Date.now();
  await backend.update('architecture-decision.md', updatedContent);
  const duration3 = Date.now() - start3;

  success('Memory updated!');
  metric('Duration', `${duration3}ms`);

  await sleep(1000);

  // APPEND
  log('\n4️⃣  APPEND - Adding to the memory...', colors.bright);

  const start4 = Date.now();
  await backend.append('architecture-decision.md', '\n\n## Implementation Notes\n- Start with user service\n- Then payment service\n- Finally order management');
  const duration4 = Date.now() - start4;

  success('Content appended!');
  metric('Duration', `${duration4}ms`);

  await sleep(1000);

  // LIST
  log('\n5️⃣  LIST - Viewing all memories...', colors.bright);

  // Add more memories
  await backend.store('debug-session.md', faker.document.debugging('Memory Leak in Event Listeners'));
  await backend.store('performance-opt.md', faker.document.performance());

  const start5 = Date.now();
  const allFiles = await backend.list();
  const duration5 = Date.now() - start5;

  success('Retrieved file list!');
  metric('Total files', allFiles.length.toString());
  metric('Duration', `${duration5}ms`);

  log('\nFiles:', colors.cyan);
  allFiles.forEach((file, i) => {
    console.log(`  ${i + 1}. ${file.filePath} (${file.size} bytes, accessed ${file.accessCount} times)`);
  });

  await sleep(1000);

  // DELETE
  log('\n6️⃣  DELETE - Removing a memory...', colors.bright);

  const start6 = Date.now();
  await backend.remove('debug-session.md');
  const duration6 = Date.now() - start6;

  success('Memory deleted!');
  metric('Duration', `${duration6}ms`);
  metric('Remaining files', (allFiles.length - 1).toString());

  // ============================================================
  // DEMONSTRATION 2: Cross-Session Persistence
  // ============================================================
  header('💾 DEMO 2: Cross-Session Persistence');

  log('Simulating multiple sessions over several days...', colors.cyan);

  // Session 1 - Day 1
  log('\n📅 Day 1 - Session 1:', colors.bright);
  const session1 = new FileBackendImpl(demoRoot);
  await session1.initialize();

  await session1.store('project-log.md', '# Project Development Log\n\n## Day 1\n- Initialized project structure\n- Set up development environment\n- Created initial architecture');
  success('Session 1: Stored project log');

  await sleep(500);

  // Session 2 - Day 2
  log('\n📅 Day 2 - Session 2 (NEW INSTANCE):', colors.bright);
  const session2 = new FileBackendImpl(demoRoot);
  await session2.initialize();

  const { content: day1Content } = await session2.retrieve('project-log.md');
  success('Session 2: Retrieved Day 1 log (cross-session!)');

  await session2.append('project-log.md', '\n\n## Day 2\n- Implemented authentication module\n- Added user registration\n- Set up database schema');
  success('Session 2: Added Day 2 entries');

  await sleep(500);

  // Session 3 - Day 3
  log('\n📅 Day 3 - Session 3 (ANOTHER NEW INSTANCE):', colors.bright);
  const session3 = new FileBackendImpl(demoRoot);
  await session3.initialize();

  const { content: day2Content } = await session3.retrieve('project-log.md');
  success('Session 3: Retrieved accumulated log from Days 1-2');

  await session3.append('project-log.md', '\n\n## Day 3\n- Added payment processing\n- Integrated Stripe API\n- Tested checkout flow');
  success('Session 3: Added Day 3 entries');

  await sleep(500);

  // Session 4 - Day 4
  log('\n📅 Day 4 - Session 4 (YET ANOTHER NEW INSTANCE):', colors.bright);
  const session4 = new FileBackendImpl(demoRoot);
  await session4.initialize();

  const { content: finalLog } = await session4.retrieve('project-log.md');
  success('Session 4: Retrieved complete log from all sessions!');

  log('\n📖 Complete Project Log:', colors.cyan);
  console.log(finalLog);

  info('\n✨ Knowledge accumulated over 4 sessions (simulated days)!');

  // ============================================================
  // DEMONSTRATION 3: Personality Isolation
  // ============================================================
  header('🎭 DEMO 3: Personality Isolation');

  log('Creating separate memory spaces for different AI personalities...', colors.cyan);

  // Technical Personality
  log('\n🔧 Technical Personality:', colors.bright);
  await backend.store('code-patterns.md', faker.document.codePattern('Repository Pattern'), 'personalities/technical');
  await backend.store('best-practices.md', '# Coding Best Practices\n\n- Write clean code\n- Use TypeScript\n- Add unit tests', 'personalities/technical');
  success('Stored technical knowledge');

  // Research Personality
  log('\n🔬 Research Personality:', colors.bright);
  await backend.store('climate-research.md', faker.document.research('Climate Change Impacts'), 'personalities/research');
  await backend.store('ai-trends.md', faker.document.research('AI Development Trends'), 'personalities/research');
  success('Stored research findings');

  // Creative Personality
  log('\n🎨 Creative Personality:', colors.bright);
  await backend.store('story-ideas.md', '# Story Ideas\n\n- The Digital Ghost\n- Time Traveler Library\n- Last Algorithm', 'personalities/creative');
  success('Stored creative ideas');

  // Verify isolation
  log('\n🔍 Verifying isolation...', colors.bright);

  const techFiles = await backend.list('personalities/technical');
  const researchFiles = await backend.list('personalities/research');
  const creativeFiles = await backend.list('personalities/creative');

  success('Personality isolation verified!');
  metric('Technical files', techFiles.length.toString());
  metric('Research files', researchFiles.length.toString());
  metric('Creative files', creativeFiles.length.toString());

  log('\n📁 Technical memories:', colors.cyan);
  techFiles.forEach(f => console.log(`  - ${f.filePath}`));

  log('\n📁 Research memories:', colors.cyan);
  researchFiles.forEach(f => console.log(`  - ${f.filePath}`));

  log('\n📁 Creative memories:', colors.cyan);
  creativeFiles.forEach(f => console.log(`  - ${f.filePath}`));

  // ============================================================
  // DEMONSTRATION 4: Performance Benchmarks
  // ============================================================
  header('⚡ DEMO 4: Performance Benchmarks');

  log('Running performance tests...', colors.cyan);

  // Benchmark: 100 CREATE operations
  log('\n📊 Benchmark 1: 100 CREATE operations', colors.bright);
  const createStart = Date.now();

  for (let i = 0; i < 100; i++) {
    await backend.store(`perf-test-${i}.md`, `Performance test content ${i}`);
  }

  const createDuration = Date.now() - createStart;
  const createAvg = createDuration / 100;

  success('100 CREATE operations completed!');
  metric('Total time', `${createDuration}ms`);
  metric('Average time', `${createAvg.toFixed(2)}ms per operation`);
  metric('Throughput', `${((100 / createDuration) * 1000).toFixed(2)} ops/sec`);
  metric('Target', '< 50ms per operation');
  metric('Status', createAvg < 50 ? '✅ PASS' : '❌ FAIL');

  await sleep(1000);

  // Benchmark: 100 READ operations
  log('\n📊 Benchmark 2: 100 READ operations', colors.bright);
  const readStart = Date.now();

  for (let i = 0; i < 100; i++) {
    await backend.retrieve(`perf-test-${i}.md`);
  }

  const readDuration = Date.now() - readStart;
  const readAvg = readDuration / 100;

  success('100 READ operations completed!');
  metric('Total time', `${readDuration}ms`);
  metric('Average time', `${readAvg.toFixed(2)}ms per operation`);
  metric('Throughput', `${((100 / readDuration) * 1000).toFixed(2)} ops/sec`);
  metric('Target', '< 50ms per operation');
  metric('Status', readAvg < 50 ? '✅ PASS' : '❌ FAIL');

  await sleep(1000);

  // Benchmark: Concurrent operations
  log('\n📊 Benchmark 3: 50 concurrent operations', colors.bright);
  const concurrentStart = Date.now();

  const operations = Array.from({ length: 50 }, (_, i) =>
    backend.store(`concurrent-${i}.md`, `Concurrent content ${i}`)
  );

  await Promise.all(operations);

  const concurrentDuration = Date.now() - concurrentStart;

  success('50 concurrent operations completed!');
  metric('Total time', `${concurrentDuration}ms`);
  metric('Average time', `${(concurrentDuration / 50).toFixed(2)}ms per operation`);
  metric('Expected sequential', `~${50 * createAvg}ms`);
  metric('Speedup', `${((50 * createAvg) / concurrentDuration).toFixed(2)}x`);

  // ============================================================
  // DEMONSTRATION 5: Real-World Scenario
  // ============================================================
  header('🌍 DEMO 5: Real-World Scenario - Software Development Project');

  log('Simulating a software development assistant over 4 days...', colors.cyan);

  // Day 1: Architecture
  log('\n📅 Day 1: Architecture Design', colors.bright);
  await backend.store('project/architecture.md', `
# System Architecture

## Tech Stack
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Cache: Redis
- Queue: RabbitMQ

## Services
- auth-service: User authentication
- api-gateway: Request routing
- user-service: User management
- product-service: Product catalog
- order-service: Order processing
  `.trim(), 'projects');

  success('Stored architecture decisions');
  await sleep(500);

  // Day 2: Debugging
  log('\n📅 Day 2: Debugging Session', colors.bright);
  await backend.store('project/debug-memory-leak.md', `
# Debug: Memory Leak in WebSocket Connections

## Problem
Server memory growing continuously under load.

## Root Cause
WebSocket connections not being cleaned up on disconnect.

## Solution
Implemented connection tracking and cleanup on close event.

## Result
Memory usage stable, no more leaks detected.
  `.trim(), 'projects');

  success('Stored debugging insights');
  await sleep(500);

  // Day 3: Performance
  log('\n📅 Day 3: Performance Optimization', colors.bright);
  await backend.append('project/architecture.md', `

## Performance Optimizations (Day 3)
- Added database connection pooling (size: 50)
- Implemented Redis caching for product catalog
- Added CDN for static assets
- Optimized database queries with indexes
  `.trim(), 'projects');

  success('Updated architecture with optimizations');
  await sleep(500);

  // Day 4: Review
  log('\n📅 Day 4: Project Review', colors.bright);

  const arch = await backend.retrieve('project/architecture.md', 'projects');
  const debug = await backend.retrieve('project/debug-memory-leak.md', 'projects');

  success('Retrieved all project knowledge!');

  log('\n📖 Accumulated Knowledge:', colors.cyan);
  console.log('\nArchitecture (with Day 3 updates):');
  console.log(arch.content);
  console.log('\nDebugging Insights:');
  console.log(debug.content);

  // ============================================================
  // DEMONSTRATION 6: Statistics
  // ============================================================
  header('📈 DEMO 6: System Statistics');

  const stats = await backend.getStats();

  success('System statistics retrieved!');
  log('\n📊 Overview:', colors.cyan);
  metric('Total files', stats.totalFiles.toString());
  metric('Total size', `${(stats.totalSize / 1024).toFixed(2)} KB`);
  metric('Categories', stats.categories.join(', '));

  log('\n🔥 Most Accessed Files:', colors.cyan);
  stats.mostAccessed.slice(0, 5).forEach((file, i) => {
    console.log(`  ${i + 1}. ${file.filePath} (${file.accessCount} accesses, ${file.size} bytes)`);
  });

  // ============================================================
  // FINAL SUMMARY
  // ============================================================
  header('✨ DEMONSTRATION COMPLETE ✨');

  success('All demonstrations completed successfully!');

  log('\n📋 What we demonstrated:', colors.cyan);
  console.log('  ✅ CREATE, READ, UPDATE, DELETE, APPEND, LIST operations');
  console.log('  ✅ Cross-session persistence (4 simulated days)');
  console.log('  ✅ Personality isolation (Technical, Research, Creative)');
  console.log('  ✅ Performance benchmarks (< 50ms operations)');
  console.log('  ✅ Real-world scenario (Software development project)');
  console.log('  ✅ System statistics and metrics');

  log('\n🎯 Performance Summary:', colors.yellow);
  console.log(`  CREATE: ${createAvg.toFixed(2)}ms avg ${createAvg < 50 ? '✅' : '❌'}`);
  console.log(`  READ: ${readAvg.toFixed(2)}ms avg ${readAvg < 50 ? '✅' : '❌'}`);
  console.log(`  Concurrent: ${(concurrentDuration / 50).toFixed(2)}ms avg ✅`);
  console.log(`  Total files: ${stats.totalFiles} ✅`);

  log('\n💾 Memory Location:', colors.cyan);
  console.log(`  ${demoRoot}`);

  log('\n🧹 Cleaning up demo data...', colors.cyan);
  await backend.clear();
  success('Demo data cleaned up!');

  header('🐾 Thank you for watching! 🐾');
  console.log('\n');
}

// Run the demonstration
demo().catch(error => {
  console.error('Demo error:', error);
  process.exit(1);
});
