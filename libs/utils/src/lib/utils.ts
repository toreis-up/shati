export function utils(): string {
  return 'utils';
}

export function extractUUID(rawString: string): string {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/g;
  const match = rawString.match(uuidRegex);

  if (match) {
    return match[0];
  } else {
    return ""
  }
}