'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>;
type DrawerCloseProps = React.ComponentProps<typeof DrawerPrimitive.Close>;

type DrawerTitleProps = React.ComponentProps<typeof DrawerPrimitive.Title>;
type DrawerPortalProps = React.ComponentProps<typeof DrawerPrimitive.Portal>;

type DrawerOverlayProps = React.ComponentProps<typeof DrawerPrimitive.Overlay>;
type DrawerContentProps = React.ComponentProps<typeof DrawerPrimitive.Content>;

type DrawerTriggerProps = React.ComponentProps<typeof DrawerPrimitive.Trigger>;
type DrawerDescriptionProps = React.ComponentProps<
  typeof DrawerPrimitive.Description
>;

export function Drawer({ ...props }: DrawerProps) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

export function DrawerTrigger({ ...props }: DrawerTriggerProps) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

export function DrawerPortal({ ...props }: DrawerPortalProps) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

export function DrawerClose({ ...props }: DrawerCloseProps) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

export function DrawerFooter(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', props.className)}
    />
  );
}

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  return (
    <DrawerPrimitive.Title
      {...props}
      data-slot="drawer-title"
      className={cn('text-foreground font-semibold', className)}
    />
  );
}

export function DrawerDescription(props: DrawerDescriptionProps) {
  return (
    <DrawerPrimitive.Description
      {...props}
      data-slot="drawer-description"
      className={cn('text-muted-foreground text-sm', props.className)}
    />
  );
}

export function DrawerHeader(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      data-slot="drawer-header"
      className={cn(
        'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
        props.className
      )}
    />
  );
}

export function DrawerOverlay({ className, ...props }: DrawerOverlayProps) {
  return (
    <DrawerPrimitive.Overlay
      {...props}
      data-slot="drawer-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
    />
  );
}

export function DrawerContent(props: DrawerContentProps) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        {...props}
        data-slot="drawer-content"
        className={cn(
          'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
          'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
          'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
          'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
          'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
          props.className
        )}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {props.children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}
