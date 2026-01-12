export function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Undefined env variable '${name}'`);
  }

  return value;
}