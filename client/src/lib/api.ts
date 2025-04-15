import { AISettings, MaterialInputForm, MaterialProcessingResponse, BatchProcessingResponse } from '@/types';

// Process a single material
export async function processMaterial(
  materialData: MaterialInputForm,
  aiSettings: AISettings
): Promise<MaterialProcessingResponse> {
  try {
    // Combine material data with AI settings
    const requestData = {
      ...materialData,
      temperature: aiSettings.temperature,
      topP: aiSettings.topP,
      topK: aiSettings.topK,
      learningMode: aiSettings.learningMode,
      examples: aiSettings.examples || [],
      additionalContext: aiSettings.additionalContext || '',
      erpSystem: aiSettings.erpSystem,
      shortDescLimit: aiSettings.shortDescLimit,
      longDescLimit: aiSettings.longDescLimit,
    };

    const response = await fetch('/api/process-material', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing material:', error);
    throw error;
  }
}

// Process a batch of materials via CSV
export async function processBatch(
  file: File,
  aiSettings: AISettings
): Promise<BatchProcessingResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add AI settings to formData
    formData.append('temperature', aiSettings.temperature);
    formData.append('topP', aiSettings.topP);
    formData.append('topK', aiSettings.topK);
    formData.append('learningMode', aiSettings.learningMode);
    formData.append('additionalContext', aiSettings.additionalContext || '');
    formData.append('erpSystem', aiSettings.erpSystem);
    formData.append('shortDescLimit', aiSettings.shortDescLimit.toString());
    formData.append('longDescLimit', aiSettings.longDescLimit.toString());

    if (aiSettings.examples && aiSettings.examples.length > 0) {
      formData.append('examples', JSON.stringify(aiSettings.examples));
    }

    const response = await fetch('/api/process-batch', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing batch:', error);
    throw error;
  }
}

// Get all materials
export async function getMaterials() {
  try {
    const response = await fetch('/api/materials', {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
}

// Get a single material by ID
export async function getMaterial(id: number) {
  try {
    const response = await fetch(`/api/materials/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching material ${id}:`, error);
    throw error;
  }
}

// Get all processing history
export async function getProcessingHistory() {
  try {
    const response = await fetch('/api/processing-history', {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching processing history:', error);
    throw error;
  }
}

// Get default AI settings
export async function getDefaultAISettings(): Promise<AISettings> {
  try {
    const response = await fetch('/api/ai-settings/default', {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching default AI settings:', error);
    throw error;
  }
}

// Update AI settings
export async function updateAISettings(id: number, settings: Partial<AISettings>): Promise<AISettings> {
  try {
    const response = await fetch(`/api/ai-settings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating AI settings:', error);
    throw error;
  }
}

// Get learning examples
export async function getLearningExamples() {
  try {
    const response = await fetch('/api/learning-examples', {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching learning examples:', error);
    throw error;
  }
}

// Create learning example
export async function createLearningExample(example: { input: string; output: string }) {
  try {
    const response = await fetch('/api/learning-examples', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(example),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating learning example:', error);
    throw error;
  }
}

// Delete learning example
export async function deleteLearningExample(id: number) {
  try {
    const response = await fetch(`/api/learning-examples/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting learning example ${id}:`, error);
    throw error;
  }
}
