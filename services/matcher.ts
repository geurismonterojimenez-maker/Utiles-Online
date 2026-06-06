import { Product } from "../src/types";
import { saveMatchReview } from "./schoolListsService";
import { getTodayDateASTString, toSlug } from "./utils";

/**
 * LEVENSHTEIN COMPARATOR ENGINE (Optimized space complexity to O(min(a, b)))
 */
export function getLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Swap to ensure `b` is the shorter string, reducing space complexity
  if (a.length < b.length) {
    const tmp = a;
    a = b;
    b = tmp;
  }

  const row = new Int32Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) {
    row[i] = i;
  }

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1] + 1, row[j] + 1, prev + 1);
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }

  return row[b.length];
}

/**
 * HYBRID SCORES MATCHING COMPUTING (Levenshtein + overlap tokens + brand checks)
 */
export function calculateHybridMatchScore(
  userItemText: string,
  product: Product
): { confidence: number; explanation: string } {
  const source = userItemText
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  const target = product.name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // Compute normalized Levenshtein similarity
  const maxLen = Math.max(source.length, target.length);
  const levDist = getLevenshteinDistance(source, target);
  const levSimilarity = maxLen > 0 ? 1 - levDist / maxLen : 0;

  // Token word-by-word intersection checks
  const sourceTokens = source.split(/\s+/).filter((t) => t.length > 2);
  const targetTokens = target.split(/\s+/).filter((t) => t.length > 2);
  let overlapCount = 0;
  for (const sTok of sourceTokens) {
    if (targetTokens.some((tTok) => tTok.includes(sTok) || sTok.includes(tTok))) {
      overlapCount++;
    }
  }
  const tokenOverlapScore = sourceTokens.length > 0 ? overlapCount / sourceTokens.length : 0;

  // Brand association
  let brandScore = 0;
  if (product.brand && source.includes(product.brand.toLowerCase())) {
    brandScore = 1;
  }

  // Weight combination
  const confidence = 0.4 * tokenOverlapScore + 0.35 * levSimilarity + 0.25 * brandScore;
  const finalScore = Math.min(0.99, Math.max(0.1, confidence));

  let explanation = `Coincidencia local híbrida calculada en ${Math.round(finalScore * 100)}%. `;
  if (finalScore >= 0.85) {
    explanation += `Vínculo automático de alta confianza establecido con la marca '${product.brand}'.`;
  } else if (finalScore >= 0.6) {
    explanation += `Vínculo potencial de confianza media. Listo para revisión de los padres.`;
  } else {
    explanation += `Bajo nivel de coincidencia. Se sugirió el producto de la tienda como opción recomendada.`;
  }

  return {
    confidence: finalScore,
    explanation,
  };
}

/**
 * Helper for local matching of product text using the hybrid Levenshtein + token overlap engine
 */
export async function simulateProductMatching(text: string, cachedProducts: Product[]): Promise<any[]> {
  const items = text
    .split(/[\n,;•]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const result: any[] = [];

  for (const item of items) {
    let bestProduct: Product | null = null;
    let highestScore = 0;
    let explanation = "Se recomendó este artículo escolar estándar.";

    for (const prod of cachedProducts) {
      const matchResult = calculateHybridMatchScore(item, prod);
      if (matchResult.confidence > highestScore) {
        highestScore = matchResult.confidence;
        bestProduct = prod;
        explanation = matchResult.explanation;
      }
    }

    // Try extracting numbers representing quantities in item strings (e.g. "5 cuadernos" -> 5)
    const numMatch = item.match(/(\d+)/);
    const quantity = numMatch ? parseInt(numMatch[1], 10) : 1;
    const finalConf = bestProduct ? highestScore : 0.3;

    const matchedId = bestProduct ? bestProduct.id : "prod-01";
    const matchedName = bestProduct ? bestProduct.name : "Cuaderno de Caligrafía Mascot 96 pág.";

    const matchEntity = {
      productId: matchedId,
      searchedName: item,
      extractedQuantity: quantity,
      matchConfidence: finalConf,
      explanation,
    };

    // If the match has intermediate/moderate confidence (0.55 to 0.85), post it to our revision pipeline!
    if (bestProduct && finalConf >= 0.55 && finalConf < 0.85) {
      const newReview = {
        id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        searchedName: item,
        suggestedProductId: matchedId,
        suggestedProductName: matchedName,
        confidence: finalConf,
        explanation,
        createdAt: getTodayDateASTString(),
        status: "PENDING",
      };
      await saveMatchReview(newReview);
    }

    result.push(matchEntity);
  }

  return result.length > 0
    ? result
    : [
        {
          productId: "prod-01",
          searchedName: "Cuadernos escolares",
          extractedQuantity: 5,
          matchConfidence: 0.9,
          explanation: "Vínculo de alta confianza por palabra clave.",
        },
        {
          productId: "prod-09",
          searchedName: "Lápices de grafito",
          extractedQuantity: 2,
          matchConfidence: 0.9,
          explanation: "Vínculo de alta confianza por palabra clave.",
        },
      ];
}
