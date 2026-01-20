const parsePdf = async (buffer) => {
    try {
        console.log('==================== PDF PARSING START ====================');
        console.log(`PDF buffer size: ${buffer.length} bytes`);

        // Try using pdf-parse
        const pdfParse = require('pdf-parse');

        // pdf-parse options for better extraction
        const options = {
            max: 0, // no page limit
        };

        const data = await pdfParse(buffer, options);

        if (data && data.text && data.text.trim().length > 0) {
            console.log(`✅ PDF parsed successfully: ${data.text.length} characters extracted`);
            console.log(`   Pages: ${data.numpages || 'unknown'}`);
            console.log(`   Text preview: ${data.text.substring(0, 200).replace(/\n/g, ' ')}...`);
            console.log('==================== PDF PARSING END ====================\n');
            return data.text;
        }

        // If pdf-parse fails to extract text, try extracting raw text
        console.warn('⚠️  pdf-parse returned empty, attempting raw text extraction');
        const rawText = buffer.toString('utf8');
        // Extract readable text from raw content
        const extractedText = rawText.match(/[\x20-\x7E\n\r]+/g);
        if (extractedText) {
            const text = extractedText.join(' ').replace(/\s+/g, ' ').trim();
            console.log(`✅ Raw extraction successful: ${text.length} characters`);
            console.log('==================== PDF PARSING END ====================\n');
            return text;
        }

        console.warn('⚠️  Both methods failed to extract text from PDF');
        console.log('==================== PDF PARSING END ====================\n');
        return '';
    } catch (error) {
        console.error('❌ Error parsing PDF:', error.message);

        // Fallback: try to extract any readable text from the buffer
        try {
            const rawText = buffer.toString('utf8');
            const extractedText = rawText.match(/[\x20-\x7E\n\r]+/g);
            if (extractedText) {
                const text = extractedText.join(' ').replace(/\s+/g, ' ').trim();
                if (text.length > 50) {
                    console.log(`✅ Fallback extraction: ${text.length} characters`);
                    console.log('==================== PDF PARSING END ====================\n');
                    return text;
                }
            }
        } catch (e) {
            console.error('❌ Fallback extraction failed:', e.message);
        }

        console.log('==================== PDF PARSING END ====================\n');
        return '';
    }
};

module.exports = { parsePdf };
