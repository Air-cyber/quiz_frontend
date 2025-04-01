'use client';

/**
 * Utility to check if code is running in browser environment
 * Use this instead of directly checking window/document
 */
export const isBrowser = () => typeof window !== 'undefined';
