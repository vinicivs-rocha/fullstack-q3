"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { forwardRef, useState } from "react";

interface TimePickerProps {
  value?: number;
  onChange?: (minutes: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Selecione a duração",
      className,
      disabled,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    const hours = Math.floor((value || 0) / 60);
    const minutes = (value || 0) % 60;

    const formatTime = (totalMinutes: number) => {
      if (totalMinutes === 0) return "";
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;

      if (h === 0) return `${m}min`;
      if (m === 0) return `${h}h`;
      return `${h}h ${m}min`;
    };

    const updateTime = (newHours: number, newMinutes: number) => {
      const totalMinutes = newHours * 60 + newMinutes;
      onChange?.(totalMinutes);
    };

    const incrementHours = () => {
      if (hours < 23) updateTime(hours + 1, minutes);
    };

    const decrementHours = () => {
      if (hours > 0) updateTime(hours - 1, minutes);
    };

    const incrementMinutes = () => {
      if (minutes < 59) {
        updateTime(hours, minutes + 1);
      } else if (hours < 23) {
        updateTime(hours + 1, 0);
      }
    };

    const decrementMinutes = () => {
      if (minutes > 0) {
        updateTime(hours, minutes - 1);
      } else if (hours > 0) {
        updateTime(hours - 1, 59);
      }
    };

    const setQuickTime = (minutes: number) => {
      onChange?.(minutes);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal truncate",
              !value && "text-muted-foreground",
              className,
            )}
            disabled={disabled}
          >
            <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
            {value ? formatTime(value) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto min-w-80 max-w-[90vw] p-4"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="space-y-4">
            {/* Seletores de hora e minuto */}
            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              {/* Horas */}
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={incrementHours}
                  disabled={hours >= 23}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <div className="text-xl sm:text-2xl font-mono font-bold min-w-[2.5rem] sm:min-w-[3rem] text-center">
                  {hours.toString().padStart(2, "0")}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decrementHours}
                  disabled={hours <= 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="text-xs text-muted-foreground">horas</div>
              </div>

              <div className="text-xl sm:text-2xl font-bold">:</div>

              {/* Minutos */}
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={incrementMinutes}
                  disabled={hours >= 23 && minutes >= 59}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <div className="text-xl sm:text-2xl font-mono font-bold min-w-[2.5rem] sm:min-w-[3rem] text-center">
                  {minutes.toString().padStart(2, "0")}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decrementMinutes}
                  disabled={hours <= 0 && minutes <= 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="text-xs text-muted-foreground">min</div>
              </div>
            </div>

            {/* Botões de seleção rápida */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Durações comuns:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: "15min", value: 15 },
                  { label: "30min", value: 30 },
                  { label: "45min", value: 45 },
                  { label: "1h", value: 60 },
                  { label: "1h30", value: 90 },
                  { label: "2h", value: 120 },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickTime(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange?.(0);
                  setOpen(false);
                }}
              >
                Limpar
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                Confirmar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

TimePicker.displayName = "TimePicker";
