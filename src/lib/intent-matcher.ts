import { knowledgeBase, QAPair } from './chatbot-knowledge-base';

interface MatchResult {
  matched: boolean;
  qa?: QAPair;
  confidence: number;
}

export class IntentMatcher {
  // Calculate similarity between two strings
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    if (s1 === s2) return 1.0;
    if (s2.includes(s1) || s1.includes(s2)) return 0.8;
    
    // Word overlap calculation
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const intersection = words1.filter(w => words2.includes(w));
    
    return intersection.length / Math.max(words1.length, words2.length);
  }
  
  // Find best matching Q&A for user message
  findBestMatch(message: string): MatchResult {
    const lowerMsg = message.toLowerCase().trim();
    
    // Check each Q&A pair
    const matches: { qa: QAPair; score: number }[] = [];
    
    for (const qa of knowledgeBase) {
      let bestScore = 0;
      
      // Check main question
      bestScore = Math.max(bestScore, this.calculateSimilarity(lowerMsg, qa.question.toLowerCase()));
      
      // Check variants
      for (const variant of qa.variants) {
        const score = this.calculateSimilarity(lowerMsg, variant.toLowerCase());
        bestScore = Math.max(bestScore, score);
      }
      
      // Boost score for category matches if message has keywords
      if (lowerMsg.includes('course') && qa.category === 'academy') bestScore += 0.1;
      if (lowerMsg.includes('price') && qa.category === 'academy') bestScore += 0.1;
      if (lowerMsg.includes('agency') && qa.category === 'agency') bestScore += 0.1;
      if (lowerMsg.includes('contact') && qa.category === 'contact') bestScore += 0.1;
      
      if (bestScore > 0.3) { // Threshold for match
        matches.push({ qa, score: bestScore });
      }
    }
    
    // Sort by score (highest first) and priority
    matches.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.qa.priority - a.qa.priority;
    });
    
    if (matches.length > 0 && matches[0].score >= 0.4) {
      return {
        matched: true,
        qa: matches[0].qa,
        confidence: matches[0].score
      };
    }
    
    return { matched: false, confidence: 0 };
  }
  
  // Detect conversation context (for multi-turn)
  detectContext(message: string, previousMessages: string[]): string | null {
    const lowerMsg = message.toLowerCase();
    
    // Follow-up detection
    if (previousMessages.length > 0) {
      const lastUserMsg = previousMessages[previousMessages.length - 1];
      
      if (lastUserMsg.includes('course') && (lowerMsg.includes('price') || lowerMsg.includes('cost'))) {
        return 'course_pricing';
      }
      
      if (lastUserMsg.includes('how to apply') && lowerMsg.includes('payment')) {
        return 'payment_after_application';
      }
    }
    
    return null;
  }
}

export const intentMatcher = new IntentMatcher();