import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = 'IMAGE_TO_NOTES_APPDATA_V1';

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
  items: [],
};

// Context
type LocalStorageContextType = {
    data: AppData;
    setData: (data: AppData) => void;
    setOptions: (opts: Partial<Options>) => void;
    addItem: (imageUri: string) => ScanItem;
    setItemText: (id: string, text: string) => void;
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

    const setItemText = (id: string, text: string) => {
        setData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? {...item, text} : item)
        }));
    };

    const value = useMemo(
        () => ({data, setData, setOptions, addItem, setItemText}),
        [data]
    );


    useEffect(() => {
        const loadStorage = async () => {
            try {
                const storedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedData) {
                    setData(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Error loading storage:', error);
            }
        };
        loadStorage();
    }, []);

    useEffect(() => {
        const saveStorage = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error('Error saving storage:', error);
            }
        };
        saveStorage();
    }, [data]);

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
