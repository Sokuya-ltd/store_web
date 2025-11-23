// Your custom color palette
export const colors = {
    // Primary colors
    primary: {
        main: '#D35400',      // Your orange
        dark: '#A04000',
        light: '#FF6B1A',
    },

    // Accent colors
    accent: {
        olive: '#556B2F',     // Your olive green
        teal: '#00CED1',
        purple: '#6366F1',
        pink: '#EC4899',
    },

    // Neutral colors
    neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
};

// Helper to get color for charts/stats
export const getStatColor = (index) => {
    const statColors = [
        colors.accent.purple,
        colors.accent.teal,
        colors.accent.olive,
        colors.accent.pink,
    ];
    return statColors[index % statColors.length];
};
