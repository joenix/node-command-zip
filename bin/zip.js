#!/usr/bin/env node

// Use File System
const fs = require('fs');

// Use Path
const path = require('path');

// Use Chalk
const chalk = require('chalk');

// Use Compressing for Zip
const compressing = require('compressing-custom');

// Use Cross-Env-Argv
const argvs = require('cross-env-argv')(process);

// Set Root
const root = process.cwd(); // __dirname

// Set Resolve
const resolve = uri => path.join(root, uri);

// Set Noop
const noop = () => {};

// Set Read Path
const read = uri => {
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
const refine = uri => {
  // Set Group
  const group = read(uri);

  // Pop Last
  group.pop();

  // Export Dir
  return group.join('/');
};

// Check Dir Existence
const check = (uri, { success = noop, failed = noop }) => {
  return fs.existsSync(uri) ? success(uri) : failed(uri);
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
  check(dir, { failed: uri => fs.mkdirSync(uri) });

  // Set Path Resolve
  from = resolve(argvs.from || from);
  to = resolve(argvs.to || to);

  // Check Path
  check(from, {
    failed: uri => console.log(chalk.red(`TIP: from 目录不存在 ${uri}`)),
  });

  // Zip
  return new Promise((resolve, reject) => {
    // Use Compressing as Promise
    compressing.zip
      // Compress
      .compressDir(from, to, {
        // Use Custom for Relative Path
        custom(opts) {
          // Set Exp
          const exp = new RegExp(`^${from.match(/\w+\/?$/).shift()}\/`);

          // RegExp
          opts.relativePath = opts.relativePath.replace(exp, '');

          // Usage
          return opts;
        },
      })
      // Success
      .then(() => {
        console.log(chalk.yellow(`TIP: 压缩完成，已压缩至目录【${to}】`));
        resolve({ from, to });
      })
      // Error
      .catch(error => {
        console.log(chalk.red('TIP: 压缩失败'));
        console.error(error);
        reject(error);
      })
      // Finally
      .finally(() => process.exit());
  });
};

// Export as API
compress('./deploy/dist.zip', './dist');
