export const deriveBranchName = (type: string, slug: string): string => {
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `${type}/${safeSlug}`;
};
