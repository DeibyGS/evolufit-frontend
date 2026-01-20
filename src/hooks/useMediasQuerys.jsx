import React from 'react'
import { useResizeWidth } from './useResizeWidth';

export const useMediasQuerys = () => {
    const width = useResizeWidth();

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;
    const isMobile = width < 768;

  return { isDesktop, isTablet, isMobile };
}
