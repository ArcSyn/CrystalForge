/**
 * Component Manager Service
 * Handles file persistence and management for generated components
 */

import { BaseDirectory, exists, create, writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';

export interface SavedComponent {
  id: string;
  name: string;
  fileName: string;
  description: string;
  code: string;
  timestamp: Date;
  tags: string[];
  crystal: string;
}

export class ComponentManager {
  private readonly COMPONENTS_DIR = 'crystal-forge-components';
  private readonly MANIFEST_FILE = 'components-manifest.json';
  
  /**
   * Initialize the components directory
   */
  async init(): Promise<void> {
    try {
      const dirExists = await exists(this.COMPONENTS_DIR, { 
        baseDir: BaseDirectory.AppData 
      });
      
      if (!dirExists) {
        await create(this.COMPONENTS_DIR, { 
          baseDir: BaseDirectory.AppData
        });
      }
    } catch (error) {
      console.error('Failed to initialize component directory:', error);
    }
  }
  
  /**
   * Save a component to a file
   */
  async saveComponent(
    name: string,
    code: string,
    description: string,
    crystal: string = 'amethyst'
  ): Promise<SavedComponent> {
    await this.init();
    
    const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${name.replace(/[^a-zA-Z0-9]/g, '')}.tsx`;
    const filePath = `${this.COMPONENTS_DIR}/${fileName}`;
    
    // Save the component file
    await writeTextFile(filePath, code, {
      baseDir: BaseDirectory.AppData
    });
    
    // Create component metadata
    const component: SavedComponent = {
      id,
      name,
      fileName,
      description,
      code,
      timestamp: new Date(),
      tags: this.extractTags(code),
      crystal
    };
    
    // Update manifest
    await this.updateManifest(component);
    
    return component;
  }
  
  /**
   * Load all saved components
   */
  async loadComponents(): Promise<SavedComponent[]> {
    try {
      const manifestPath = `${this.COMPONENTS_DIR}/${this.MANIFEST_FILE}`;
      const manifestExists = await exists(manifestPath, {
        baseDir: BaseDirectory.AppData
      });
      
      if (!manifestExists) {
        return [];
      }
      
      const manifestContent = await readTextFile(manifestPath, {
        baseDir: BaseDirectory.AppData
      });
      
      return JSON.parse(manifestContent);
    } catch (error) {
      console.error('Failed to load components manifest:', error);
      return [];
    }
  }
  
  /**
   * Load a specific component by ID
   */
  async loadComponent(id: string): Promise<SavedComponent | null> {
    const components = await this.loadComponents();
    return components.find(c => c.id === id) || null;
  }
  
  /**
   * Delete a component
   */
  async deleteComponent(id: string): Promise<boolean> {
    try {
      const components = await this.loadComponents();
      const component = components.find(c => c.id === id);
      
      if (!component) return false;
      
      // Note: Tauri FS plugin doesn't have removeFile yet, 
      // so we'll just remove from manifest for now
      
      // Update manifest
      const updatedComponents = components.filter(c => c.id !== id);
      await this.saveManifest(updatedComponents);
      
      return true;
    } catch (error) {
      console.error('Failed to delete component:', error);
      return false;
    }
  }
  
  /**
   * Export component to user's chosen directory
   */
  async exportComponent(id: string, targetPath: string): Promise<boolean> {
    try {
      const component = await this.loadComponent(id);
      if (!component) return false;
      
      await writeTextFile(targetPath, component.code);
      return true;
    } catch (error) {
      console.error('Failed to export component:', error);
      return false;
    }
  }
  
  /**
   * Update the components manifest
   */
  private async updateManifest(component: SavedComponent): Promise<void> {
    const components = await this.loadComponents();
    
    // Check if component already exists (update) or add new
    const existingIndex = components.findIndex(c => c.id === component.id);
    if (existingIndex >= 0) {
      components[existingIndex] = component;
    } else {
      components.push(component);
    }
    
    await this.saveManifest(components);
  }
  
  /**
   * Save the manifest file
   */
  private async saveManifest(components: SavedComponent[]): Promise<void> {
    const manifestPath = `${this.COMPONENTS_DIR}/${this.MANIFEST_FILE}`;
    await writeTextFile(
      manifestPath,
      JSON.stringify(components, null, 2),
      { baseDir: BaseDirectory.AppData }
    );
  }
  
  /**
   * Extract tags from component code
   */
  private extractTags(code: string): string[] {
    const tags: string[] = [];
    
    // Check for common patterns
    if (code.includes('useState')) tags.push('stateful');
    if (code.includes('useEffect')) tags.push('effects');
    if (code.includes('async')) tags.push('async');
    if (code.includes('className=')) tags.push('styled');
    if (code.includes('grid')) tags.push('grid');
    if (code.includes('flex')) tags.push('flexbox');
    if (code.includes('form')) tags.push('form');
    if (code.includes('button')) tags.push('interactive');
    if (code.includes('animate')) tags.push('animated');
    
    return tags;
  }
  
  /**
   * Search components by name or description
   */
  async searchComponents(query: string): Promise<SavedComponent[]> {
    const components = await this.loadComponents();
    const lowerQuery = query.toLowerCase();
    
    return components.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.includes(lowerQuery))
    );
  }
}

export const componentManager = new ComponentManager();
