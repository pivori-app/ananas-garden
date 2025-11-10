import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { flowers } from "../drizzle/schema";

export interface FlowerIdentification {
  name: string;
  symbolism: string;
  confidence: number;
}

export interface BouquetAnalysisResult {
  flowers: FlowerIdentification[];
  message: string;
}

/**
 * Analyse une image de bouquet pour identifier les fleurs et décoder le message émotionnel
 */
export async function analyzeFlowerImage(imageDataUrl: string): Promise<BouquetAnalysisResult> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Récupérer toutes les fleurs de la base de données
  const allFlowers = await db.select().from(flowers);
  
  // Créer une liste des fleurs disponibles pour le LLM
  const flowersList = allFlowers.map(f => ({
    name: f.name,
    scientificName: f.scientificName,
    symbolism: f.symbolism,
    color: f.color,
    description: f.description
  }));

  // Analyse de l'image avec le LLM multimodal
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `Tu es un expert en botanique et en langage des fleurs. Tu analyses des images de bouquets pour identifier les fleurs présentes et interpréter leur signification émotionnelle.

Voici la liste des fleurs que tu peux identifier (avec leur symbolisme) :
${JSON.stringify(flowersList, null, 2)}

Ta tâche :
1. Identifier les fleurs présentes dans l'image (utilise UNIQUEMENT les fleurs de la liste ci-dessus)
2. Pour chaque fleur identifiée, donne un score de confiance entre 0 et 1
3. Interpréter le message émotionnel global du bouquet basé sur le symbolisme des fleurs identifiées
4. Créer une phrase poétique qui résume le message (par exemple : "Je t'aime depuis toujours", "Merci pour tout", "Pardonne-moi", etc.)

Réponds UNIQUEMENT avec un objet JSON valide dans ce format exact :
{
  "flowers": [
    {"name": "nom de la fleur", "symbolism": "symbolisme", "confidence": 0.95}
  ],
  "message": "phrase poétique du message émotionnel"
}`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyse ce bouquet et identifie les fleurs présentes, puis décode son message émotionnel."
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl,
              detail: "high"
            }
          }
        ]
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "bouquet_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            flowers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Nom de la fleur identifiée" },
                  symbolism: { type: "string", description: "Symbolisme de la fleur" },
                  confidence: { type: "number", description: "Score de confiance entre 0 et 1" }
                },
                required: ["name", "symbolism", "confidence"],
                additionalProperties: false
              }
            },
            message: { type: "string", description: "Message émotionnel poétique décodé du bouquet" }
          },
          required: ["flowers", "message"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from LLM");
  }

  const result = JSON.parse(content as string) as BouquetAnalysisResult;
  
  // Validation : s'assurer que les fleurs identifiées existent dans notre base
  const validFlowers = result.flowers.filter(f => 
    allFlowers.some(flower => flower.name.toLowerCase() === f.name.toLowerCase())
  );

  return {
    flowers: validFlowers,
    message: result.message
  };
}
