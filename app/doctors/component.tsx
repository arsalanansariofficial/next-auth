'use client';

import z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import { User } from 'next-auth';
import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Speciality } from '@prisma/client';
import * as RT from '@tanstack/react-table';
import * as Icons from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';

import * as actions from '@/lib/actions';
import * as CONST from '@/lib/constants';
import * as CN from '@/components/ui/card';
import { nameSchema } from '@/lib/schemas';
import { hasPermission } from '@/lib/utils';
import * as RHF from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useHookForm from '@/hooks/use-hook-form';
import * as Drawer from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import * as DT from '@/components/ui/data-table';
import * as Select from '@/components/ui/select';
import handler from '@/components/display-toast';
import * as DM from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

type Props = { user: User; specialities: Speciality[] };
type TableSchema = { id: number; name: string };
type TCVProps<T extends z.ZodType> = { item: z.infer<T> };
type MenuProps = { id?: string; ids?: string[]; isHeader: boolean };

function Menu({ id, ids, isHeader = false }: MenuProps) {
  const menuTrigger = (
    <DM.DropdownMenuTrigger asChild>
      <Button
        size="icon"
        variant="ghost"
        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
      >
        <Icons.IconDotsVertical />
        <span className="sr-only">Open menu</span>
      </Button>
    </DM.DropdownMenuTrigger>
  );

  return (
    <DM.DropdownMenu>
      {!isHeader && menuTrigger}
      {ids && ids.length > 0 && isHeader && menuTrigger}
      <DM.DropdownMenuContent align="end" className="w-32">
        <DM.DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            if (!isHeader) {
              toast.promise(actions.deleteSpeciality(id as string), {
                position: 'top-center',
                loading: 'Deleting speciality',
                success: CONST.SPECIALITY_DELETED,
                error: (
                  <span className="text-destructive">
                    {CONST.SERVER_ERROR_MESSAGE}
                  </span>
                )
              });
            }

            if (isHeader) {
              toast.promise(actions.deleteSpecialities(ids as string[]), {
                position: 'top-center',
                loading: 'Deleting specialities',
                success: CONST.SPECIALITIES_DELETED,
                error: (
                  <span className="text-destructive">
                    {CONST.SERVER_ERROR_MESSAGE}
                  </span>
                )
              });
            }
          }}
        >
          Delete
        </DM.DropdownMenuItem>
      </DM.DropdownMenuContent>
    </DM.DropdownMenu>
  );
}

export function TableCellViewer<T extends z.ZodType>(props: TCVProps<T>) {
  const isMobile = useIsMobile();

  const { pending, handleSubmit } = useHookForm(
    handler,
    actions.updateSpeciality.bind(null, props.item.id) as (
      data: unknown
    ) => Promise<unknown>,
    true
  );

  const form = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: String() }
  });

  return (
    <Drawer.Drawer direction={isMobile ? 'bottom' : 'right'}>
      <Drawer.DrawerTrigger asChild onClick={e => e.currentTarget.blur()}>
        <Button variant="link" className="text-foreground px-0">
          {props.item.id}
        </Button>
      </Drawer.DrawerTrigger>
      <Drawer.DrawerContent>
        <Drawer.DrawerHeader className="gap-1">
          <Drawer.DrawerTitle>Speciality</Drawer.DrawerTitle>
          <Drawer.DrawerDescription>
            You can change the name for the selected speciality
          </Drawer.DrawerDescription>
        </Drawer.DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <RHF.Form {...form}>
            <form
              id="speciality-form"
              className="space-y-2"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <RHF.FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <RHF.FormItem>
                    <RHF.FormLabel>Speciality</RHF.FormLabel>
                    <RHF.FormControl>
                      <Input {...field} type="name" placeholder="Physician" />
                    </RHF.FormControl>
                    <RHF.FormMessage />
                  </RHF.FormItem>
                )}
              />
            </form>
          </RHF.Form>
        </div>
        <Drawer.DrawerFooter>
          <Button
            type="submit"
            disabled={pending}
            form="speciality-form"
            className="cursor-pointer"
          >
            {pending ? 'Saving...' : 'Save'}
          </Button>
          <Drawer.DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </Drawer.DrawerClose>
        </Drawer.DrawerFooter>
      </Drawer.DrawerContent>
    </Drawer.Drawer>
  );
}

