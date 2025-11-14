import { create } from "zustand";
import {
    CanvasState,
    ImageSettings,
    SplitImage,
    TARGET_WIDTH_RANGE,
} from "./types";

interface CanvasStore extends CanvasState {
    // Actions
    setImage: (url: string, width: number, height: number) => void;
    updateSettings: (settings: Partial<ImageSettings>) => void;
    setProcessing: (isProcessing: boolean) => void;
    setSplitImages: (images: SplitImage[]) => void;
    reset: () => void;

    // Split images
    splitImages: SplitImage[];

    // Computed
    calculateDPI: () => number;
}

// Default settings
const defaultSettings: ImageSettings = {
    targetWidthInches: 6.5,
    rotation: 0,
    overlapMm: 0,
    dpi: 0,
    scaleFactor: 1,
};

const initialState: CanvasState = {
    imageUrl: null,
    originalWidth: 0,
    originalHeight: 0,
    settings: defaultSettings,
    isProcessing: false,
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
    ...initialState,
    splitImages: [],

    setImage: (url, width, height) => {
        const state = get();
        const dpi = state.calculateDPI();

        set({
            imageUrl: url,
            originalWidth: width,
            originalHeight: height,
            settings: {
                ...state.settings,
                dpi,
            },
        });
    },

    updateSettings: (newSettings) => {
        const state = get();
        const updatedSettings = { ...state.settings, ...newSettings };

        // Recalculate DPI if target width changes
        if (newSettings.targetWidthInches !== undefined) {
            const dpi = state.originalWidth / newSettings.targetWidthInches;
            updatedSettings.dpi = Math.round(dpi);
        }

        set({ settings: updatedSettings });
    },

    setProcessing: (isProcessing) => set({ isProcessing }),

    setSplitImages: (images) => set({ splitImages: images }),

    reset: () => set({ ...initialState, splitImages: [] }),

    calculateDPI: () => {
        const { originalWidth, settings } = get();
        if (!originalWidth || !settings.targetWidthInches) return 0;
        return Math.round(originalWidth / settings.targetWidthInches);
    },
}));
