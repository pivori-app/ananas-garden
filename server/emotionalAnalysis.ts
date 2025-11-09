import { invokeLLM } from "./_core/llm";
import { searchFlowersByKeywords } from "./db";
import { Flower } from "../drizzle/schema";

export interface EmotionalAnalysis {
  emotions: string[];
  keywords: string[];
  occasion?: string;
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  summary: string;
}

export interface BouquetRecommendation {
  flowers: Array<{
    flower: Flower;
    quantity: number;
    reason: string;
  }>;
  totalPrice: number;
  explanation: string;
}

/**
 * Analyse un message texte pour extraire les émotions et mots-clés
 */
export async function analyzeMessage(message: string): Promise<EmotionalAnalysis> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `Tu es un expert en analyse émotionnelle et en langage des fleurs. 
Analyse le message de l'utilisateur et identifie :
1. Les émotions principales exprimées (amour, joie, tristesse, pardon, gratitude, etc.)
2. Les mots-clés importants liés aux sentiments
3. L'occasion potentielle (anniversaire, mariage, excuses, etc.)
4. Le sentiment général (positif, négatif, neutre, mixte)
5. Un résumé de l'intention émotionnelle

Réponds UNIQUEMENT avec un JSON valide dans ce format exact :
{
  "emotions": ["emotion1", "emotion2"],
  "keywords": ["mot1", "mot2"],
  "occasion": "occasion ou null",
  "sentiment": "positive|negative|neutral|mixed",
  "summary": "résumé de l'intention"
}`
      },
      {
        role: "user",
        content: message
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "emotional_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            emotions: {
              type: "array",
              items: { type: "string" },
              description: "Liste des émotions principales identifiées"
            },
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "Mots-clés importants extraits du message"
            },
            occasion: {
              type: ["string", "null"],
              description: "L'occasion identifiée ou null"
            },
            sentiment: {
              type: "string",
              enum: ["positive", "negative", "neutral", "mixed"],
              description: "Le sentiment général du message"
            },
            summary: {
              type: "string",
              description: "Résumé de l'intention émotionnelle"
            }
          },
          required: ["emotions", "keywords", "sentiment", "summary"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  if (!content || typeof content !== 'string') {
    throw new Error("No response from LLM");
  }

  return JSON.parse(content) as EmotionalAnalysis;
}

/**
 * Génère une recommandation de bouquet basée sur l'analyse émotionnelle et les préférences
 */
export async function generateBouquetRecommendation(
  analysis: EmotionalAnalysis,
  budget: "economique" | "standard" | "premium",
  dominantColors?: string[],
  style?: "moderne" | "romantique" | "champetre" | "luxe"
): Promise<BouquetRecommendation> {
  // Rechercher les fleurs correspondant aux émotions et mots-clés
  const allKeywords = [...analysis.emotions, ...analysis.keywords];
  const matchingFlowers = await searchFlowersByKeywords(allKeywords);

  if (matchingFlowers.length === 0) {
    throw new Error("Aucune fleur trouvée correspondant à votre message");
  }

  // Filtrer par couleurs si spécifié
  let filteredFlowers = matchingFlowers;
  if (dominantColors && dominantColors.length > 0) {
    const colorFiltered = matchingFlowers.filter(flower =>
      dominantColors.some(color => 
        flower.color.toLowerCase().includes(color.toLowerCase())
      )
    );
    // Si le filtre de couleur donne des résultats, l'utiliser, sinon garder tous
    if (colorFiltered.length > 0) {
      filteredFlowers = colorFiltered;
    }
  }

  // Déterminer le nombre de fleurs selon le budget
  const budgetConfig = {
    economique: { minFlowers: 2, maxFlowers: 3, minPrice: 3000, maxPrice: 5000 },
    standard: { minFlowers: 3, maxFlowers: 4, minPrice: 5000, maxPrice: 8000 },
    premium: { minFlowers: 4, maxFlowers: 6, minPrice: 8000, maxPrice: 15000 }
  };

  const config = budgetConfig[budget];
  
  // Sélectionner les meilleures fleurs (les plus pertinentes)
  const selectedFlowers = filteredFlowers.slice(0, config.maxFlowers);
  
  // Utiliser le LLM pour déterminer les quantités et créer l'explication
  const flowersInfo = selectedFlowers.map(f => ({
    id: f.id,
    name: f.name,
    symbolism: f.symbolism,
    price: f.pricePerStem,
    color: f.color
  }));

  const llmResponse = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `Tu es un fleuriste expert. Crée une composition de bouquet harmonieuse.
Pour chaque fleur, détermine la quantité appropriée (entre 1 et 12 tiges).
Le prix total doit être entre ${config.minPrice / 100}€ et ${config.maxPrice / 100}€.
Explique le symbolisme du bouquet de manière poétique et personnalisée.

Réponds UNIQUEMENT avec un JSON valide dans ce format :
{
  "flowers": [
    {
      "id": number,
      "quantity": number,
      "reason": "pourquoi cette fleur et cette quantité"
    }
  ],
  "explanation": "explication poétique du symbolisme complet du bouquet"
}`
      },
      {
        role: "user",
        content: `Message du client : "${analysis.summary}"
Budget : ${budget}
Style : ${style || "non spécifié"}
Fleurs disponibles : ${JSON.stringify(flowersInfo, null, 2)}

Crée une composition harmonieuse.`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "bouquet_composition",
        strict: true,
        schema: {
          type: "object",
          properties: {
            flowers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  quantity: { type: "number" },
                  reason: { type: "string" }
                },
                required: ["id", "quantity", "reason"],
                additionalProperties: false
              }
            },
            explanation: { type: "string" }
          },
          required: ["flowers", "explanation"],
          additionalProperties: false
        }
      }
    }
  });

  const compositionContent = llmResponse.choices[0].message.content;
  if (!compositionContent || typeof compositionContent !== 'string') {
    throw new Error("No composition from LLM");
  }

  const composition = JSON.parse(compositionContent) as {
    flowers: Array<{ id: number; quantity: number; reason: string }>;
    explanation: string;
  };

  // Construire la recommandation finale
  const recommendation: BouquetRecommendation = {
    flowers: [],
    totalPrice: 0,
    explanation: composition.explanation
  };

  for (const item of composition.flowers) {
    const flower = selectedFlowers.find(f => f.id === item.id);
    if (flower) {
      recommendation.flowers.push({
        flower,
        quantity: item.quantity,
        reason: item.reason
      });
      recommendation.totalPrice += flower.pricePerStem * item.quantity;
    }
  }

  return recommendation;
}
