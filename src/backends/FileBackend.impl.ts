/**
 * File Backend - FULL IMPLEMENTATION
 *
 * Implements persistent memory using the local filesystem.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

export interface FileMetadata {
  filePath: string;
  contentHash: string;
  lastUpdated: Date;
  accessCount: number;
  size: number;
}

export class FileBackendImpl {
  private memoryRoot: string;
  private metadataFile: string;
  private metadata: Map<string, FileMetadata>;

  constructor(memoryRoot: string) {
    this.memoryRoot = memoryRoot;
    this.metadataFile = path.join(memoryRoot, '.metadata.json');
    this.metadata = new Map();
  }

  /**
   * Initialize file backend
   */
  async initialize(): Promise<void> {
    try {
      // Create memory root directory
      await fs.mkdir(this.memoryRoot, { recursive: true });

      // Create subdirectories
      await fs.mkdir(path.join(this.memoryRoot, 'system'), { recursive: true });
      await fs.mkdir(path.join(this.memoryRoot, 'personalities'), { recursive: true });
      await fs.mkdir(path.join(this.memoryRoot, 'projects'), { recursive: true });

      // Load metadata
      await this.loadMetadata();

      console.log(`✅ File backend initialized at: ${this.memoryRoot}`);
    } catch (error) {
      console.error('Failed to initialize file backend:', error);
      throw error;
    }
  }

  /**
   * Store memory to file
   */
  async store(filename: string, content: string, category: string = 'system'): Promise<FileMetadata> {
    const filePath = path.join(this.memoryRoot, category, filename);

    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      // Write content
      await fs.writeFile(filePath, content, 'utf-8');

      // Generate metadata
      const contentHash = crypto.createHash('sha256').update(content).digest('hex');
      const stats = await fs.stat(filePath);

      const metadata: FileMetadata = {
        filePath: path.relative(this.memoryRoot, filePath),
        contentHash,
        lastUpdated: new Date(),
        accessCount: 0,
        size: stats.size
      };

      // Update metadata
      this.metadata.set(filename, metadata);
      await this.saveMetadata();

      return metadata;
    } catch (error) {
      console.error(`Failed to store file: ${filename}`, error);
      throw error;
    }
  }

  /**
   * Retrieve memory from file
   */
  async retrieve(filename: string, category: string = 'system'): Promise<{ content: string; metadata: FileMetadata }> {
    const filePath = path.join(this.memoryRoot, category, filename);

    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // Update access count
      const metadata = this.metadata.get(filename);
      if (metadata) {
        metadata.accessCount++;
        metadata.lastUpdated = new Date();
        await this.saveMetadata();
      }

      return {
        content,
        metadata: metadata || {
          filePath: path.relative(this.memoryRoot, filePath),
          contentHash: crypto.createHash('sha256').update(content).digest('hex'),
          lastUpdated: new Date(),
          accessCount: 1,
          size: content.length
        }
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Memory file not found: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * Update existing memory file
   */
  async update(filename: string, content: string, category: string = 'system'): Promise<FileMetadata> {
    const filePath = path.join(this.memoryRoot, category, filename);

    try {
      // Check if file exists
      await fs.access(filePath);

      // Update content
      return await this.store(filename, content, category);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Cannot update non-existent file: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * Append to existing memory file
   */
  async append(filename: string, additionalContent: string, category: string = 'system'): Promise<FileMetadata> {
    const { content } = await this.retrieve(filename, category);
    const newContent = content + '\n' + additionalContent;
    return await this.update(filename, newContent, category);
  }

  /**
   * Delete memory file
   */
  async remove(filename: string, category: string = 'system'): Promise<void> {
    const filePath = path.join(this.memoryRoot, category, filename);

    try {
      await fs.unlink(filePath);
      this.metadata.delete(filename);
      await this.saveMetadata();
      console.log(`✅ Deleted memory file: ${filename}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Cannot delete non-existent file: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * List all memory files
   */
  async list(category?: string): Promise<FileMetadata[]> {
    const searchPath = category
      ? path.join(this.memoryRoot, category)
      : this.memoryRoot;

    try {
      const files: FileMetadata[] = [];

      const entries = await fs.readdir(searchPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile() && !entry.name.startsWith('.')) {
          const metadata = this.metadata.get(entry.name);
          if (metadata) {
            files.push(metadata);
          }
        }
      }

      return files.sort((a, b) =>
        b.lastUpdated.getTime() - a.lastUpdated.getTime()
      );
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    categories: string[];
    mostAccessed: FileMetadata[];
  }> {
    const allMetadata = Array.from(this.metadata.values());

    return {
      totalFiles: allMetadata.length,
      totalSize: allMetadata.reduce((sum, m) => sum + m.size, 0),
      categories: ['system', 'personalities', 'projects'],
      mostAccessed: allMetadata
        .sort((a, b) => b.accessCount - a.accessCount)
        .slice(0, 10)
    };
  }

  /**
   * Load metadata from disk
   */
  private async loadMetadata(): Promise<void> {
    try {
      const data = await fs.readFile(this.metadataFile, 'utf-8');
      const parsed = JSON.parse(data);

      this.metadata = new Map(Object.entries(parsed).map(([key, value]: [string, any]) => [
        key,
        {
          ...value,
          lastUpdated: new Date(value.lastUpdated)
        }
      ]));
    } catch (error) {
      // Metadata file doesn't exist yet, that's okay
      this.metadata = new Map();
    }
  }

  /**
   * Save metadata to disk
   */
  private async saveMetadata(): Promise<void> {
    const obj = Object.fromEntries(this.metadata);
    await fs.writeFile(this.metadataFile, JSON.stringify(obj, null, 2), 'utf-8');
  }

  /**
   * Clear all memories (for testing)
   */
  async clear(): Promise<void> {
    try {
      await fs.rm(this.memoryRoot, { recursive: true, force: true });
      await this.initialize();
      console.log('✅ Cleared all memories');
    } catch (error) {
      console.error('Failed to clear memories:', error);
      throw error;
    }
  }
}
