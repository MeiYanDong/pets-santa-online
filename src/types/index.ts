export type Page = 'home' | 'pricing' | 'my-creations';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'studio';
}

export interface Creation {
  id: string;
  originalImage: string;
  generatedImage: string | null;
  style: string;
  styleId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  date: string;
  createdAt?: string;
  errorMessage?: string;
}

export interface StyleTemplate {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}
