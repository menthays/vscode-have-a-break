import { IMAGE_HEIGHT, IMAGE_WIDTH } from '../constants';

// Get random image URL from Picsum Photos
export function getRandomImageUrl(): string {
    const timestamp = new Date().getTime();
    return `https://picsum.photos/${IMAGE_WIDTH}/${IMAGE_HEIGHT}?random=${timestamp}`;
}
