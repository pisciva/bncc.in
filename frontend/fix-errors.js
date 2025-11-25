const fs = require('fs');

const fixes = [
  // Fix apostrophes
  { file: 'app/forgot-password/page.tsx', from: "It's okay", to: "It&apos;s okay" },
  { file: 'app/forgot-password/page.tsx', from: "we'll send", to: "we&apos;ll send" },
  { file: 'app/forgot-password/page.tsx', from: 'errors: Record<string, any>', to: 'errors: Record<string, { message?: string }>' },
  
  { file: 'app/reset-password/page.tsx', from: "You're almost", to: "You&apos;re almost" },
  
  { file: 'components/dash/link/Link.tsx', from: /Don't have/g, to: "Don&apos;t have" },
  { file: 'components/dash/qr/QR.tsx', from: /Don't have/g, to: "Don&apos;t have" },
  { file: 'components/main/ResultBox.tsx', from: /Don't have/g, to: "Don&apos;t have" },
];

fixes.forEach(({ file, from, to }) => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ Fixed: ${file}`);
  } catch (err) {
    console.log(`✗ Error: ${file}`);
  }
});