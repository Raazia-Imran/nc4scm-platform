"use client";
import { createContext, useContext } from "react";
const ContentContext = createContext({});
export default function ContentProvider({ text, children }) {
  return (
    <ContentContext.Provider value={text || {}}>
      {children}
    </ContentContext.Provider>
  );
}
export const useContent = () => useContext(ContentContext);
