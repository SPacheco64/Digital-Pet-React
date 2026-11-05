import shopItems from '../../graphics/icons/shop/shop-items.webp';
import gymBackground from '../../graphics/backgrounds/gym-bg.webp';

let shopItemsImagePromise: Promise<void> | null = null;
let gymBackgroundImagePromise: Promise<void> | null = null;

// Function to preload the shop items image and return a promise that resolves 
// when the items spritesheet is loaded. This function is currently ran when
// the GameDisplay component is mounted, so that the shop items are preloaded 
// before the user opens the shop.
export const preloadShopItemsImage = () => {
  if (!shopItemsImagePromise) {
    shopItemsImagePromise = new Promise<void>((resolve, reject) => {
      const image = new Image();
      let isDecoding = false;
      const resolveWhenDecoded = () => {
        if (isDecoding) {
          return;
        }

        isDecoding = true;
        image.decode()
          .then(resolve)
          .catch(() => reject(new Error(`Failed to decode shop item icons: ${shopItems}`)));
      };

      image.onload = resolveWhenDecoded;
      image.onerror = () => reject(new Error(`Failed to load shop item icons: ${shopItems}`));
      image.src = shopItems;

      if (image.complete && image.naturalWidth > 0) {
        resolveWhenDecoded();
      }
    }).catch((error: unknown) => {
      shopItemsImagePromise = null;
      throw error;
    });
  }

  return shopItemsImagePromise;
};

// Function to preload the gym background image and return a promise that resolves 
// when the gym background image is loaded. This function is currently ran when the 
// GameDisplay component is mounted, so that the gym background is preloaded 
// before the user performs any training.
export const preloadGymBackground = () => {
  if (!gymBackgroundImagePromise) {
    gymBackgroundImagePromise = new Promise<void>((resolve, reject) => {
      const image = new Image();
      let isDecoding = false;
      const resolveWhenDecoded = () => {
        if (isDecoding) {
          return;
        }

        isDecoding = true;
        image.decode()
          .then(resolve)
          .catch(() => reject(new Error(`Failed to decode training background: ${gymBackground}`)));
      };

      image.onload = resolveWhenDecoded;
      image.onerror = () => reject(new Error(`Failed to load training background: ${gymBackground}`));
      image.src = gymBackground;

      if (image.complete && image.naturalWidth > 0) {
        resolveWhenDecoded();
      }
    }).catch((error: unknown) => {
      gymBackgroundImagePromise = null;
      throw error;
    });
  }

  return gymBackgroundImagePromise;
};
