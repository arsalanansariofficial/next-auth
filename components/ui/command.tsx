'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import * as CND from '@/components/ui/dialog';

type CommandProps = React.ComponentProps<typeof CommandPrimitive>;
type CommandListProps = React.ComponentProps<typeof CommandPrimitive.List>;
type CommandItemProps = React.ComponentProps<typeof CommandPrimitive.Item>;
type CommandInputProps = React.ComponentProps<typeof CommandPrimitive.Input>;
type CommandEmptyProps = React.ComponentProps<typeof CommandPrimitive.Empty>;
type CommandGroupProps = React.ComponentProps<typeof CommandPrimitive.Group>;

type CommandSeparatorProps = React.ComponentProps<
  typeof CommandPrimitive.Separator
>;

type CommandDialogProps = React.ComponentProps<typeof CND.Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
};

export function CommandEmpty(props: CommandEmptyProps) {
  return (
    <CommandPrimitive.Empty
      {...props}
      data-slot="command-empty"
      className="py-6 text-center text-sm"
    />
  );
}

export function CommandSeparator(props: CommandSeparatorProps) {
  return (
    <CommandPrimitive.Separator
      {...props}
      data-slot="command-separator"
      className={cn('bg-border -mx-1 h-px', props.className)}
    />
  );
}

export function CommandShortcut(props: React.ComponentProps<'span'>) {
  return (
    <span
      {...props}
      data-slot="command-shortcut"
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        props.className
      )}
    />
  );
}

export function CommandList(props: CommandListProps) {
  return (
    <CommandPrimitive.List
      {...props}
      data-slot="command-list"
      className={cn(
        'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        props.className
      )}
    />
  );
}

export function CommandInput(props: CommandInputProps) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        {...props}
        data-slot="command-input"
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          props.className
        )}
      />
    </div>
  );
}

export function CommandGroup(props: CommandGroupProps) {
  return (
    <CommandPrimitive.Group
      {...props}
      data-slot="command-group"
      className={cn(
        'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
        props.className
      )}
    />
  );
}

export function CommandItem(props: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      {...props}
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        props.className
      )}
    />
  );
}

export function Command(props: CommandProps) {
  return (
    <CommandPrimitive
      {...props}
      data-slot="command"
      className={cn(
        'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
        props.className
      )}
    />
  );
}

export function CommandDialog(props: CommandDialogProps) {
  const {
    showCloseButton = true,
    title = 'Command Palette',
    description = 'Search for a command to run...'
  } = props;

  return (
    <CND.Dialog {...props}>
      <CND.DialogHeader className="sr-only">
        <CND.DialogTitle>{title}</CND.DialogTitle>
        <CND.DialogDescription>{description}</CND.DialogDescription>
      </CND.DialogHeader>
      <CND.DialogContent
        showCloseButton={showCloseButton}
        className={cn('overflow-hidden p-0', props.className)}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {props.children}
        </Command>
      </CND.DialogContent>
    </CND.Dialog>
  );
}
