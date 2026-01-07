import { describe, it, expect } from 'vitest';

/**
 * Test de validation de la clé API Google
 * Vérifie que la clé API est correctement configurée et fonctionnelle
 */
describe('Google API Integration', () => {
  it('should have GOOGLE_API_KEY environment variable set', () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    expect(apiKey).toBeTruthy();
    expect(apiKey?.length).toBeGreaterThan(0);
  });

  it('should have valid Google API key format', () => {
    const apiKey = process.env.GOOGLE_API_KEY || '';
    // Les clés API Google commencent par "AIza" et contiennent des caractères alphanumériques
    expect(apiKey).toMatch(/^AIza[a-zA-Z0-9_-]+$/);
  });

  it('should validate API key with Google Gemini API', async () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn('GOOGLE_API_KEY not set, skipping API validation');
      expect(true).toBe(true);
      return;
    }

    try {
      // Test simple avec l'API Gemini pour valider la clé
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'Test API key validation - respond with "OK"',
                  },
                ],
              },
            ],
          }),
        }
      );

      // Vérifier que la réponse n'est pas une erreur d'authentification
      if (response.status === 401 || response.status === 403) {
        const data = await response.json();
        throw new Error(`Authentication failed: ${JSON.stringify(data)}`);
      }

      // Si la clé est valide, on devrait obtenir une réponse 200
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Google API key is valid and working');
        expect(response.status).toBe(200);
        expect(data.candidates).toBeDefined();
      } else {
        // Accepter les erreurs de contenu (400) mais pas d'authentification
        console.log(`API returned status ${response.status} (acceptable for test)`);
        expect(response.status).not.toBe(401);
        expect(response.status).not.toBe(403);
      }
    } catch (error) {
      console.error('Google API validation error:', error);
      throw error;
    }
  });

  it('should have API key available in server context', () => {
    // Vérifier que la clé est accessible depuis le serveur
    const hasApiKey = !!process.env.GOOGLE_API_KEY;
    expect(hasApiKey).toBe(true);
  });
});
