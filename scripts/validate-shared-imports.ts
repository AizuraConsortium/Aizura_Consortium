#!/usr/bin/env tsx

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface Violation {
  file: string;
  line: number;
  importPath: string;
  type: 'app-import' | 'invalid-pattern';
}

const ALLOWED_IMPORT_PATTERNS = [
  /^react/,
  /^react-dom/,
  /^react-router/,
  /^react-router-dom/,
  /^lucide-react/,
  /^@supabase/,
  /^zustand/,
  /^clsx/,
  /^@shared/,
  /^\.\.?\//,
];

const FORBIDDEN_APP_FOLDERS = ['admin', 'client', 'website', 'backend'];

function getAllFiles(dir: string, files: string[] = []): string[] {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '__tests__' && item !== 'dist') {
        getAllFiles(fullPath, files);
      }
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function checkImportsInFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const importMatch = line.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/);
    if (!importMatch) return;

    const importPath = importMatch[1];

    for (const forbiddenFolder of FORBIDDEN_APP_FOLDERS) {
      if (importPath.includes(`/${forbiddenFolder}/`) || importPath.startsWith(`../${forbiddenFolder}`)) {
        violations.push({
          file: filePath,
          line: index + 1,
          importPath,
          type: 'app-import',
        });
      }
    }

    const isRelativeImport = importPath.startsWith('.');
    if (isRelativeImport) {
      const normalizedPath = importPath.replace(/^\.\.?\//, '');

      if (normalizedPath.includes('../shared') || normalizedPath.includes('../../shared')) {
        violations.push({
          file: filePath,
          line: index + 1,
          importPath,
          type: 'invalid-pattern',
        });
      }
    }
  });

  return violations;
}

function validateSharedImports(): void {
  const sharedDir = join(process.cwd(), 'shared');
  const files = getAllFiles(sharedDir);

  console.log(`\n🔍 Validating imports in ${files.length} shared files...\n`);

  const allViolations: Violation[] = [];

  for (const file of files) {
    const violations = checkImportsInFile(file);
    allViolations.push(...violations);
  }

  if (allViolations.length === 0) {
    console.log('✅ All shared imports are valid!\n');
    console.log('No app-specific imports detected.');
    console.log('Shared folder architecture is clean.\n');
    process.exit(0);
  }

  console.error('❌ Found import violations in shared folder:\n');

  const violationsByType = {
    'app-import': allViolations.filter(v => v.type === 'app-import'),
    'invalid-pattern': allViolations.filter(v => v.type === 'invalid-pattern'),
  };

  if (violationsByType['app-import'].length > 0) {
    console.error('🚫 App-Specific Imports (CRITICAL):');
    console.error('These files import from app folders (admin, client, website, backend):\n');

    violationsByType['app-import'].forEach(v => {
      const relativePath = relative(process.cwd(), v.file);
      console.error(`  ${relativePath}:${v.line}`);
      console.error(`    Import: ${v.importPath}`);
      console.error('');
    });
  }

  if (violationsByType['invalid-pattern'].length > 0) {
    console.error('⚠️  Invalid Import Patterns:');
    console.error('These files use relative imports that should use @shared alias:\n');

    violationsByType['invalid-pattern'].forEach(v => {
      const relativePath = relative(process.cwd(), v.file);
      console.error(`  ${relativePath}:${v.line}`);
      console.error(`    Import: ${v.importPath}`);
      console.error('');
    });
  }

  console.error('\n📚 Guidelines:\n');
  console.error('1. Shared code MUST NOT import from app folders (admin, client, website, backend)');
  console.error('2. Use @shared alias for imports within shared folder');
  console.error('3. Only import from allowed packages (react, zustand, @supabase, etc.)');
  console.error('4. See shared/README.md for full guidelines\n');

  console.error(`\n❌ Total violations: ${allViolations.length}\n`);
  process.exit(1);
}

validateSharedImports();
