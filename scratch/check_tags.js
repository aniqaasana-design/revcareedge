const fs = require('fs');
const html = fs.readFileSync('c:/Users/muham/Desktop/web/index.html', 'utf8');

// A simple stack-based parser to check tag mismatch
const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*)?>/g;
const stack = [];
let match;
let errors = [];

const selfClosingTags = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

let lineNum = 1;
let lastIndex = 0;

for (let i = 0; i < html.length; i++) {
  if (html[i] === '\n') lineNum++;
}

// Reset line count and find line numbers dynamically
function getLineNumber(index) {
  const sub = html.substring(0, index);
  return sub.split('\n').length;
}

while ((match = tagRegex.exec(html)) !== null) {
  const fullTag = match[0];
  const tagName = match[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>') || selfClosingTags.has(tagName);
  const line = getLineNumber(match.index);

  if (isSelfClosing) {
    continue;
  }

  if (!isClosing) {
    stack.push({ name: tagName, line, tag: fullTag });
  } else {
    if (stack.length === 0) {
      errors.push(`Extra closing tag </${tagName}> at line ${line}`);
    } else {
      const top = stack.pop();
      if (top.name !== tagName) {
        errors.push(`Mismatch: opened <${top.name}> at line ${top.line} but closed with </${tagName}> at line ${line}`);
        // Put top back to recover parser context
        stack.push(top);
      }
    }
  }
}

while (stack.length > 0) {
  const top = stack.pop();
  errors.push(`Unclosed tag <${top.name}> opened at line ${top.line}`);
}

console.log(JSON.stringify(errors, null, 2));
