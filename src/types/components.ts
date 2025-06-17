import { ReactNode } from 'react';

export interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export interface TextAreaProps extends TextInputProps {}

export interface SelectProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string | null;
  onChange: (value: string | null) => void;
  options: string[];
}

export interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  label?: string;
}
