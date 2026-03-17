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
    console.log('Successfully converted Movies and Music.xlsx to data.js');
} catch (error) {
    console.error('Error converting excel to json:', error);
}
