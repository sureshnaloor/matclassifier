import {
  users, type User, type InsertUser,
  materials, type Material, type InsertMaterial,
  processingResults, type ProcessingResult, type InsertProcessingResult,
  processingHistory, type ProcessingHistory, type InsertProcessingHistory,
  aiSettings, type AISettings, type InsertAISettings,
  learningExamples, type LearningExample, type InsertLearningExample
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Material operations
  getMaterial(id: number): Promise<Material | undefined>;
  getMaterialByName(name: string): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material | undefined>;
  deleteMaterial(id: number): Promise<boolean>;
  getAllMaterials(): Promise<Material[]>;
  
  // Processing result operations
  getProcessingResult(id: number): Promise<ProcessingResult | undefined>;
  getProcessingResultByMaterialId(materialId: number): Promise<ProcessingResult | undefined>;
  createProcessingResult(result: InsertProcessingResult): Promise<ProcessingResult>;
  
  // Processing history operations
  getProcessingHistory(id: number): Promise<ProcessingHistory | undefined>;
  createProcessingHistory(history: InsertProcessingHistory): Promise<ProcessingHistory>;
  getAllProcessingHistory(): Promise<ProcessingHistory[]>;
  
  // AI settings operations
  getAISettings(id: number): Promise<AISettings | undefined>;
  getAISettingsByUserId(userId: number): Promise<AISettings | undefined>;
  createAISettings(settings: InsertAISettings): Promise<AISettings>;
  updateAISettings(id: number, settings: Partial<InsertAISettings>): Promise<AISettings | undefined>;
  getDefaultAISettings(): Promise<AISettings>;
  
  // Learning examples operations
  getLearningExample(id: number): Promise<LearningExample | undefined>;
  createLearningExample(example: InsertLearningExample): Promise<LearningExample>;
  deleteLearningExample(id: number): Promise<boolean>;
  getAllLearningExamples(userId?: number): Promise<LearningExample[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private materials: Map<number, Material>;
  private processingResults: Map<number, ProcessingResult>;
  private processingHistory: Map<number, ProcessingHistory>;
  private aiSettings: Map<number, AISettings>;
  private learningExamples: Map<number, LearningExample>;
  
  private userId: number;
  private materialId: number;
  private resultId: number;
  private historyId: number;
  private settingsId: number;
  private exampleId: number;

  constructor() {
    this.users = new Map();
    this.materials = new Map();
    this.processingResults = new Map();
    this.processingHistory = new Map();
    this.aiSettings = new Map();
    this.learningExamples = new Map();
    
    this.userId = 1;
    this.materialId = 1;
    this.resultId = 1;
    this.historyId = 1;
    this.settingsId = 1;
    this.exampleId = 1;
    
    // Initialize with default AI settings
    const defaultSettings: AISettings = {
      id: this.settingsId++,
      provider: "openai",
      model: "gpt-4o",
      temperature: "0.7",
      topP: "0.9",
      topK: "40",
      erpSystem: "sap",
      shortDescLimit: 40,
      longDescLimit: 1000,
      learningMode: "none",
      additionalContext: "",
      examples: null,
      userId: null
    };
    
    this.aiSettings.set(defaultSettings.id, defaultSettings);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Material operations
  async getMaterial(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }
  
  async getMaterialByName(name: string): Promise<Material | undefined> {
    return Array.from(this.materials.values()).find(
      (material) => material.materialName === name
    );
  }
  
  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = this.materialId++;
    const now = new Date();
    const material: Material = { ...insertMaterial, id, processedAt: now };
    this.materials.set(id, material);
    return material;
  }
  
  async updateMaterial(id: number, updateData: Partial<InsertMaterial>): Promise<Material | undefined> {
    const material = this.materials.get(id);
    if (!material) return undefined;
    
    const updatedMaterial = { ...material, ...updateData };
    this.materials.set(id, updatedMaterial);
    return updatedMaterial;
  }
  
  async deleteMaterial(id: number): Promise<boolean> {
    return this.materials.delete(id);
  }
  
  async getAllMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values()).sort((a, b) => {
      return new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime();
    });
  }
  
  // Processing result operations
  async getProcessingResult(id: number): Promise<ProcessingResult | undefined> {
    return this.processingResults.get(id);
  }
  
  async getProcessingResultByMaterialId(materialId: number): Promise<ProcessingResult | undefined> {
    return Array.from(this.processingResults.values()).find(
      (result) => result.materialId === materialId
    );
  }
  
  async createProcessingResult(insertResult: InsertProcessingResult): Promise<ProcessingResult> {
    const id = this.resultId++;
    const now = new Date();
    const result: ProcessingResult = { ...insertResult, id, processedAt: now };
    this.processingResults.set(id, result);
    return result;
  }
  
  // Processing history operations
  async getProcessingHistory(id: number): Promise<ProcessingHistory | undefined> {
    return this.processingHistory.get(id);
  }
  
  async createProcessingHistory(insertHistory: InsertProcessingHistory): Promise<ProcessingHistory> {
    const id = this.historyId++;
    const now = new Date();
    const history: ProcessingHistory = { ...insertHistory, id, processedAt: now };
    this.processingHistory.set(id, history);
    return history;
  }
  
  async getAllProcessingHistory(): Promise<ProcessingHistory[]> {
    return Array.from(this.processingHistory.values()).sort((a, b) => {
      return new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime();
    });
  }
  
  // AI settings operations
  async getAISettings(id: number): Promise<AISettings | undefined> {
    return this.aiSettings.get(id);
  }
  
  async getAISettingsByUserId(userId: number): Promise<AISettings | undefined> {
    return Array.from(this.aiSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }
  
  async createAISettings(insertSettings: InsertAISettings): Promise<AISettings> {
    const id = this.settingsId++;
    const settings: AISettings = { ...insertSettings, id };
    this.aiSettings.set(id, settings);
    return settings;
  }
  
  async updateAISettings(id: number, updateData: Partial<InsertAISettings>): Promise<AISettings | undefined> {
    const settings = this.aiSettings.get(id);
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...updateData };
    this.aiSettings.set(id, updatedSettings);
    return updatedSettings;
  }
  
  async getDefaultAISettings(): Promise<AISettings> {
    // Return the first settings which should be our default
    return this.aiSettings.get(1) as AISettings;
  }
  
  // Learning examples operations
  async getLearningExample(id: number): Promise<LearningExample | undefined> {
    return this.learningExamples.get(id);
  }
  
  async createLearningExample(insertExample: InsertLearningExample): Promise<LearningExample> {
    const id = this.exampleId++;
    const example: LearningExample = { ...insertExample, id };
    this.learningExamples.set(id, example);
    return example;
  }
  
  async deleteLearningExample(id: number): Promise<boolean> {
    return this.learningExamples.delete(id);
  }
  
  async getAllLearningExamples(userId?: number): Promise<LearningExample[]> {
    if (userId) {
      return Array.from(this.learningExamples.values()).filter(
        (example) => example.userId === userId
      );
    }
    return Array.from(this.learningExamples.values());
  }
}

export const storage = new MemStorage();
