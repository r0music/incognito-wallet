export const replaceCommaText = ({ text, keyboardType = 'decimal-pad' }) => {
    if (!text) return '';
    let newText = text;
    if (keyboardType === 'decimal-pad') {
        newText = newText.replace(/,/g, '.');
    }
    return newText;
};
