import { Transform } from 'class-transformer';
import sanitizeHtml, { IOptions } from 'sanitize-html';

export function Sanitize(options?: IOptions) {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return sanitizeHtml(
      trimmed,
      options ?? { allowedTags: [], allowedAttributes: {} }
    );
  });
}