export default function Component(props: Props) {
  const [time, setTime] = useState<string>();
  const [gender, setGender] = useState<string>();
  const [speciality, setSpeciality] = useState<string>();
  const [experience, setExperience] = useState<string>();
  const [selectedTimeslots, setSelectedTimeslots] = useState<string[]>([]);

  const columns: RT.ColumnDef<TableSchema>[] = [
    {
      id: 'drag',
      cell: ({ row }) => <DT.DragHandle id={row.original.id} />
    },
    {
      id: 'select',
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
        />
      )
    },
    {
      id: 'id',
      header: 'Id',
      accessorKey: 'id',
      cell: ({ row }) => (
        <TableCellViewer
          key={Date.now()}
          item={props.specialities.find(s => s.id === String(row.original.id))}
        />
      )
    },
    {
      id: 'name',
      header: 'Name',
      enableHiding: false,
      accessorKey: 'name',
      cell: ({ row }) => (
        <span>
          {props.specialities.find(s => s.id === String(row.original.id))?.name}
        </span>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Menu isHeader={false} id={row.original.id.toString()} />
      ),
      header: ({ table }) => {
        return (
          <Menu
            isHeader={true}
            ids={table
              .getSelectedRowModel()
              .rows.map(r => r.original.id.toString())}
          />
        );
      }
    }
  ];

  return (
    <div className="col-span-2 space-y-4 lg:col-start-2">
      {hasPermission(props.user.roles, 'view:specialities') && (
        <section className="space-y-4">
          <header>
            <CN.Card>
              <CN.CardContent>
                <h1 className="font-semibold">Specialities</h1>
              </CN.CardContent>
            </CN.Card>
          </header>
          <main>
            <CN.Card>
              <CN.CardHeader>
                <DT.DataTable
                  columns={columns}
                  data={props.specialities}
                  filterConfig={[{ id: 'name', placeholder: 'Name' }]}
                />
              </CN.CardHeader>
              <CN.CardFooter>
                <Button variant="outline" className="ml-auto" asChild>
                  <Link href="/doctors/specialities/add">Add</Link>
                </Button>
              </CN.CardFooter>
            </CN.Card>
          </main>
        </section>
      )}
      <section className="space-y-4">
        <header>
          <CN.Card>
            <CN.CardContent>
              <h1 className="font-semibold">Doctors</h1>
            </CN.CardContent>
          </CN.Card>
        </header>
        <main>
          <CN.Card>
            <CN.CardHeader>
              <form action="" className="grid grid-cols-8 gap-2">
                <div>
                  <Label htmlFor="doctor-name" className="sr-only">
                    Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="doctor-name"
                    className="w-full"
                    placeholder="Search doctor..."
                  />
                </div>
                <div>
                  <Label htmlFor="doctor-speciality" className="sr-only">
                    Speciality
                  </Label>
                  <Select.Select onValueChange={setSpeciality}>
                    <Select.SelectTrigger
                      id="doctor-speciality"
                      className="w-full [&_span[data-slot]]:block [&_span[data-slot]]:truncate"
                    >
                      <Select.SelectValue placeholder="Select a speciality" />
                    </Select.SelectTrigger>
                    <Select.SelectContent>
                      <Select.SelectItem value="physician">
                        Physician
                      </Select.SelectItem>
                      <Select.SelectItem value="dentist">
                        Dentist
                      </Select.SelectItem>
                    </Select.SelectContent>
                  </Select.Select>
                </div>
                <div>
                  <Label htmlFor="doctor-experience" className="sr-only">
                    Experience
                  </Label>
                  <Select.Select onValueChange={setExperience}>
                    <Select.SelectTrigger
                      id="doctor-experience"
                      className="w-full [&_span[data-slot]]:block [&_span[data-slot]]:truncate"
                    >
                      <Select.SelectValue placeholder="Select experience in years" />
                    </Select.SelectTrigger>
                    <Select.SelectContent>
                      <Select.SelectItem value="1">1 year</Select.SelectItem>
                      <Select.SelectItem value="2">2 Years</Select.SelectItem>
                      <Select.SelectItem value="3">3 Years</Select.SelectItem>
                      <Select.SelectItem value="4">4 Years</Select.SelectItem>
                      <Select.SelectItem value="5">5 Years</Select.SelectItem>
                      <Select.SelectItem value="Infinity">
                        More than 5 Years
                      </Select.SelectItem>
                    </Select.SelectContent>
                  </Select.Select>
                </div>
                <div>
                  <Label htmlFor="doctor-gender" className="sr-only">
                    Gender
                  </Label>
                  <Select.Select onValueChange={setGender}>
                    <Select.SelectTrigger
                      id="doctor-gender"
                      className="w-full [&_span[data-slot]]:block [&_span[data-slot]]:truncate"
                    >
                      <Select.SelectValue placeholder="Select a gender" />
                    </Select.SelectTrigger>
                    <Select.SelectContent>
                      <Select.SelectItem value="male">Male</Select.SelectItem>
                      <Select.SelectItem value="female">
                        Female
                      </Select.SelectItem>
                    </Select.SelectContent>
                  </Select.Select>
                </div>
                <div>
                  <Label htmlFor="doctor-time" className="sr-only">
                    Time
                  </Label>
                  <Select.Select onValueChange={setTime}>
                    <Select.SelectTrigger
                      id="doctor-time"
                      className="w-full [&_span[data-slot]]:block [&_span[data-slot]]:truncate"
                    >
                      <Select.SelectValue placeholder="Select a time" />
                    </Select.SelectTrigger>
                    <Select.SelectContent>
                      <Select.SelectItem value="morning">
                        Morning
                      </Select.SelectItem>
                      <Select.SelectItem value="evening">
                        Evening
                      </Select.SelectItem>
                    </Select.SelectContent>
                  </Select.Select>
                </div>
                <div className="col-span-3 grid min-w-fit auto-cols-auto grid-flow-col gap-2">
                  <Button type="submit">Search</Button>
                  <Button type="button" variant="secondary">
                    Reset
                  </Button>
                  <Button asChild type="button" variant="outline">
                    <Link
                      title="Add Doctor"
                      href="/doctors/add"
                      className="flex items-center gap-1 truncate p-2"
                    >
                      <PlusIcon /> Add
                    </Link>
                  </Button>
                </div>
              </form>
            </CN.CardHeader>
            <CN.CardContent className="grid grid-cols-[repeat(auto-fill,minmax(15em,1fr))] gap-4">
              <CN.Card className="rounded-md py-3">
                <CN.CardContent className="space-y-3 px-3">
                  <div className="relative min-h-40 overflow-hidden rounded-md">
                    <Image
                      fill
                      priority
                      alt="Doctor Name"
                      src="/users/user.png"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(2em,1fr))] gap-2">
                    <Badge variant="outline" className="w-full font-serif">
                      Time
                    </Badge>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h2 className="font-serif leading-none">Doctor Name</h2>
                      <span className="block font-serif text-sm leading-none">
                        Speciality
                      </span>
                      <span className="block font-serif text-sm leading-none">
                        Gender
                      </span>
                    </div>
                    <Badge className="font-serif" variant="secondary">
                      Experience
                    </Badge>
                  </div>
                  <Button variant="outline" className="mt-4 block w-full">
                    Get Appointment
                  </Button>
                </CN.CardContent>
              </CN.Card>
            </CN.CardContent>
          </CN.Card>
        </main>
      </section>
    </div>
  );
}
