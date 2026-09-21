import type { KeyboardEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface DropdownSelectOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  options: DropdownSelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  "aria-label"?: string;
}

export default function DropdownSelect({
  options,
  value,
  defaultValue = "",
  placeholder = "Pilih opsi...",
  onChange,
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  "aria-label": ariaLabel,
}: DropdownSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  const updateMenuPosition = () => {
    const button = buttonRef.current;
    const menu = menuRef.current;

    if (!button) return;

    const rect = button.getBoundingClientRect();
    const viewportPadding = 8;
    const gap = 4;
    const menuHeight = menu?.getBoundingClientRect().height ?? 240;

    let top = rect.bottom + gap;

    // If there isn't enough room below the button, open upward.
    if (top + menuHeight > window.innerHeight - viewportPadding) {
      top = Math.max(viewportPadding, rect.top - menuHeight - gap);
    }

    const width = rect.width;
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      Math.max(viewportPadding, window.innerWidth - width - viewportPadding),
    );

    setMenuPosition({ top, left, width });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleViewportChange = () => {
      updateMenuPosition();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    // Position after the portal menu has been mounted and measured.
    requestAnimationFrame(updateMenuPosition);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen]);

  const selectValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((open) => !open);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const menu = isOpen && !disabled && menuPosition
    ? createPortal(
        <div
          ref={menuRef}
          id={listboxId}
          role="listbox"
          className={`fixed z-[9999] max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${menuClassName}`}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            width: menuPosition.width,
          }}
        >
          {options.map((option) => {
            const selected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectValue(option.value)}
                className={`block w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                  selected
                    ? "bg-brand-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div ref={rootRef} className={`relative w-full ${className}`}>
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={handleButtonKeyDown}
          className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white px-4 text-left text-sm outline-none transition ${
            isOpen
              ? "border-brand-500 ring-2 ring-brand-500/10"
              : "border-gray-300 hover:border-gray-400"
          } ${
            selectedOption
              ? "text-gray-700"
              : "text-gray-400"
          } ${
            disabled
              ? "cursor-not-allowed bg-gray-50 opacity-60"
              : "cursor-pointer"
          } dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 ${
            isOpen ? "dark:border-brand-500" : ""
          } ${buttonClassName}`}
        >
          <span className="min-w-0 truncate">
            {selectedOption?.label ?? placeholder}
          </span>
          <svg
            className={`ml-3 h-5 w-5 shrink-0 text-gray-500 transition-transform dark:text-gray-400 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {menu}
    </>
  );
}
