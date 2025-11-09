import { drizzle } from "drizzle-orm/mysql2";
import { flowers } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const flowersData = [
  {
    name: "Rose rouge",
    scientificName: "Rosa",
    symbolism: "Amour passionné, désir ardent",
    emotions: JSON.stringify(["amour", "passion", "désir", "romance"]),
    keywords: JSON.stringify(["amour", "passion", "aimer", "adorer", "désir", "romantique", "romance", "coeur"]),
    color: "Rouge",
    pricePerStem: 350,
    description: "La rose rouge est le symbole universel de l'amour passionné et du désir profond."
  },
  {
    name: "Rose rose",
    scientificName: "Rosa",
    symbolism: "Tendresse, gratitude, admiration",
    emotions: JSON.stringify(["tendresse", "gratitude", "admiration", "douceur"]),
    keywords: JSON.stringify(["tendre", "merci", "gratitude", "admiration", "doux", "gentil", "reconnaissance"]),
    color: "Rose",
    pricePerStem: 300,
    description: "La rose rose exprime la tendresse et la gratitude avec délicatesse."
  },
  {
    name: "Rose blanche",
    scientificName: "Rosa",
    symbolism: "Pureté, innocence, nouveau départ",
    emotions: JSON.stringify(["pureté", "innocence", "paix", "nouveau_depart"]),
    keywords: JSON.stringify(["pur", "innocent", "paix", "nouveau", "départ", "mariage", "blanc", "sincérité"]),
    color: "Blanc",
    pricePerStem: 300,
    description: "La rose blanche symbolise la pureté et les nouveaux commencements."
  },
  {
    name: "Lys blanc",
    scientificName: "Lilium",
    symbolism: "Espoir, renouveau, majesté",
    emotions: JSON.stringify(["espoir", "renouveau", "majesté", "pureté"]),
    keywords: JSON.stringify(["espoir", "espérer", "avenir", "renouveau", "nouveau", "majestueux", "élégant"]),
    color: "Blanc",
    pricePerStem: 450,
    description: "Le lys blanc incarne l'espoir et la majesté avec élégance."
  },
  {
    name: "Tournesol",
    scientificName: "Helianthus annuus",
    symbolism: "Amitié, loyauté, joie de vivre",
    emotions: JSON.stringify(["amitié", "loyauté", "joie", "bonheur"]),
    keywords: JSON.stringify(["ami", "amitié", "loyal", "loyauté", "joyeux", "joie", "bonheur", "soleil", "positif"]),
    color: "Jaune",
    pricePerStem: 280,
    description: "Le tournesol rayonne de joie et symbolise l'amitié sincère."
  },
  {
    name: "Bleuet",
    scientificName: "Centaurea cyanus",
    symbolism: "Pardon, délicatesse, regrets",
    emotions: JSON.stringify(["pardon", "regret", "délicatesse", "excuses"]),
    keywords: JSON.stringify(["pardon", "pardonner", "désolé", "excuses", "regret", "regretter", "dispute"]),
    color: "Bleu",
    pricePerStem: 200,
    description: "Le bleuet exprime avec délicatesse le pardon et les regrets sincères."
  },
  {
    name: "Myosotis",
    scientificName: "Myosotis",
    symbolism: "Souvenir, fidélité, ne m'oubliez pas",
    emotions: JSON.stringify(["souvenir", "fidélité", "mémoire", "nostalgie"]),
    keywords: JSON.stringify(["souvenir", "souviens", "mémoire", "oublier", "fidèle", "fidélité", "nostalgie"]),
    color: "Bleu",
    pricePerStem: 180,
    description: "Le myosotis préserve les souvenirs et symbolise la fidélité éternelle."
  },
  {
    name: "Tulipe rouge",
    scientificName: "Tulipa",
    symbolism: "Déclaration d'amour, passion",
    emotions: JSON.stringify(["amour", "passion", "déclaration", "romance"]),
    keywords: JSON.stringify(["amour", "aimer", "passion", "déclarer", "romantique"]),
    color: "Rouge",
    pricePerStem: 250,
    description: "La tulipe rouge est une déclaration d'amour audacieuse et passionnée."
  },
  {
    name: "Tulipe jaune",
    scientificName: "Tulipa",
    symbolism: "Joie, optimisme, amitié",
    emotions: JSON.stringify(["joie", "optimisme", "amitié", "gaieté"]),
    keywords: JSON.stringify(["joyeux", "joie", "optimiste", "ami", "gai", "sourire"]),
    color: "Jaune",
    pricePerStem: 220,
    description: "La tulipe jaune apporte joie et optimisme avec éclat."
  },
  {
    name: "Orchidée",
    scientificName: "Orchidaceae",
    symbolism: "Beauté raffinée, luxe, force",
    emotions: JSON.stringify(["beauté", "luxe", "raffinement", "force"]),
    keywords: JSON.stringify(["beau", "beauté", "luxe", "raffiné", "élégant", "fort", "force"]),
    color: "Violet",
    pricePerStem: 600,
    description: "L'orchidée incarne la beauté raffinée et le luxe sophistiqué."
  },
  {
    name: "Pivoine",
    scientificName: "Paeonia",
    symbolism: "Romance, prospérité, honneur",
    emotions: JSON.stringify(["romance", "prospérité", "honneur", "bonheur"]),
    keywords: JSON.stringify(["romantique", "romance", "prospère", "honneur", "heureux", "mariage"]),
    color: "Rose",
    pricePerStem: 500,
    description: "La pivoine symbolise la romance et la prospérité avec générosité."
  },
  {
    name: "Œillet rouge",
    scientificName: "Dianthus caryophyllus",
    symbolism: "Amour profond, admiration",
    emotions: JSON.stringify(["amour", "admiration", "fierté", "affection"]),
    keywords: JSON.stringify(["amour", "admirer", "admiration", "fier", "fierté", "affection"]),
    color: "Rouge",
    pricePerStem: 200,
    description: "L'œillet rouge exprime un amour profond et une admiration sincère."
  },
  {
    name: "Œillet blanc",
    scientificName: "Dianthus caryophyllus",
    symbolism: "Amour pur, chance, innocence",
    emotions: JSON.stringify(["pureté", "chance", "innocence", "amour"]),
    keywords: JSON.stringify(["pur", "chance", "innocent", "amour", "sincère"]),
    color: "Blanc",
    pricePerStem: 180,
    description: "L'œillet blanc symbolise l'amour pur et la bonne fortune."
  },
  {
    name: "Gerbera",
    scientificName: "Gerbera jamesonii",
    symbolism: "Gaieté, innocence, pureté",
    emotions: JSON.stringify(["gaieté", "joie", "innocence", "bonheur"]),
    keywords: JSON.stringify(["gai", "joyeux", "joie", "innocent", "heureux", "bonheur"]),
    color: "Orange",
    pricePerStem: 280,
    description: "Le gerbera rayonne de gaieté et d'innocence joyeuse."
  },
  {
    name: "Marguerite",
    scientificName: "Leucanthemum vulgare",
    symbolism: "Innocence, pureté, amour sincère",
    emotions: JSON.stringify(["innocence", "pureté", "amour", "simplicité"]),
    keywords: JSON.stringify(["innocent", "pur", "simple", "sincère", "amour", "vrai"]),
    color: "Blanc",
    pricePerStem: 150,
    description: "La marguerite incarne l'innocence et la simplicité touchante."
  },
  {
    name: "Lavande",
    scientificName: "Lavandula",
    symbolism: "Sérénité, dévotion, calme",
    emotions: JSON.stringify(["sérénité", "calme", "dévotion", "paix"]),
    keywords: JSON.stringify(["serein", "calme", "paisible", "paix", "dévoué", "tranquille"]),
    color: "Violet",
    pricePerStem: 220,
    description: "La lavande apporte sérénité et calme apaisant."
  },
  {
    name: "Iris",
    scientificName: "Iris",
    symbolism: "Espoir, foi, sagesse",
    emotions: JSON.stringify(["espoir", "foi", "sagesse", "confiance"]),
    keywords: JSON.stringify(["espoir", "espérer", "foi", "sage", "sagesse", "confiance"]),
    color: "Bleu",
    pricePerStem: 320,
    description: "L'iris symbolise l'espoir et la sagesse avec noblesse."
  },
  {
    name: "Freesia",
    scientificName: "Freesia",
    symbolism: "Confiance, amitié, innocence",
    emotions: JSON.stringify(["confiance", "amitié", "innocence", "douceur"]),
    keywords: JSON.stringify(["confiance", "ami", "amitié", "innocent", "doux"]),
    color: "Blanc",
    pricePerStem: 240,
    description: "Le freesia exprime la confiance et l'amitié délicate."
  },
  {
    name: "Hortensia",
    scientificName: "Hydrangea",
    symbolism: "Gratitude, compréhension, sincérité",
    emotions: JSON.stringify(["gratitude", "compréhension", "sincérité", "reconnaissance"]),
    keywords: JSON.stringify(["merci", "gratitude", "comprendre", "compréhension", "sincère", "reconnaissance"]),
    color: "Bleu",
    pricePerStem: 380,
    description: "L'hortensia exprime la gratitude et la compréhension profonde."
  },
  {
    name: "Dahlia",
    scientificName: "Dahlia",
    symbolism: "Dignité, élégance, engagement",
    emotions: JSON.stringify(["dignité", "élégance", "engagement", "fierté"]),
    keywords: JSON.stringify(["digne", "dignité", "élégant", "engagement", "engager", "fier"]),
    color: "Rouge",
    pricePerStem: 350,
    description: "Le dahlia incarne la dignité et l'engagement avec élégance."
  },
  {
    name: "Anémone",
    scientificName: "Anemone",
    symbolism: "Anticipation, protection, sincérité",
    emotions: JSON.stringify(["anticipation", "protection", "sincérité", "attente"]),
    keywords: JSON.stringify(["attendre", "anticipation", "protéger", "protection", "sincère"]),
    color: "Violet",
    pricePerStem: 280,
    description: "L'anémone symbolise l'anticipation et la protection bienveillante."
  },
  {
    name: "Renoncule",
    scientificName: "Ranunculus",
    symbolism: "Charme radieux, attraction",
    emotions: JSON.stringify(["charme", "attraction", "beauté", "séduction"]),
    keywords: JSON.stringify(["charme", "charmant", "attirer", "attraction", "beau", "séduire"]),
    color: "Rose",
    pricePerStem: 320,
    description: "La renoncule rayonne de charme et d'attraction irrésistible."
  },
  {
    name: "Muguet",
    scientificName: "Convallaria majalis",
    symbolism: "Bonheur retrouvé, retour du bonheur",
    emotions: JSON.stringify(["bonheur", "joie", "renouveau", "chance"]),
    keywords: JSON.stringify(["bonheur", "heureux", "joie", "chance", "renouveau", "printemps"]),
    color: "Blanc",
    pricePerStem: 400,
    description: "Le muguet annonce le retour du bonheur et de la chance."
  },
  {
    name: "Jasmin",
    scientificName: "Jasminum",
    symbolism: "Amour sensuel, attachement",
    emotions: JSON.stringify(["amour", "sensualité", "attachement", "douceur"]),
    keywords: JSON.stringify(["amour", "sensuel", "attachement", "attacher", "doux", "parfum"]),
    color: "Blanc",
    pricePerStem: 350,
    description: "Le jasmin évoque l'amour sensuel et l'attachement tendre."
  },
  {
    name: "Gardénia",
    scientificName: "Gardenia jasminoides",
    symbolism: "Joie secrète, pureté, raffinement",
    emotions: JSON.stringify(["joie", "pureté", "raffinement", "secret"]),
    keywords: JSON.stringify(["joie", "secret", "pur", "raffiné", "élégant"]),
    color: "Blanc",
    pricePerStem: 450,
    description: "Le gardénia cache une joie secrète dans sa pureté raffinée."
  },
  {
    name: "Calla",
    scientificName: "Zantedeschia",
    symbolism: "Beauté magnifique, pureté",
    emotions: JSON.stringify(["beauté", "pureté", "élégance", "magnificence"]),
    keywords: JSON.stringify(["beau", "beauté", "pur", "élégant", "magnifique"]),
    color: "Blanc",
    pricePerStem: 420,
    description: "Le calla exprime une beauté magnifique et une pureté élégante."
  },
  {
    name: "Delphinium",
    scientificName: "Delphinium",
    symbolism: "Ouverture du cœur, légèreté",
    emotions: JSON.stringify(["ouverture", "légèreté", "joie", "liberté"]),
    keywords: JSON.stringify(["ouvert", "ouverture", "léger", "légèreté", "libre", "liberté", "joyeux"]),
    color: "Bleu",
    pricePerStem: 340,
    description: "Le delphinium ouvre le cœur avec légèreté et liberté."
  },
  {
    name: "Lisianthus",
    scientificName: "Eustoma grandiflorum",
    symbolism: "Appréciation, charisme, gratitude",
    emotions: JSON.stringify(["appréciation", "charisme", "gratitude", "élégance"]),
    keywords: JSON.stringify(["apprécier", "appréciation", "charisme", "merci", "gratitude", "élégant"]),
    color: "Blanc",
    pricePerStem: 380,
    description: "Le lisianthus exprime l'appréciation et le charisme avec grâce."
  },
  {
    name: "Alstroemeria",
    scientificName: "Alstroemeria",
    symbolism: "Amitié durable, dévotion",
    emotions: JSON.stringify(["amitié", "dévotion", "loyauté", "soutien"]),
    keywords: JSON.stringify(["ami", "amitié", "dévoué", "dévotion", "loyal", "soutien", "durable"]),
    color: "Rose",
    pricePerStem: 260,
    description: "L'alstroemeria célèbre l'amitié durable et la dévotion sincère."
  },
  {
    name: "Protea",
    scientificName: "Protea",
    symbolism: "Courage, transformation, diversité",
    emotions: JSON.stringify(["courage", "transformation", "diversité", "force"]),
    keywords: JSON.stringify(["courage", "courageux", "transformer", "transformation", "divers", "fort", "force"]),
    color: "Rose",
    pricePerStem: 550,
    description: "La protea symbolise le courage et la transformation audacieuse."
  },
  {
    name: "Amaryllis",
    scientificName: "Hippeastrum",
    symbolism: "Fierté, détermination, beauté radieuse",
    emotions: JSON.stringify(["fierté", "détermination", "beauté", "force"]),
    keywords: JSON.stringify(["fier", "fierté", "déterminé", "détermination", "beau", "fort"]),
    color: "Rouge",
    pricePerStem: 480,
    description: "L'amaryllis rayonne de fierté et de détermination puissante."
  },
  {
    name: "Gypsophile",
    scientificName: "Gypsophila",
    symbolism: "Pureté du cœur, innocence éternelle",
    emotions: JSON.stringify(["pureté", "innocence", "éternité", "douceur"]),
    keywords: JSON.stringify(["pur", "pureté", "innocent", "éternel", "doux", "délicat"]),
    color: "Blanc",
    pricePerStem: 120,
    description: "Le gypsophile incarne la pureté du cœur et l'innocence délicate."
  },
  {
    name: "Œillet rose",
    scientificName: "Dianthus caryophyllus",
    symbolism: "Gratitude maternelle, amour maternel",
    emotions: JSON.stringify(["gratitude", "amour_maternel", "tendresse", "reconnaissance"]),
    keywords: JSON.stringify(["mère", "maman", "maternel", "gratitude", "merci", "reconnaissance"]),
    color: "Rose",
    pricePerStem: 190,
    description: "L'œillet rose exprime la gratitude et l'amour maternel tendre."
  }
];

async function seedFlowers() {
  try {
    console.log("🌸 Début du peuplement de la base de données avec les fleurs...");
    
    for (const flower of flowersData) {
      await db.insert(flowers).values(flower);
      console.log(`✓ ${flower.name} ajoutée`);
    }
    
    console.log(`\n✅ ${flowersData.length} fleurs ont été ajoutées avec succès !`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du peuplement:", error);
    process.exit(1);
  }
}

seedFlowers();
