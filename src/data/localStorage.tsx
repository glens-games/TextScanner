import { createContext, useContext, useMemo, useState } from "react";

export type Options = {
  darkMode: boolean;
  // usingCloudStorage, login type, idToken, accessToken, refreshToken, expiresIn, etc.
};

export type CropCoordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ScanItem = {
  id: string;
  imageUri: string;     // 'https://picsum.photos/200/300',
  createdAt: number;
  cropCoordinates: CropCoordinates;
  text: string;
};

export type AppData = {
  options: Options;
  items: ScanItem[];
};

const defaultData: AppData = {
  options: {darkMode: false},
  items: [] = [
    {
      id: '1',
      imageUri: 'https://picsum.photos/200/300',
      cropCoordinates: { x: 10, y: 10, width: 180, height: 280 },
      text: 'Sample scanned text 1',
      createdAt: Date.now() - 100000,
    },
  ],
};

// Context
type LocalStorageContextType = {
    data: AppData;
    setData: (data: AppData) => void;
    setOptions: (opts: Partial<Options>) => void;
    addItem: (imageUri: string) => ScanItem;
    updateItem: (id: string, updates: Partial<ScanItem>) => void;
};

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const LocalStorageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [data, setData] = useState<AppData>(defaultData);

    const setOptions = (opts: Partial<Options>) => {
        setData(prev => ({...prev, options: {...prev.options, ...opts}}));
    };

    const addItem = (imageUri: string) => {
        const newItem: ScanItem = {
            id: `item-${Date.now()}`,
            imageUri,
            cropCoordinates: { x: 0, y: 0, width: 0, height: 0 },
            text: '',
            createdAt: Date.now(),
        };
        setData(prev => ({...prev, items: [...prev.items, newItem]}));
        return newItem;
    };

    const updateItem = (id: string, updates: Partial<ScanItem>) => {
        setData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? {...item, ...updates} : item)
        }));
    };

    const value = useMemo(
        () => ({data, setData, setOptions, addItem, updateItem}),
        [data]
    );

  return (
        <LocalStorageContext.Provider value={value}>
            {children}
        </LocalStorageContext.Provider>
    );
}

export const useLocalStorage = () => {
  const ctx = useContext(LocalStorageContext);
  if (!ctx) throw new Error('useLocalStorage must be used within LocalStorageProvider');
  return ctx;
};
