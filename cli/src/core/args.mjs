export function parseArgs(argv) {
  const positionals = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) {
      positionals.push(value);
      continue;
    }
    const [key, inlineValue] = value.slice(2).split('=', 2);
    if (inlineValue !== undefined) {
      options[key] = inlineValue;
    } else if (argv[index + 1] && !argv[index + 1].startsWith('--')) {
      options[key] = argv[++index];
    } else {
      options[key] = true;
    }
  }
  return { positionals, options };
}

export function required(options, name) {
  const value = options[name];
  if (!value || value === true) throw new Error(`Missing required option --${name}.`);
  return value;
}
