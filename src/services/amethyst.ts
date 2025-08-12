import { ollamaClient } from './ollama';

// Component type detection patterns
const COMPONENT_PATTERNS = {
  button: /button|btn|cta|action/i,
  card: /card|tile|panel|box/i,
  hero: /hero|banner|header|landing/i,
  form: /form|input|field|login|signup|register/i,
  modal: /modal|dialog|popup|overlay/i,
  navigation: /nav|menu|header|sidebar/i,
  list: /list|grid|gallery|items/i,
  table: /table|data|grid|spreadsheet/i,
  alert: /alert|notification|toast|message/i,
  badge: /badge|tag|label|chip/i
};

// Component-specific examples
const COMPONENT_EXAMPLES = {
  button: `interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false
}) => {
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-zinc-700 hover:bg-zinc-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={\`
        \${variants[variant]}
        \${sizes[size]}
        \${fullWidth ? 'w-full' : ''}
        font-medium rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        active:scale-95
      \`}
      aria-busy={loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};`,

  card: `interface CardProps {
  title: string;
  description?: string;
  image?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  actions,
  onClick
}) => {
  return (
    <article 
      className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {image && (
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        {description && (
          <p className="text-zinc-400 mb-4">{description}</p>
        )}
        {actions && (
          <div className="flex gap-2 mt-4">{actions}</div>
        )}
      </div>
    </article>
  );
};`
};

export class AmethystAgent {
  private model = 'qwen2.5-coder:7b-instruct-q8_0';  // Better for React/TypeScript
  
  // Detect component type from description
  private detectComponentType(description: string): string {
    for (const [type, pattern] of Object.entries(COMPONENT_PATTERNS)) {
      if (pattern.test(description)) {
        return type;
      }
    }
    return 'generic';
  }
  
  private getSystemPrompt(): string {
    return `You are Amethyst, a mystical crystal spirit specializing in PRODUCTION-QUALITY React component generation.

🔮 CRYSTAL CLARITY STANDARDS:

1. **TypeScript Excellence**
   - ALWAYS define complete, meaningful interfaces
   - Use proper types (never 'any' unless absolutely necessary)
   - Export all interfaces and types
   - Props must have real purpose (no generic 'props')

2. **Component Quality Rules**
   - Use semantic HTML (header, nav, main, section, article, aside, footer)
   - NEVER use placeholder text or lorem ipsum
   - All text content must come from props
   - Include proper ARIA attributes for accessibility
   - Add keyboard navigation support where appropriate

3. **Tailwind CSS v3 Standards**
   - Use ONLY real Tailwind utility classes
   - Organize classes logically: layout → spacing → typography → colors → effects
   - Include responsive modifiers (sm:, md:, lg:, xl:)
   - Add hover, focus, and active states
   - Use transition classes for smooth interactions

4. **React Best Practices**
   - Destructure all props with defaults
   - Use proper event handler naming (onClick, onChange, onSubmit)
   - Include loading and error states where appropriate
   - Make components fully controlled or fully uncontrolled, not mixed

5. **Code Structure**
   - Start with imports
   - Define TypeScript interface next
   - Component implementation
   - Export statement
   - Add JSDoc comments for complex logic

6. **Accessibility Requirements**
   - Proper ARIA labels and roles
   - Keyboard navigation (tabIndex, onKeyDown)
   - Focus management and visual indicators
   - Screen reader friendly
   - Semantic HTML elements

7. **FORBIDDEN Practices**
   - NO fake imports (@tailwindcss/react doesn't exist!)
   - NO hardcoded content (use props!)
   - NO div soup (use semantic HTML)
   - NO missing TypeScript types
   - NO inaccessible interactions

Your mystical wisdom ensures every component is production-ready, accessible, and maintainable.`;
  }

