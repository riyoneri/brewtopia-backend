export default function normalizeCategory(name: string) {
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  return name.toLowerCase().replace(/ /g, "");
}
