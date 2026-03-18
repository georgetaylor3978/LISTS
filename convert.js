const xlsx = require('xlsx');
const fs = require('fs');

try {
    const workbook = xlsx.readFile('Movies and Music.xlsx');
    const data = {};

    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        data[sheetName] = xlsx.utils.sheet_to_json(worksheet, { defval: null });
    });

    const jsContent = `const collectionData = ${JSON.stringify(data, null, 4)};`;
    fs.writeFileSync('data.js', jsContent);
    
    // Update index.html to avoid browser caching of data.js
    let html = fs.readFileSync('index.html', 'utf8');
    const timestamp = Date.now();
    // Reset any existing cache buster
    html = html.replace(/src="data\.js(\?v=\d+)?"/, `src="data.js?v=${timestamp}"`);
    // Same for script.js
    html = html.replace(/src="script\.js(\?v=\d+)?"/, `src="script.js?v=${timestamp}"`);
    fs.writeFileSync('index.html', html);

    console.log(`Successfully converted Movies and Music.xlsx to data.js (v=${timestamp})`);
} catch (error) {
    console.error('Error converting excel to json:', error);
}
