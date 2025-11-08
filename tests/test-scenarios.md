# 🧪 Real-World Test Scenarios

This document defines real-world scenarios for testing the Neko Memory System.

**IMPORTANT**: All test data uses GENERIC/FAKE information only. NO real personal data, credentials, or sensitive information.

## Scenario 1: Software Development Project Memory

**Use Case**: AI assistant helping with a large codebase

**Memory Operations**:
- Store architectural decisions across sessions
- Remember debugging insights from previous sessions
- Track performance optimizations that worked
- Build knowledge about project structure over time

**Expected Benefits**:
- No need to re-explain architecture each session
- Previous bug fixes inform current debugging
- Performance patterns remembered cross-session

## Scenario 2: Research Assistant

**Use Case**: AI conducting multi-day research on a topic

**Memory Operations**:
- Store key findings from multiple sources
- Build interconnected knowledge graph
- Track which sources have been reviewed
- Remember research questions and answers

**Expected Benefits**:
- Context editing clears old search results
- Memory preserves important findings
- No duplicate research on same sources

## Scenario 3: Long-Running Data Analysis

**Use Case**: Processing 100+ files with intermediate results

**Memory Operations**:
- Store intermediate calculation results
- Track processing progress across sessions
- Remember failed/successful data transformations
- Build dataset metadata over time

**Expected Benefits**:
- Resume processing after interruption
- Context editing clears raw data
- Memory preserves aggregate results

## Scenario 4: Multi-Personality AI System

**Use Case**: Different AI personalities handling different tasks

**Memory Operations**:
- Technical personality stores code patterns
- Research personality stores findings
- Creative personality stores ideas
- Each isolated from others

**Expected Benefits**:
- No memory cross-contamination
- Each personality builds specialized knowledge
- Memories remain relevant to personality role

## Scenario 5: 100-Turn Conversation

**Use Case**: Extended task requiring many tool calls

**Memory Operations**:
- Auto-clear stale tool results at 80% capacity
- Preserve critical insights to memory
- Continue working beyond token limits
- Maintain conversation coherence

**Expected Benefits**:
- 84% token reduction from context editing
- Task completes without context exhaustion
- Important data saved before clearing

## Performance Benchmarks to Test

1. **Memory Tool Performance**: +39% improvement vs baseline
2. **Context Editing Performance**: +29% improvement vs baseline
3. **Token Reduction**: 84% reduction in long conversations
4. **Cross-Session Retrieval**: < 100ms for file-based, < 500ms for MongoDB
5. **Memory Operations**: CREATE/READ/UPDATE/DELETE < 50ms each

## Test Data Characteristics

**Generic/Fake Data Only**:
- Fictional project names (e.g., "Acme E-Commerce Platform")
- Placeholder usernames (e.g., "user123", "developer_alice")
- Synthetic code examples (simple functions)
- Generic research topics (e.g., "Climate change impacts")
- Fake database schemas
- Sample architectural patterns

**NO Real Data**:
- ❌ No real personal information
- ❌ No actual credentials
- ❌ No private investigation data
- ❌ No real database URIs
- ❌ No real API keys
