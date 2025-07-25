'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>;
type PopoverAnchorProps = React.ComponentProps<typeof PopoverPrimitive.Anchor>;

type PopoverContentProps = React.ComponentProps<
  typeof PopoverPrimitive.Content
>;

type PopoverTriggerProps = React.ComponentProps<
  typeof PopoverPrimitive.Trigger
>;

export function Popover(props: PopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export function PopoverAnchor(props: PopoverAnchorProps) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export function PopoverTrigger(props: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

export function PopoverContent(props: PopoverContentProps) {
  const { align = 'center', sideOffset = 4 } = props;
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        {...props}
        align={align}
        sideOffset={sideOffset}
        data-slot="popover-content"
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
          props.className
        )}
      />
    </PopoverPrimitive.Portal>
  );
}
