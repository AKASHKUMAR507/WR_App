class Aphrodite {
    static FormatToTwoDigits(number) {
        const parsed = parseInt(number);
        return parsed < 10 ? `0${parsed}` : parsed;
    }

    static FormatToTwoDigitsPlusSign(number){
        const numLength = number?.toString().length;
        const parsed = parseInt(number);
        
        if(parsed === 0) return number;
        if(numLength <= 2) return number;
        return `${99}+`;
    }

    static FormatToSingleDigits(number){
        const parsed = parseInt(number);
        return parsed;
    }

    static FormatNumbers(number, localeCode = 'en-IN') {
        const parsed = parseInt(number);
        return parsed.toLocaleString(localeCode, { maximumFractionDigits: 2 });
    }

    static FormatSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';

        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
    }

    static FormatCommaSeparatedString(...args) {
        return args.filter(arg => !!arg).join(', ');
    }
}

export default Aphrodite;