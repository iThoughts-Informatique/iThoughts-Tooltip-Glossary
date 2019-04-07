// @ts-ignore
import { manifest } from '~editor-config';

export const resolveUrl = (assetIdentifier: string) => manifest[assetIdentifier];
