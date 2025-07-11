'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;
type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;

type DialogDescriptionProps = React.ComponentProps<
  typeof DialogPrimitive.Description
>;

type DialogContentProps = React.ComponentProps<
  typeof DialogPrimitive.Content
> & {
  showCloseButton?: boolean;
};

export function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function DialogPortal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export function DialogTrigger(props: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogDescription(props: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      {...props}
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', props.className)}
    />
  );
}

export function DialogHeader(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      data-slot="dialog-header"
      className={cn(
        'flex flex-col gap-2 text-center sm:text-left',
        props.className
      )}
    />
  );
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      {...props}
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
    />
  );
}

export function DialogFooter(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        props.className
      )}
    />
  );
}

export function DialogOverlay(props: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      {...props}
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        props.className
      )}
    />
  );
}

export function DialogContent(props: DialogContentProps) {
  const { showCloseButton = true } = props;

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        {...props}
        data-slot="dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          props.className
        )}
      >
        {props.children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
