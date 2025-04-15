import { db } from './db';
import { aiSettings } from '../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Initialize the database with default settings if they don't exist yet
 */
export async function initializeDatabase() {
  console.log('Checking database for default settings...');
  
  try {
    // Check if AI settings exist
    const existingSettings = await db.select().from(aiSettings).limit(1);
    
    // If no settings exist, create default AI settings
    if (existingSettings.length === 0) {
      console.log('No AI settings found. Creating default settings...');
      
      await db.insert(aiSettings).values({
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
      });
      
      console.log('Default AI settings created successfully.');
    } else {
      console.log('Database already contains AI settings.');
    }
    
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 