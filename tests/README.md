## 🧪 Test Framework for Neko Memory System

Comprehensive test suite validating the memory system's efficiency with real-world scenarios.

## 📋 Test Structure

```
tests/
├── unit/                          # Unit tests for individual components
│   └── memory-operations.test.ts  # CREATE, READ, UPDATE, DELETE, APPEND, LIST
├── integration/                   # Integration tests for complex scenarios
│   ├── cross-session.test.ts      # Cross-session persistence
│   └── personality-isolation.test.ts # Personality memory isolation
├── benchmarks/                    # Performance benchmarks
│   └── performance.bench.ts       # Validate 39% and 84% improvement claims
├── utils/                         # Test utilities
│   └── test-data-generator.ts     # Generate fake/generic test data
└── test-scenarios.md              # Real-world test scenarios documentation
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run Performance Benchmarks
```bash
npm test -- tests/benchmarks
```

### Run with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- tests/unit/memory-operations.test.ts
```

### Watch Mode (for development)
```bash
npm test -- --watch
```

## 📊 Test Scenarios

### 1. Memory Operations (Unit Tests)

**Purpose**: Validate basic CRUD operations

**Tests**:
- ✅ CREATE: Store new memories
- ✅ READ: Retrieve stored memories
- ✅ UPDATE: Modify existing memories
- ✅ DELETE: Remove memories
- ✅ APPEND: Add to existing memories
- ✅ LIST: Query memories by category

**Performance Requirements**:
- Each operation < 50ms
- 100 concurrent operations supported
- Handle files up to 1MB+

**Example**:
```typescript
const backend = new FileBackendImpl('/path/to/memories');
await backend.initialize();

// CREATE
await backend.store('decision.md', 'Use TypeScript');

// READ
const { content } = await backend.retrieve('decision.md');

// UPDATE
await backend.update('decision.md', 'Use TypeScript with strict mode');

// APPEND
await backend.append('decision.md', '\n\nAdded ESLint');

// DELETE
await backend.remove('decision.md');

// LIST
const files = await backend.list('system');
```

### 2. Cross-Session Persistence (Integration Tests)

**Purpose**: Verify memories persist across system restarts

**Tests**:
- ✅ Session 1: Store memories
- ✅ Session 2: Retrieve memories (new instance)
- ✅ Session 3: Update memories (another new instance)
- ✅ Session 4+: Continue building knowledge
- ✅ Crash recovery

**Scenario**: Software development project spanning multiple days
- Day 1: Store architectural decisions
- Day 2: Add debugging insights (new session)
- Day 3: Reference previous work (new session)
- Day 4: Build on accumulated knowledge

**Example**:
```typescript
// Session 1
const session1 = new FileBackendImpl(memoryRoot);
await session1.initialize();
await session1.store('arch.md', 'Microservices architecture');

// Session 2 (simulated restart)
const session2 = new FileBackendImpl(memoryRoot);
await session2.initialize();
const { content } = await session2.retrieve('arch.md'); // Still there!
```

### 3. Personality Isolation (Integration Tests)

**Purpose**: Validate separate memory spaces for different AI personalities

**Tests**:
- ✅ Technical personality: Code patterns, debugging
- ✅ Research personality: Findings, sources
- ✅ Creative personality: Ideas, concepts
- ✅ Analyst personality: Data analysis, metrics
- ✅ No cross-contamination between personalities

**Scenario**: Multi-personality AI system
- Technical stores coding patterns
- Research stores findings
- Creative stores ideas
- Each isolated from others

**Example**:
```typescript
// Technical personality
await backend.store('patterns.md', 'Repository pattern', 'personalities/technical');

// Research personality
await backend.store('findings.md', 'Climate data', 'personalities/research');

// List only research memories - won't see technical
const researchFiles = await backend.list('personalities/research');
// Returns only findings.md
```

### 4. Performance Benchmarks

**Purpose**: Validate Anthropic's performance improvement claims

**Tests**:
- ✅ 1000 CREATE operations
- ✅ 1000 READ operations
- ✅ 1000 UPDATE operations
- ✅ 10,000 file scalability
- ✅ 100 concurrent operations
- ✅ Large files (1MB+)
- ✅ Context editing simulation (100-turn conversation)

**Performance Targets** (from Anthropic):
- Memory + Context Editing: +39% improvement
- Context Editing alone: +29% improvement
- Token reduction: 84% in 100-turn evaluations
- Operation latency: < 50ms per operation

