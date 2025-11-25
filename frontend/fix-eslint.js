const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix apostrophes
    const apostrophePatterns = [
        { from: />Don't/g, to: ">Don&apos;t" },
        { from: />can't/g, to: ">can&apos;t" },
        { from: />won't/g, to: ">won&apos;t" },
        { from: />We'll/g, to: ">We&apos;ll" },
        { from: />we'll/g, to: ">we&apos;ll" },
        { from: />It's/g, to: ">It&apos;s" },
        { from: />it's/g, to: ">it&apos;s" },
        { from: />doesn't/g, to: ">doesn&apos;t" },
        { from: />isn't/g, to: ">isn&apos;t" },
        { from: />aren't/g, to: ">aren&apos;t" },
        { from: />haven't/g, to: ">haven&apos;t" },
        { from: />hasn't/g, to: ">hasn&apos;t" },
        { from: />didn't/g, to: ">didn&apos;t" },
        { from: />wasn't/g, to: ">wasn&apos;t" },
        { from: />weren't/g, to: ">weren&apos;t" },
        { from: />I'm/g, to: ">I&apos;m" },
        { from: />you're/g, to: ">you&apos;re" },
    ];

    apostrophePatterns.forEach(({ from, to }) => {
        if (content.match(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    });

    // 2. Fix missing Link imports
    if (content.includes('<Link') && !content.includes("import Link from 'next/link'")) {
        const importIndex = content.indexOf('import');
        if (importIndex !== -1) {
            content = content.slice(0, importIndex) + "import Link from 'next/link'\n" + content.slice(importIndex);
            modified = true;
        }
    }

    // 3. Fix common any types
    const anyPatterns = [
        { from: /catch \(err: any\)/g, to: 'catch (err)' },
        { from: /\(e: any\) =>/g, to: '(e: React.FormEvent<HTMLFormElement>) =>' },
        { from: /\(errors: any\)/g, to: '(errors: Record<string, any>)' },
    ];

    anyPatterns.forEach(({ from, to }) => {
        if (content.match(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
            walkDir(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fixFile(filePath);
        }
    });
}

walkDir('./app');
walkDir('./components');
console.log('✓ Done!');