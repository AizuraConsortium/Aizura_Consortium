#!/usr/bin/env tsx

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface ComponentUsage {
  name: string;
  totalUsage: number;
  admin: number;
  client: number;
  website: number;
  backend: number;
  files: string[];
}

interface UsageReport {
  components: ComponentUsage[];
  hooks: ComponentUsage[];
  totalSharedItems: number;
  unusedItems: string[];
  singleAppItems: Array<{ name: string; app: string }>;
}

function getAllFiles(dir: string, files: string[] = []): string[] {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== 'dist' && item !== '__tests__') {
        getAllFiles(fullPath, files);
      }
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractExportsFromFile(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf-8');
  const exports: string[] = [];

  const exportMatches = content.matchAll(/export\s+(?:function|const|class|interface|type)\s+(\w+)/g);
  for (const match of exportMatches) {
    exports.push(match[1]);
  }

  const namedExports = content.matchAll(/export\s+{\s*([^}]+)\s*}/g);
  for (const match of namedExports) {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]);
    exports.push(...names);
  }

  return exports;
}

function getAppFromPath(filePath: string): string | null {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/admin/')) return 'admin';
  if (normalized.includes('/client/')) return 'client';
  if (normalized.includes('/website/')) return 'website';
  if (normalized.includes('/backend/')) return 'backend';
  return null;
}

function analyzeUsage(): UsageReport {
  const projectRoot = process.cwd();
  const sharedDir = join(projectRoot, 'shared');

  const componentFiles = getAllFiles(join(sharedDir, 'components')).filter(
    f => !f.includes('__tests__') && !f.includes('index.ts')
  );

  const hookFiles = getAllFiles(join(sharedDir, 'hooks')).filter(
    f => !f.includes('__tests__') && !f.includes('index.ts')
  );

  const allSharedExports = new Map<string, ComponentUsage>();

  for (const file of [...componentFiles, ...hookFiles]) {
    const exports = extractExportsFromFile(file);
    for (const exp of exports) {
      if (!allSharedExports.has(exp)) {
        allSharedExports.set(exp, {
          name: exp,
          totalUsage: 0,
          admin: 0,
          client: 0,
          website: 0,
          backend: 0,
          files: [],
        });
      }
    }
  }

  const appFolders = ['admin', 'client', 'website', 'backend'];
  for (const app of appFolders) {
    const appDir = join(projectRoot, app);
    const appFiles = getAllFiles(appDir);

    for (const file of appFiles) {
      const content = readFileSync(file, 'utf-8');

      for (const [name, usage] of allSharedExports) {
        const importRegex = new RegExp(`\\b${name}\\b`);
        if (importRegex.test(content) && content.includes('@shared')) {
          usage.totalUsage++;
          usage[app as keyof Omit<ComponentUsage, 'name' | 'totalUsage' | 'files'>]++;
          usage.files.push(relative(projectRoot, file));
        }
      }
    }
  }

  const components = Array.from(allSharedExports.values()).filter(u =>
    componentFiles.some(f => extractExportsFromFile(f).includes(u.name))
  );

  const hooks = Array.from(allSharedExports.values()).filter(u =>
    hookFiles.some(f => extractExportsFromFile(f).includes(u.name))
  );

  const unusedItems = Array.from(allSharedExports.values())
    .filter(u => u.totalUsage === 0)
    .map(u => u.name);

  const singleAppItems = Array.from(allSharedExports.values())
    .filter(u => {
      const apps = [u.admin, u.client, u.website, u.backend].filter(count => count > 0);
      return apps.length === 1 && u.totalUsage > 0;
    })
    .map(u => ({
      name: u.name,
      app: u.admin > 0 ? 'admin' : u.client > 0 ? 'client' : u.website > 0 ? 'website' : 'backend',
    }));

  return {
    components,
    hooks,
    totalSharedItems: allSharedExports.size,
    unusedItems,
    singleAppItems,
  };
}

