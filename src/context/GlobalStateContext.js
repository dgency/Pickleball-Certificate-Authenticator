"use client"
import { createContext, useContext, useState } from 'react';

// Create the context
const GlobalStateContext = createContext();

// Create a provider component
export const GlobalStateProvider = ({ children }) => {
    const [post, setPost] = useState(null);
    const [input, setInput] = useState(null);
  
    // Method to update the post state
    const updatePost = (newPost) => {
      setPost(newPost);
    };
  
    return (
      <GlobalStateContext.Provider value={{ post, updatePost,input,setInput }}>
        {children}
      </GlobalStateContext.Provider>
    );
  };

  // Custom hook to use the GlobalStateContext
export const useGlobalState = () => useContext(GlobalStateContext);