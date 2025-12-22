#!/usr/bin/env tsx

import { writeFileSync, existsSync, readFileSync } from 'fs';
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

function toCamelCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

function generateHookTemplate(name: string, purpose: string, apps: string[]): string {
  const hookName = name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase() + name.slice(1)}`;

  return `import { useState, useEffect } from 'react';

/**
 * ${hookName} - ${purpose}
 *
 * Used in: ${apps.join(', ')}
 *
 * @example
 * \`\`\`tsx
 * function MyComponent() {
 *   const value = ${hookName}();
 *
 *   return <div>{value}</div>;
 * }
 * \`\`\`
 *
 * @returns The hook's return value
 */
export function ${hookName}() {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // TODO: Implement hook logic

    return () => {
      // Cleanup logic
    };
  }, []);

  return value;
}
`;
}

function generateHookTestTemplate(name: string): string {
  const hookName = name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase() + name.slice(1)}`;

  return `import { renderHook, act } from '@testing-library/react';
import { ${hookName} } from '../${hookName}';

describe('${hookName}', () => {
  it('returns initial value', () => {
    const { result } = renderHook(() => ${hookName}());
    expect(result.current).toBeDefined();
  });

  it('handles updates correctly', () => {
    const { result } = renderHook(() => ${hookName}());

    act(() => {
      // TODO: Trigger hook updates
    });

    // TODO: Add assertions
  });

  it('cleans up properly on unmount', () => {
    const { unmount } = renderHook(() => ${hookName}());
    unmount();
    // TODO: Verify cleanup
  });

  // TODO: Add more tests for specific functionality
});
`;
}

function updateHooksIndex(hookName: string): void {
  const indexPath = join(process.cwd(), 'shared', 'hooks', 'index.ts');

  let content = '';
  if (existsSync(indexPath)) {
    content = readFileSync(indexPath, 'utf-8');
  }

  const exportLine = `export { ${hookName} } from './${hookName}';\n`;

  if (!content.includes(exportLine)) {
    content += exportLine;
    writeFileSync(indexPath, content);
    console.log('✅ Updated hooks/index.ts barrel export');
  }
}

async function main() {
  console.log('\n🎣 Shared Hook Generator\n');

  const nameInput = await question('Hook name (e.g., useDebounce or Debounce): ');
  if (!nameInput) {
    console.error('❌ Hook name is required');
    process.exit(1);
  }

  const hookName = nameInput.startsWith('use')
    ? nameInput
    : `use${nameInput.charAt(0).toUpperCase() + nameInput.slice(1)}`;

  const purpose = await question('Hook purpose (one line description): ');
  if (!purpose) {
    console.error('❌ Purpose is required');
    process.exit(1);
  }

  const appsInput = await question('Which apps will use this? (admin,client,website): ');
  const apps = appsInput.split(',').map(s => s.trim()).filter(Boolean);

  if (apps.length < 2) {
    console.log('\n⚠️  Warning: Hook should be used by 2+ apps');
    const confirm = await question('Continue anyway? (y/n): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('Cancelled');
      process.exit(0);
    }
  }

  console.log('\n📝 Generating files...\n');

  const hooksDir = join(process.cwd(), 'shared', 'hooks');
  const hookPath = join(hooksDir, `${hookName}.ts`);

  if (existsSync(hookPath)) {
    console.error(`❌ Hook already exists: ${hookPath}`);
    process.exit(1);
  }

  writeFileSync(hookPath, generateHookTemplate(hookName, purpose, apps));
  console.log(`✅ Created hook: shared/hooks/${hookName}.ts`);

  const testDir = join(hooksDir, '__tests__');
  const testPath = join(testDir, `${hookName}.test.ts`);
  writeFileSync(testPath, generateHookTestTemplate(hookName));
  console.log(`✅ Created test: shared/hooks/__tests__/${hookName}.test.ts`);

  updateHooksIndex(hookName);

  console.log('\n✨ Hook generated successfully!\n');
  console.log('Next steps:');
  console.log('  1. Implement hook functionality');
  console.log('  2. Add comprehensive JSDoc comments');
  console.log('  3. Write additional tests (edge cases, cleanup, etc.)');
  console.log('  4. Update shared/hooks/README.md with documentation');
  console.log('  5. Test in target applications\n');

  rl.close();
}

main().catch(console.error);
