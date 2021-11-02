#!/usr/bin/env node

// Use File System
const fs = require('fs');

// Use Path
const path = require('path');

// Use Chalk
const chalk = require('chalk');

// Use Compressing for Zip
const compressing = require('compressing');

// Use Cross-Env-Argv
const argvs = require('cross-env-argv')(process);

// Set Root
const root = process.cwd(); // __dirname

// Set Resolve
const resolve = (uri) => path.join(root, uri);

// Set Read Path
const read = (uri) => {
  // Get Group
  const group = uri.split('/');

  // Set Length
  const length = group.length - 1;

  // Get Last of Group
  const last = group[length];

  // Get Suffix
  const suffix = last.split('.');

  // Set Suffix
  group.suffix = suffix.pop();

  // Reset Last
  group[length] = suffix.shift();

  // Export
  return group;
};

// Get Dir from Uri
const refine = (uri) => {
  // Set Group
  const group = read(uri);

  // Pop Last
  group.pop();

  // Export Dir
  return group.join('/');
};

/**
 * Compress
 * ========== ========== ==========
 * @param to { path_to_file }
 * @param from { path_to_dir }
 * ========== ========== ==========
 */
const compress = (to, from) => {
  // Get Dir
  const dir = refine(to);

  // Check Dir First
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Set Path Resolve
  from = resolve(argvs.from || from);
  to = resolve(argvs.to || to);

  // Zip
  return new Promise((resolve, reject) => {
    // Use Compressing as Promise
    compressing.zip
      // Compress
      .compressDir(from, to)
      // Success
      .then(() => {
        console.log(chalk.yellow(`TIP: 压缩完成，已压缩至目录【${to}】`));
        resolve({ from, to });
      })
      // Error
      .catch((error) => {
        console.log(chalk.red('TIP: 压缩失败'));
        console.error(error);
        reject(error);
      });

    // Exit Process
    process.exit(1);
  });
};

// Export as API
compress('./deploy/dist.zip', './dist');
