/**
 * Neko Memory System - Main Entry Point
 *
 * Persistent memory and context management for Claude AI
 * Based on Anthropic's memory tool and context editing features
 *
 * @see https://www.anthropic.com/news/context-management
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Memory operation types
 */
export enum MemoryOperation {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  RENAME = 'rename',
  VIEW = 'view'
}

/**
 * Backend types
 */
export enum BackendType {
  FILE = 'file',
  MONGODB = 'mongodb',
  HYBRID = 'hybrid'
}

/**
 * Memory metadata
 */
export interface MemoryMetadata {
  filePath: string;
  personality?: string;
  contentHash: string;
  lastUpdated: Date;
  accessCount: number;
  tags?: string[];
}

/**
 * Memory content
 */
export interface Memory {
  metadata: MemoryMetadata;
  content: string;
}

/**
 * Context usage statistics
 */
export interface ContextUsage {
  totalTokens: number;
  usedTokens: number;
  percent: number;
  toolCallsCount: number;
  thinkingBlocksCount: number;
}

/**
 * Memory system configuration
 */
export interface MemoryConfig {
  backend: BackendType;
  memoryRoot: string;
  mongodbUri?: string;
  database?: string;
  personalityIsolation?: boolean;
  encryptionEnabled?: boolean;
}

/**
 * Context editing configuration
 */
export interface ContextConfig {
  betaHeader: string;
  strategies: {
    toolResultClearing: string;
    thinkingBlockClearing: string;
  };
  thresholds: {
    contextUsagePercent: number;
    minRetainedTools: number;
  };
  autoSave: {
    enabled: boolean;
    saveToMemory: string[];
  };
}

/**
 * Main entry point - Example usage
 */
export async function main() {
  console.log('🧠💾 Neko Memory System');
  console.log('========================\n');

  console.log('Configuration:');
  console.log(`- Backend: ${process.env.MEMORY_BACKEND || 'file'}`);
  console.log(`- Memory Root: ${process.env.MEMORY_ROOT || 'Not set'}`);
  console.log(`- Context Editing: ${process.env.CONTEXT_EDITING_ENABLED || 'false'}`);
  console.log(`- Personality Isolation: ${process.env.PERSONALITY_ISOLATION || 'false'}`);

  console.log('\n✅ System initialized successfully!');
  console.log('\nFor usage examples, see README.md');
}

// Export types and interfaces
export * from './memory-tool/MemoryManager';
export * from './context-editing/ContextMonitor';
export * from './backends/FileBackend';
export * from './backends/MongoDBBackend';

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