**Example Output**:
```
📊 CREATE Benchmark:
- Operations: 1000
- Total Time: 2453ms
- Avg Time: 2.45ms per operation
- Throughput: 407.67 ops/sec

📊 Scalability Test (10k memories):
- Create Time: 15234ms (1.52ms per file)
- Read Time: 3421ms for 1000 random reads (3.42ms per read)
- Total Memories: 10000

📊 Simulating 100-turn conversation with context editing:
✅ Turn 10: Saved important insight to memory
✅ Turn 20: Saved important insight to memory
⚠️  Turn 80: Context threshold reached (80%)
🧹 Clearing stale tool results...
💾 Important insights preserved in memory: 8
✅ All 8 insights successfully retrieved!
```

## 🔬 Real-World Scenarios Tested

### Scenario 1: Software Development Assistant
**Workload**:
- Store architectural decisions
- Track debugging insights across sessions
- Build performance optimization knowledge
- Reference previous work in new sessions

**Duration**: 4 simulated days
**Operations**: 11 (stores, reads, updates, appends)
**Expected**: < 1000ms total

### Scenario 2: Research Assistant
**Workload**:
- Review multiple research sources
- Build accumulated summary
- Cross-reference findings
- Knowledge building over time

**Duration**: 3 simulated sessions
**Operations**: 5 sources + summary building
**Expected**: < 1000ms total

### Scenario 3: Long-Running Data Analysis
**Workload**:
- Process 100 data files
- Store intermediate results
- Resume after interruption
- Aggregate final results

**Expected**: Context editing prevents exhaustion

### Scenario 4: 100-Turn Conversation
**Workload**:
- 100 tool calls generating data
- Auto-save important insights every 10 turns
- Context clearing at 80% threshold
- Verify all saved insights retrievable

**Expected**: 84% token reduction vs. baseline

## 📈 Test Data

All test data is **GENERIC/FAKE** - NO real personal information:

- **Project names**: "Modern E-Commerce Platform", "Agile Analytics Suite"
- **Usernames**: "user123", "dev4567", "test8910"
- **Emails**: "user123@example.com", "test@demo.org"
- **Content**: Generic architectural decisions, debugging insights, research findings

**Example Test Data Generation**:
```typescript
import { faker } from './utils/test-data-generator';

// Generate fake documents
const archDecision = faker.document.architecture('Use TypeScript');
const debugInsight = faker.document.debugging('Memory Leak');
const researchNote = faker.document.research('Climate Change');

// Generate fake metadata
const projectName = faker.project.name(); // "Modern Analytics Platform"
const username = faker.user.username(); // "dev4523"
const email = faker.user.email(); // "dev4523@example.com"
```

## ✅ Test Coverage Goals

- **Unit Tests**: > 80% code coverage
- **Integration Tests**: All major user flows
- **Performance Tests**: All claimed metrics validated
- **Real-World Scenarios**: 4+ scenarios tested

## 🐛 Debugging Tests

### Enable Verbose Output
```bash
npm test -- --verbose
```

### Run Single Test
```bash
npm test -- --testNamePattern="should create a new memory file"
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## 📝 Writing New Tests

### Test Template
```typescript
import { FileBackendImpl } from '../../src/backends/FileBackend.impl';
import { faker } from '../utils/test-data-generator';

describe('My New Feature', () => {
  let backend: FileBackendImpl;

  beforeEach(async () => {
    backend = new FileBackendImpl('/tmp/test');
    await backend.initialize();
  });

  afterEach(async () => {
    await backend.clear();
  });

  it('should do something useful', async () => {
    // Arrange
    const testData = faker.document.architecture('Test');

    // Act
    await backend.store('test.md', testData);

    // Assert
    const { content } = await backend.retrieve('test.md');
    expect(content).toBe(testData);
  });
});
```

## 🔒 Security Note

**CRITICAL**: All tests use ONLY generic/fake data:
- ❌ NO real credentials
- ❌ NO real personal information
- ❌ NO real database URIs
- ❌ NO sensitive investigation data

Tests are designed to be safely committed to public repositories.

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Jest Setup](https://jestjs.io/docs/getting-started#via-ts-jest)
- [Test Scenarios Document](./test-scenarios.md)
- [Anthropic Context Management](https://www.anthropic.com/news/context-management)

---

**Happy Testing!** 🧪✨