function printReport(report: UsageReport): void {
  console.log('\n📊 Shared Code Usage Analysis\n');
  console.log('='.repeat(80));

  console.log('\n📦 COMPONENTS\n');
  const sortedComponents = report.components.sort((a, b) => b.totalUsage - a.totalUsage);

  for (const comp of sortedComponents) {
    const appsUsing = [
      comp.admin > 0 ? `Admin: ${comp.admin}` : null,
      comp.client > 0 ? `Client: ${comp.client}` : null,
      comp.website > 0 ? `Website: ${comp.website}` : null,
      comp.backend > 0 ? `Backend: ${comp.backend}` : null,
    ].filter(Boolean).join(', ');

    const status = comp.totalUsage === 0 ? '❌ UNUSED' : comp.totalUsage === 1 ? '⚠️  Low Use' : '✅';
    console.log(`${status} ${comp.name}: ${comp.totalUsage} usages (${appsUsing || 'None'})`);
  }

  console.log('\n🎣 HOOKS\n');
  const sortedHooks = report.hooks.sort((a, b) => b.totalUsage - a.totalUsage);

  for (const hook of sortedHooks) {
    const appsUsing = [
      hook.admin > 0 ? `Admin: ${hook.admin}` : null,
      hook.client > 0 ? `Client: ${hook.client}` : null,
      hook.website > 0 ? `Website: ${hook.website}` : null,
      hook.backend > 0 ? `Backend: ${hook.backend}` : null,
    ].filter(Boolean).join(', ');

    const status = hook.totalUsage === 0 ? '❌ UNUSED' : hook.totalUsage === 1 ? '⚠️  Low Use' : '✅';
    console.log(`${status} ${hook.name}: ${hook.totalUsage} usages (${appsUsing || 'None'})`);
  }

  if (report.unusedItems.length > 0) {
    console.log('\n\n🗑️  UNUSED ITEMS (Consider Removing)\n');
    for (const item of report.unusedItems) {
      console.log(`  - ${item}`);
    }
  }

  if (report.singleAppItems.length > 0) {
    console.log('\n\n⚠️  SINGLE-APP ITEMS (Consider Moving to App Folder)\n');
    for (const item of report.singleAppItems) {
      console.log(`  - ${item.name} (only used in ${item.app})`);
    }
  }

  console.log('\n\n📈 SUMMARY\n');
  console.log(`Total shared items: ${report.totalSharedItems}`);
  console.log(`Components: ${report.components.length}`);
  console.log(`Hooks: ${report.hooks.length}`);
  console.log(`Unused items: ${report.unusedItems.length}`);
  console.log(`Single-app items: ${report.singleAppItems.length}`);

  const wellUsedItems = [...report.components, ...report.hooks].filter(
    u => u.totalUsage > 1 && [u.admin, u.client, u.website, u.backend].filter(c => c > 0).length >= 2
  );
  console.log(`Well-used multi-app items: ${wellUsedItems.length}`);

  const utilizationRate = ((wellUsedItems.length / report.totalSharedItems) * 100).toFixed(1);
  console.log(`Utilization rate: ${utilizationRate}%`);

  console.log('\n' + '='.repeat(80));

  if (report.unusedItems.length > 0 || report.singleAppItems.length > 0) {
    console.log('\n💡 RECOMMENDATIONS\n');

    if (report.unusedItems.length > 0) {
      console.log(`• Remove ${report.unusedItems.length} unused items to reduce bundle size`);
    }

    if (report.singleAppItems.length > 0) {
      console.log(`• Evaluate ${report.singleAppItems.length} single-app items for relocation`);
    }

    console.log('• Review items with low usage (1-2 usages) for necessity');
    console.log('• Consider promoting frequently used app-specific code to shared\n');
  } else {
    console.log('\n✨ Shared folder is well-maintained! No action needed.\n');
  }
}

const report = analyzeUsage();
printReport(report);
