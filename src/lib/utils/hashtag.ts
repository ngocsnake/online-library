export const extractHashtags = (text: string): string[] => {
  const hashtagPattern = /#[a-zA-Z0-9_]+/g;
  const hashtags = text.match(hashtagPattern);
  return hashtags ? hashtags : [];
};

export const removeHashtags = (text: string): string => {
  // Regular expression to match hashtags
  const hashtagPattern = /#[a-zA-Z0-9_]+/g;
  // Replace all hashtags with an empty string
  return text.replace(hashtagPattern, "").trim();
};
