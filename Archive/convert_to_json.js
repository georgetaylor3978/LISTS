const xlsx = require('xlsx');
const fs = require('fs');

try {
    const workbook = xlsx.readFile('Movies and Music.xlsx');
    const data = {};

    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        data[sheetName] = xlsx.utils.sheet_to_json(worksheet, { defval: null });
    });

    fs.writeFileSync('data.json', JSON.stringify(data, null, 4));
    console.log('Successfully converted Movies and Music.xlsx to data.json');
} catch (error) {
    console.error('Error converting excel to json:', error);
}
