class Argvs {
  // Constructor
  constructor() {
    // Save Argvs
    this.cache = {};

    // Prefix
    this.exp = new RegExp(`^--`);

    // Execute
    return this;
  }

  pick(argvs = JSON.parse(process.env.npm_config_argv)) {
    // Filter Argvs
    return argvs.original
      ? argvs.original.filter(cmd => this.exp.test(cmd))
      : {};
  }

  tolerant(argvs, quota = false) {
    // Map Chance
    argvs.map(
      // Each
      param => (
        // Remove Prefix
        (param = param.replace(this.exp, "")),
        // Tolerant Param
        param.replace(
          // RegExp
          /^([\w\.\-\:\/]+)\=?(.*)/g,
          // Transfer
          ($0, $1, $2) => (
            // in Cache with Quota
            (this.cache[$1] = quota ? `"${$2 || true}"` : `${$2 || true}`), $0
          )
        )
      )
    );

    return argvs;
  }

  get(name) {
    // Argvs
    const Argvs = this.tolerant(this.pick(), name === true);

    // Result
    return name ? this.cache[name] : this.cache;
  }
}

// Export
module.exports = new Argvs();
