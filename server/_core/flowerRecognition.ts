import OpenAI from "openai";

// Initialiser le client OpenAI avec la clé API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FlowerIdentificationResult {
  name: string;
  scientificName?: string;
  color: string;
  description: string;
  confidence: number; // 0-100
  emotions?: string[];
  symbolism?: string;
}

/**
 * Identifier une fleur à partir d'une image en base64
 * @param imageBase64 - Image encodée en base64 (avec ou sans préfixe data:image/...)
 * @returns Informations sur la fleur identifiée
 */
export async function identifyFlower(
  imageBase64: string
): Promise<FlowerIdentificationResult> {
  try {
    // Nettoyer le base64 si nécessaire (retirer le préfixe data:image/...)
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Créer le prompt pour l'analyse
    const prompt = `Analyse cette image de fleur et fournis les informations suivantes au format JSON strict :
{
  "name": "nom commun de la fleur en français",
  "scientificName": "nom scientifique latin",
  "color": "couleur principale (ex: rouge, rose, blanc, jaune, violet, orange, bleu, multicolore)",
  "description": "description courte (max 100 caractères)",
  "confidence": nombre entre 0 et 100 indiquant ta confiance dans l'identification,
  "emotions": ["liste", "des", "émotions", "associées"],
  "symbolism": "signification symbolique de cette fleur"
}

Si l'image ne contient pas de fleur claire, retourne confidence: 0.
Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.`;

    // Appeler l'API Vision d'OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${cleanBase64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3, // Basse température pour plus de précision
    });

    // Extraire la réponse
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Aucune réponse de l'API OpenAI");
    }

    // Parser le JSON
    const result: FlowerIdentificationResult = JSON.parse(content);

    // Valider le résultat
    if (!result.name || result.confidence === undefined) {
      throw new Error("Format de réponse invalide");
    }

    return result;
  } catch (error) {
    console.error("[FlowerRecognition] Erreur lors de l'identification:", error);
    
    // Retourner un résultat par défaut en cas d'erreur
    return {
      name: "Fleur non identifiée",
      color: "inconnu",
      description: "Impossible d'identifier la fleur. Essayez avec une photo plus claire.",
      confidence: 0,
    };
  }
}

/**
 * Rechercher une fleur dans le catalogue par nom
 * @param flowerName - Nom de la fleur à rechercher
 * @param catalogFlowers - Liste des fleurs du catalogue
 * @returns Fleur correspondante ou null
 */
export function matchFlowerInCatalog(
  flowerName: string,
  catalogFlowers: Array<{ id: number; name: string; scientificName: string | null }>
): { id: number; name: string; scientificName: string | null } | null {
  const searchName = flowerName.toLowerCase().trim();

  // Recherche exacte
  let  match = catalogFlowers.find(
    (f) =>
      f.name.toLowerCase() === searchName ||
      (f.scientificName && f.scientificName.toLowerCase() === searchName)
  );
  if (match) return match;

  // Recherche partielle (contient)
  match = catalogFlowers.find(
    (f) =>
      f.name.toLowerCase().includes(searchName) ||
      (f.scientificName && f.scientificName.toLowerCase().includes(searchName)) ||
      searchName.includes(f.name.toLowerCase()) ||
      (f.scientificName && searchName.includes(f.scientificName.toLowerCase()))
  );

  return match || null;
}

/**
 * Rechercher des fleurs similaires par couleur et émotions
 * @param color - Couleur de la fleur
 * @param emotions - Émotions associées
 * @param catalogFlowers - Liste des fleurs du catalogue
 * @returns Liste des fleurs similaires (max 5)
 */
export function findSimilarFlowers(
  color: string,
  emotions: string[] | undefined,
  catalogFlowers: Array<{
    id: number;
    name: string;
    scientificName: string | null;
    color: string;
    emotions: string;
  }>
): Array<{ id: number; name: string; scientificName: string | null; color: string }> {
  const colorLower = color.toLowerCase();

  // Filtrer par couleur
  let similar = catalogFlowers.filter((f) =>
    f.color.toLowerCase().includes(colorLower)
  );

  // Si on a des émotions, filtrer aussi par émotions
  if (emotions && emotions.length > 0) {
    similar = similar.filter((f) => {
      const flowerEmotions = f.emotions.toLowerCase();
      return emotions.some((emotion) =>
        flowerEmotions.includes(emotion.toLowerCase())
      );
    });
  }

  // Limiter à 5 résultats
  return similar.slice(0, 5).map((f) => ({
    id: f.id,
    name: f.name,
    scientificName: f.scientificName,
    color: f.color,
  }));
}
