import { Transform } from 'class-transformer';
import sanitizeHtml, { IOptions } from 'sanitize-html';

//--------------------------------------------------------------

const defaultHtmlOptions: IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

export function Sanitize(options?: IOptions) {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const timestamp = Date.now();
    const placeholder = `<VALUE_NOT_ALLOWED_${timestamp}>`;

    let cleaned = value.trim();

    // 1. Remove HTML (XSS protection)
    cleaned = sanitizeHtml(cleaned, options ?? defaultHtmlOptions);

    // 2. Remove null bytes & control characters (replace with placeholder)
    cleaned = cleaned.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, placeholder);

    // 3. Block dangerous URI schemes (replace with placeholder)
    cleaned = cleaned.replace(/javascript:/gi, placeholder);
    cleaned = cleaned.replace(/data:/gi, placeholder);
    cleaned = cleaned.replace(/vbscript:/gi, placeholder);

    // 4. Replace SQL injection keywords with placeholder
    cleaned = cleaned.replace(
      /\b(SELECT|UPDATE|DELETE|INSERT|DROP|UNION|ALTER|CREATE|EXEC)\b/gi,
      placeholder
    );

    // 5. Prevent path traversal
    cleaned = cleaned.replace(/\.\.(\/|\\)/g, placeholder);

    // 6. Collapse multiple placeholders/spaces
    cleaned = cleaned.replace(
      new RegExp(`(\\s*${placeholder}\\s*)+`, 'g'),
      ` ${placeholder} `
    );
    cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

    return cleaned;
  });
}
