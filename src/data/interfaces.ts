// src/data/interfaces.ts - TugBoat Port Scanner Interfaces

import React from 'react';

// UI Component Types
export type ButtonVariant = "primary" | "secondary" | "danger" | "glass" | "outline" | "icon";
export type ButtonSize = "small" | "medium" | "large";

// Icon configuration for UI components
export interface IconConfig {
  type: "dot" | "custom";
  color?: string;
  size?: string;
  content?: React.ReactNode;
}

// Button component interface
export interface ButtonData {
  id: string;
  variant: ButtonVariant;
  size?: ButtonSize;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconConfig;
  className?: string;
  metadata?: Record<string, unknown>;
}

export type ButtonCallback = (
  buttonData: ButtonData,
  event?: React.MouseEvent<HTMLButtonElement>
) => void;

// Toggle/Switch component interface
export interface ToggleData {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  variant?: "primary" | "success" | "custom";
  size?: "small" | "medium" | "large";
  className?: string;
  metadata?: Record<string, unknown>;
}

export type ToggleCallback = (
  toggleData: ToggleData,
  checked: boolean,
  event?: React.ChangeEvent<HTMLInputElement>
) => void;

// Input component interface
export type InputVariant = "primary" | "glass" | "outline";
export type InputType = "text" | "password" | "email" | "search" | "number";

export interface InputData {
  id: string;
  variant: InputVariant;
  type: InputType;
  label?: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: IconConfig;
  className?: string;
  metadata?: Record<string, unknown>;
}

export type InputCallback = (
  inputData: InputData,
  value: string,
  event?: React.ChangeEvent<HTMLInputElement>
) => void;

// Theme Types
export type ThemeMode = "light" | "dark";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  accentColor?: string;
  customVariables?: Record<string, string>;
}

// Generic UI Component Props
export interface BaseUIProps {
  id: string;
  className?: string;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
}

// Port Scanner Specific Interfaces

// Port card interaction callbacks
export type PortCardCallback = (port: number, action: string) => void;

// Port scanning callbacks
export type ScanCallback = (
  ports?: number[],
  ranges?: Array<[number, number]>
) => void;

// Settings update callbacks
export type SettingsCallback = (
  setting: string,
  value: unknown
) => void;

// Navigation callbacks
export type NavigationCallback = (
  view: string,
  data?: Record<string, unknown>
) => void;
