'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ProfileResponseIface } from '@/interfaces/response';

export type GlobalStateType = {
  profile: ProfileResponseIface | null;
  photoProfile: string | null | undefined;
  token: string | null;
};
export type GlobalProviderProps = {
  children: ReactNode;
} & GlobalStateType;

export interface GlobalContextIFace {
  token: string | null;
  profile: ProfileResponseIface | null;
  photoProfile: string | null | undefined;
  setPhotoProfile: (photo: string) => void;
  setProfile: (profile: ProfileResponseIface) => void;
}
const useGlobalState = (initial: GlobalStateType) =>
  useState<GlobalStateType>(initial);

export const useGlobalContext = () => {
  const globalContext = useContext(GlobalContext);
  if (!globalContext) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return globalContext;
};
export const GlobalContext = createContext<GlobalContextIFace>({
  token: null,
  profile: null,
  photoProfile: null,
  setPhotoProfile: () => {},
  setProfile: () => {},
});

export const GlobalProvider = ({
  children,
  ...initialAuthState
}: GlobalProviderProps) => {
  const [authState, setAuthState] = useGlobalState(initialAuthState);
  return (
    <GlobalContext.Provider
      value={{
        profile: authState.profile,
        photoProfile: authState.photoProfile,
        token: authState.token,
        setPhotoProfile: (photo: string) => {
          setAuthState((prev) => {
            return {
              ...prev,
              photoProfile: photo,
            };
          });
        },
        setProfile: (newProfile: ProfileResponseIface) => {
          console.log(newProfile);
          setAuthState((prev) => {
            return {
              ...prev,
              profile: newProfile,
            };
          });
        },
      }}
    >
      <>
      {children}
      <ToastContainer />
      </>
    </GlobalContext.Provider>
  );
};
