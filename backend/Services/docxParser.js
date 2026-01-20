const mammoth = require('mammoth');

const parseDocx = async (buffer) => {
    try {
        console.log('==================== DOCX PARSING START ====================');
        console.log(`DOCX buffer size: ${buffer.length} bytes`);

        const result = await mammoth.extractRawText({ buffer: buffer });

        console.log(`✅ DOCX parsed successfully: ${result.value.length} characters extracted`);
        console.log(`   Text preview: ${result.value.substring(0, 200).replace(/\n/g, ' ')}...`);
        console.log('==================== DOCX PARSING END ====================\n');

        return result.value;
    } catch (error) {
        console.error('❌ Error parsing DOCX:', error);
        console.log('==================== DOCX PARSING END ====================\n');
        throw new Error('Failed to parse DOCX file');
    }
};

module.exports = { parseDocx };
