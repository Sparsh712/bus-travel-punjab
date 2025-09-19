
import React, { createContext, useState, useMemo } from 'react';
import { translations } from '../data/translations';

type Language = 'en' | 'hi';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = useMemo(() => translations[language], [language]);

  return (
    <AppContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};
