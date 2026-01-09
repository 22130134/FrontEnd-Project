import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target the component css folder
const filePath = path.join(__dirname, 'src', 'components', 'css', 'baotintuc.css');

try {
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Check if likely minified (very few lines compared to size)
    const lines = content.split('\n');
    if (lines.length > 500) {
        console.log('File seems already formatted.');
        // Force re-format anyway if user insists? 
        // Let's assume just format line 0 if it looks minified.
    }

    let minifiedLine = lines[0];
    const restOfFile = lines.slice(1).join('\n');

    // Only format if line 0 is long and contains many braces
    if (minifiedLine.length > 1000 && minifiedLine.includes('{')) {
        let formatted = minifiedLine
            .replace(/}/g, '}\n')
            .replace(/{/g, ' {\n')
            .replace(/;/g, ';\n');

        const formattedLines = formatted.split('\n');
        let indentLevel = 0;
        const finalLines = formattedLines.map(line => {
            line = line.trim();
            if (!line) return '';

            if (line.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            const indented = '  '.repeat(indentLevel) + line;

            if (line.endsWith('{')) {
                indentLevel++;
            }

            return indented;
        });

        const finalContent = finalLines.join('\n') + '\n' + restOfFile;
        fs.writeFileSync(filePath, finalContent, 'utf8');
        console.log('Successfully formatted baotintuc.css');
    } else {
        console.log('First line not minified, skipping.');
    }

} catch (err) {
    console.error('Error formatting file:', err);
}
