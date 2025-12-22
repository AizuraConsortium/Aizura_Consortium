#!/usr/bin/env tsx

import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function generateComponentTemplate(
  name: string,
  type: string,
  hasTheme: boolean,
  apps: string[]
): string {
  const pascalName = toPascalCase(name);

  return `import { ReactNode } from 'react';
import { cn${hasTheme ? ', themeClasses' : ''} } from '@shared/styles';

/**
 * Props for the ${pascalName} component.
 */
interface ${pascalName}Props {
  /**
   * Content to display inside the component.
   */
  children?: ReactNode;

  /**
   * Additional CSS classes to apply.
   */
  className?: string;${hasTheme ? `

  /**
   * Visual variant of the component.
   */
  variant?: 'default' | 'primary' | 'secondary';` : ''}
}

/**
 * ${pascalName} component.
 *
 * Used in: ${apps.join(', ')}
 *
 * @example
 * \`\`\`tsx
 * <${pascalName}>
 *   Content goes here
 * </${pascalName}>
 * \`\`\`
 *
 * @param props - Component props
 * @returns A styled ${pascalName} element
 */
export function ${pascalName}({
  children,
  className = '',${hasTheme ? `
  variant = 'default',` : ''}
}: ${pascalName}Props) {${hasTheme ? `
  const variantClasses = {
    default: 'bg-white text-gray-900',
    primary: themeClasses.button.primary,
    secondary: themeClasses.button.secondary,
  };
` : ''}
  return (
    <div className={cn(${hasTheme ? `variantClasses[variant], ` : ''}'p-4', className)}>
      {children}
    </div>
  );
}
`;
}

function generateTestTemplate(name: string): string {
  const pascalName = toPascalCase(name);

  return `import { render, screen } from '@testing-library/react';
import { ${pascalName} } from '../${pascalName}';

describe('${pascalName}', () => {
  it('renders children correctly', () => {
    render(<${pascalName}>Test Content</${pascalName}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <${pascalName} className="custom-class">Content</${pascalName}>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  // TODO: Add more tests for specific functionality
});
`;
}

function updateBarrelExport(category: string, componentName: string): void {
  const pascalName = toPascalCase(componentName);
  const indexPath = join(process.cwd(), 'shared', 'components', category, 'index.ts');

  let content = '';
  if (existsSync(indexPath)) {
    content = readFileSync(indexPath, 'utf-8');
  }

  const exportLine = `export { ${pascalName} } from './${pascalName}';\n`;

  if (!content.includes(exportLine)) {
    content += exportLine;
    writeFileSync(indexPath, content);
    console.log(`✅ Updated ${category}/index.ts barrel export`);
  }
}

async function main() {
  console.log('\n🎨 Shared Component Generator\n');

  const name = await question('Component name (e.g., StatusBadge): ');
  if (!name) {
    console.error('❌ Component name is required');
    process.exit(1);
  }

  const pascalName = toPascalCase(name);

  console.log('\nComponent categories:');
  console.log('  1. ui - UI design system components (buttons, cards, inputs)');
  console.log('  2. governance - Domain-specific governance components');
  console.log('  3. skeletons - Loading state components');
  console.log('  4. layout - Layout components (headers, footers, navigation)');

  const categoryInput = await question('\nSelect category (1-4): ');
  const categories = ['ui', 'governance', 'skeletons', 'layout'];
  const categoryIndex = parseInt(categoryInput) - 1;

  if (categoryIndex < 0 || categoryIndex >= categories.length) {
    console.error('❌ Invalid category selection');
    process.exit(1);
  }

  const category = categories[categoryIndex];

  const themeInput = await question('Support theme variants? (y/n): ');
  const hasTheme = themeInput.toLowerCase() === 'y';

  const appsInput = await question('Which apps will use this? (admin,client,website): ');
  const apps = appsInput.split(',').map(s => s.trim()).filter(Boolean);

  if (apps.length < 2) {
    console.log('\n⚠️  Warning: Component should be used by 2+ apps');
    const confirm = await question('Continue anyway? (y/n): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('Cancelled');
      process.exit(0);
    }
  }

  console.log('\n📝 Generating files...\n');

  const categoryDir = join(process.cwd(), 'shared', 'components', category);
  if (!existsSync(categoryDir)) {
    mkdirSync(categoryDir, { recursive: true });
  }

  const componentPath = join(categoryDir, `${pascalName}.tsx`);
  if (existsSync(componentPath)) {
    console.error(`❌ Component already exists: ${componentPath}`);
    process.exit(1);
  }

  writeFileSync(componentPath, generateComponentTemplate(name, category, hasTheme, apps));
  console.log(`✅ Created component: shared/components/${category}/${pascalName}.tsx`);

  const testDir = join(categoryDir, '__tests__');
  if (!existsSync(testDir)) {
    mkdirSync(testDir, { recursive: true });
  }

  const testPath = join(testDir, `${pascalName}.test.tsx`);
  writeFileSync(testPath, generateTestTemplate(name));
  console.log(`✅ Created test: shared/components/${category}/__tests__/${pascalName}.test.tsx`);

  updateBarrelExport(category, name);

  console.log('\n✨ Component generated successfully!\n');
  console.log('Next steps:');
  console.log('  1. Implement component functionality');
  console.log('  2. Add comprehensive JSDoc comments');
  console.log('  3. Write additional tests');
  console.log('  4. Update shared/components/README.md with documentation');
  console.log('  5. Test in target applications\n');

  rl.close();
}

main().catch(console.error);