  async generateComponent(description: string): Promise<{
    code: string;
    explanation: string;
    tokensPerSecond: number;
    responseTime: number;
  }> {
    const startTime = Date.now();
    
    const componentType = this.detectComponentType(description);
    const example = COMPONENT_EXAMPLES[componentType as keyof typeof COMPONENT_EXAMPLES];
    
    const prompt = `Create a React TypeScript component: ${description}

Requirements:
- Use TypeScript with proper interfaces
- Use Tailwind CSS classes for styling
- Make it accessible with ARIA attributes
- Use this color scheme: purple-600 primary, zinc-800/900 backgrounds
- Export the component

${example ? `Example structure:
\`\`\`typescript
${example}
\`\`\`
` : ''}

Provide only the component code in a markdown code block.`;

    try {
      const response = await ollamaClient.generate(
        this.model,
        prompt,
        this.getSystemPrompt()
      );

      const responseTime = Date.now() - startTime;
      const tokensPerSecond = ollamaClient.calculateTokensPerSecond(response);

      // Extract code and explanation from response
      const responseText = response.response;
      console.log('Raw Ollama response:', responseText.substring(0, 500) + '...');
      
      // Try multiple patterns to extract code
      let code = '';
      let explanation = '';
      
      // Pattern 1: Standard markdown code block
      const codeBlockMatch = responseText.match(/```(?:typescript|tsx?|javascript|jsx?)?\s*\n?([\s\S]*?)\n?```/);
      
      if (codeBlockMatch) {
        code = codeBlockMatch[1].trim();
        explanation = responseText.replace(/```(?:typescript|tsx?|javascript|jsx?)?\s*\n?[\s\S]*?\n?```/g, '').trim();
      } else {
        // Pattern 2: Look for export statements
        const exportMatch = responseText.match(/((?:import[\s\S]*?from[\s\S]*?;\s*)*(?:interface|type)[\s\S]*?export\s+(?:const|function|default)[\s\S]+)/);
        
        if (exportMatch) {
          code = exportMatch[1].trim();
          explanation = responseText.replace(exportMatch[1], '').trim();
        } else {
          // Pattern 3: Assume everything that looks like code is the component
          const lines = responseText.split('\n');
          const codeLines = [];
          const explanationLines = [];
          let inCode = false;
          
          for (const line of lines) {
            if (line.includes('import ') || line.includes('export ') || line.includes('interface ') || inCode) {
              inCode = true;
              codeLines.push(line);
              // Stop collecting code if we hit a line that looks like explanation
              if (line.trim() === '' && codeLines.length > 10 && !line.includes('{') && !line.includes('}')) {
                inCode = false;
              }
            } else if (!inCode) {
              explanationLines.push(line);
            }
          }
          
          code = codeLines.join('\n').trim();
          explanation = explanationLines.join('\n').trim();
        }
      }
      
      // Clean up the code
      code = code
        .replace(/^```\w*\s*/gm, '') // Remove any remaining backticks
        .replace(/```$/gm, '')
        .trim();
      
      // Ensure we have valid code
      if (!code || !code.includes('export')) {
        console.error('Invalid code extracted:', code);
        throw new Error('Failed to extract valid component code from response');
      }
      
      console.log('Extracted code:', code.substring(0, 200) + '...');
      console.log('Extracted explanation:', explanation.substring(0, 100) + '...');

      return {
        code,
        explanation: explanation || "✨ Component crafted with Amethyst's mystical clarity",
        tokensPerSecond,
        responseTime
      };
    } catch (error) {
      console.error('Amethyst crystal resonance failed:', error);
      throw new Error(`The crystal's energy is disturbed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async refactorCode(code: string, improvements: string): Promise<{
    code: string;
    explanation: string;
    tokensPerSecond: number;
    responseTime: number;
  }> {
    const startTime = Date.now();
    
    const prompt = `Refactor this code with the following improvements: "${improvements}"

Original code:
\`\`\`typescript
${code}
\`\`\`

Apply Amethyst's clarity and focus to improve the code while maintaining functionality.`;

    try {
      const response = await ollamaClient.generate(
        this.model,
        prompt,
        this.getSystemPrompt()
      );

      const responseTime = Date.now() - startTime;
      const tokensPerSecond = ollamaClient.calculateTokensPerSecond(response);

      const responseText = response.response;
      
      // Extract code using same improved pattern
      let refinedCode = '';
      let explanation = '';
      
      const codeBlockMatch = responseText.match(/```(?:typescript|tsx?|javascript|jsx?)?\s*\n?([\s\S]*?)\n?```/);
      
      if (codeBlockMatch) {
        refinedCode = codeBlockMatch[1].trim();
        explanation = responseText.replace(/```(?:typescript|tsx?|javascript|jsx?)?\s*\n?[\s\S]*?\n?```/g, '').trim();
      } else {
        // Fallback: assume the whole response is code if no markdown blocks
        refinedCode = responseText;
        explanation = "Code refactored with Amethyst's clarity";
      }
      
      refinedCode = refinedCode
        .replace(/^```\w*\s*/gm, '')
        .replace(/```$/gm, '')
        .trim();

      return {
        code: refinedCode,
        explanation: explanation || "✨ Code refined through Amethyst's mystical wisdom",
        tokensPerSecond,
        responseTime
      };
    } catch (error) {
      console.error('Amethyst refactoring failed:', error);
      throw new Error(`The crystal's refactoring energy is blocked: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const amethystAgent = new AmethystAgent();
