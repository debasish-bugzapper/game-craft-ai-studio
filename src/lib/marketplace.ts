export interface MarketplaceItem {
  id: string;
  title: string;
  creator: string;
  price: number; // 0 for free
  category: '3D-Model' | 'Template' | 'Audio';
  downloadsCount: number;
}

export const communityAssets: MarketplaceItem[] = [
  { id: 'asset_1', title: 'Cyberpunk City Pack', creator: 'Devabhish', price: 0, category: '3D-Model', downloads: 1240 },
  { id: 'asset_2', title: 'Platformer Starter Kit', creator: 'AI Studio', price: 99, category: 'Template', downloads: 530 }
];

export function getMarketplaceItems(): MarketplaceItem[] {
  return communityAssets;
}
