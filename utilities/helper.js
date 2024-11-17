export const wrapText = (text, maxLength) => {
    return text.replace(
        new RegExp(`(.{1,${maxLength}})( +|$)\n?|(.{${maxLength}})`, 'g'),
        '$1$3\n'
    ).trim();
};