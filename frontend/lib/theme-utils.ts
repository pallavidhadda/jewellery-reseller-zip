export interface ThemeStyles {
    fontDisplay: string;
    fontBody: string;
    borderRadius: string;
    buttonRadius: string;
    cardRadius: string;
    inputRadius: string;
}

export const getThemeStyles = (themeName: string = 'heritage'): ThemeStyles => {
    const normalizedTheme = themeName.toLowerCase();

    switch (normalizedTheme) {
        case 'minimalist':
        case 'chic':
            return {
                fontDisplay: 'font-display',
                fontBody: 'font-sans',
                borderRadius: 'rounded-none',
                buttonRadius: 'rounded-none',
                cardRadius: 'rounded-none',
                inputRadius: 'rounded-none',
            };
        case 'artisan':
        case 'bloom':
            return {
                fontDisplay: 'font-display',
                fontBody: 'font-body',
                borderRadius: 'rounded-[2rem]',
                buttonRadius: 'rounded-full',
                cardRadius: 'rounded-[2.5rem]',
                inputRadius: 'rounded-2xl',
            };
        case 'deco':
        case 'modern':
            return {
                fontDisplay: 'font-display',
                fontBody: 'font-sans',
                borderRadius: 'rounded-xl',
                buttonRadius: 'rounded-lg',
                cardRadius: 'rounded-2xl',
                inputRadius: 'rounded-md',
            };
        case 'heritage':
        case 'royal':
        default:
            return {
                fontDisplay: 'font-display',
                fontBody: 'font-sans',
                borderRadius: 'rounded-2xl',
                buttonRadius: 'rounded-full',
                cardRadius: 'rounded-3xl',
                inputRadius: 'rounded-xl',
            };
    }
};
