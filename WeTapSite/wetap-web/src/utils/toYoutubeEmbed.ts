export function toYoutubeEmbed(url: string): string | null {
    try {
        const u = new URL(url);

        if (u.hostname.includes('youtube.com')) {
            const id = u.searchParams.get('v');
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }

        if (u.hostname === 'youtu.be') {
            const id = u.pathname.replace('/', '');
            return `https://www.youtube.com/embed/${id}`;
        }

        return null;
    } catch {
        return null;
    }
}
