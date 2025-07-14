"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpDown, Ban, Shield, MoreHorizontal } from "lucide-react";
import {
  BackwardChevron,
  ForwardChevron,
  BackwardChevrons,
  ForwardChevrons,
} from "@/components/ui/chevrons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

// Simple date formatting helper
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Define the user type based on API response
type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  phoneNumberVerified: boolean | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  _count: {
    ads: number;
    favoriteAds: number;
  };
};

// Fetch users function
async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/admin/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await response.json();
  return data.users;
}

// Ban Dialog Component
function BanDialog({ user, onSuccess }: { user: User; onSuccess: () => void }) {
  const t = useTranslations("Admin.Users");
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [banReason, setBanReason] = React.useState("");
  const [banDuration, setBanDuration] = React.useState("permanent");

  const banMutation = useMutation({
    mutationFn: async ({
      userId,
      banReason,
      banExpiresIn,
    }: {
      userId: string;
      banReason?: string;
      banExpiresIn?: number;
    }) => {
      return authClient.admin.banUser({
        userId,
        banReason: banReason || undefined,
        banExpiresIn: banExpiresIn || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: t("table.actions.ban-success"),
        variant: "success",
      });
      setOpen(false);
      setBanReason("");
      setBanDuration("permanent");
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t("table.actions.ban-error"),
        variant: "destructive",
      });
    },
  });

  const handleBan = () => {
    const banExpiresIn =
      banDuration === "permanent"
        ? undefined
        : parseInt(banDuration) * 24 * 60 * 60; // Convert days to seconds

    banMutation.mutate({
      userId: user.id,
      banReason: banReason.trim() || undefined,
      banExpiresIn,
    });
  };

  return (
    <>
      <DropdownMenuItem
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Ban className="mr-2 h-4 w-4" />
        {t("table.actions.ban")}
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("table.actions.ban")}</DialogTitle>
            <DialogDescription>
              {t("table.actions.ban-confirm")} ({user.name})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ban-reason">
                {t("table.actions.ban-reason-label")}
              </Label>
              <Textarea
                id="ban-reason"
                placeholder={t("table.actions.ban-reason-placeholder")}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ban-duration">
                {t("table.actions.ban-duration-label")}
              </Label>
              <Select value={banDuration} onValueChange={setBanDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">
                    {t("table.actions.ban-duration-permanent")}
                  </SelectItem>
                  <SelectItem value="1">
                    {t("table.actions.ban-duration-days", { count: 1 })}
                  </SelectItem>
                  <SelectItem value="7">
                    {t("table.actions.ban-duration-days", { count: 7 })}
                  </SelectItem>
                  <SelectItem value="30">
                    {t("table.actions.ban-duration-days", { count: 30 })}
                  </SelectItem>
                  <SelectItem value="90">
                    {t("table.actions.ban-duration-days", { count: 90 })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("table.actions.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={banMutation.isPending}
            >
              {banMutation.isPending
                ? t("table.actions.banning")
                : t("table.actions.ban")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Unban Confirmation Dialog Component
function UnbanDialog({
  user,
  onSuccess,
}: {
  user: User;
  onSuccess: () => void;
}) {
  const t = useTranslations("Admin.Users");
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const unbanMutation = useMutation({
    mutationFn: async (userId: string) => {
      return authClient.admin.unbanUser({ userId });
    },
    onSuccess: () => {
      toast({
        title: t("table.actions.unban-success"),
        variant: "success",
      });
      setOpen(false);
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t("table.actions.unban-error"),
        variant: "destructive",
      });
    },
  });

  const handleUnban = () => {
    unbanMutation.mutate(user.id);
  };

  return (
    <>
      <DropdownMenuItem
        className="bg-success text-success-foreground hover:bg-success/90"
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Shield className="mr-2 h-4 w-4" />
        {t("table.actions.unban")}
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("table.actions.unban")}</DialogTitle>
            <DialogDescription>
              {t("table.actions.unban-confirm")} ({user.name})
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("table.actions.cancel")}
            </Button>
            <Button
              variant="success"
              onClick={handleUnban}
              disabled={unbanMutation.isPending}
            >
              {unbanMutation.isPending
                ? t("table.actions.unbanning")
                : t("table.actions.unban")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminUsersTable() {
  const t = useTranslations("Admin.Users");
  const queryClient = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Refetch users data
  const handleRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  // Define table columns with translations
  const columns: ColumnDef<User>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            {t("table.columns.name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.id}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            {t("table.columns.email")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div>{row.getValue("email")}</div>
            <div className="mt-1 flex items-center gap-1">
              <Badge
                variant={row.original.emailVerified ? "success" : "warning"}
                className="text-xs"
              >
                {row.original.emailVerified
                  ? t("table.badges.verified")
                  : t("table.badges.unverified")}
              </Badge>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: t("table.columns.phone"),
        cell: ({ row }) => {
          const phoneNumber = row.getValue("phoneNumber") as string | null;
          const phoneVerified = row.original.phoneNumberVerified;

          if (!phoneNumber) {
            return <span className="text-muted-foreground">—</span>;
          }

          return (
            <div>
              <div>{phoneNumber}</div>
              <div className="mt-1 flex items-center gap-1">
                <Badge
                  variant={phoneVerified ? "success" : "warning"}
                  className="text-xs"
                >
                  {phoneVerified
                    ? t("table.badges.verified")
                    : t("table.badges.unverified")}
                </Badge>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: t("table.columns.role"),
        cell: ({ row }) => {
          const role = row.getValue("role") as string | null;
          if (!role) {
            return <Badge variant="outline">{t("table.badges.user")}</Badge>;
          }
          return (
            <Badge variant={role === "admin" ? "info" : "outline"}>
              {role === "admin"
                ? t("table.badges.admin")
                : t("table.badges.user")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "banned",
        header: t("table.columns.status"),
        cell: ({ row }) => {
          const banned = row.original.banned;
          const banExpires = row.original.banExpires;

          if (banned) {
            const isExpired = banExpires && new Date(banExpires) < new Date();
            return (
              <div>
                <Badge variant={isExpired ? "warning" : "destructive"}>
                  {isExpired
                    ? t("table.badges.ban-expired")
                    : t("table.badges.banned")}
                </Badge>
                {banExpires && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t("table.status.until")} {formatDate(new Date(banExpires))}
                  </div>
                )}
              </div>
            );
          }

          return <Badge variant="success">{t("table.badges.active")}</Badge>;
        },
      },
      {
        accessorKey: "_count",
        header: t("table.columns.stats"),
        cell: ({ row }) => {
          const count = row.getValue("_count") as {
            ads: number;
            favoriteAds: number;
          };
          return (
            <div className="text-sm">
              <div>
                {count.ads} {t("table.stats.ads")}
              </div>
              <div className="text-muted-foreground">
                {count.favoriteAds} {t("table.stats.favorites")}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            {t("table.columns.joined")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return (
            <div className="text-sm">
              <div>{formatDate(date)}</div>
              <div className="text-muted-foreground">{formatTime(date)}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: t("table.columns.actions"),
        cell: ({ row }) => {
          const user = row.original;
          const isAdmin = user.role === "admin";
          const isBanned = user.banned;

          // Don't show actions for admin users
          if (isAdmin) {
            return (
              <div className="text-xs text-muted-foreground">
                {t("table.actions.cannot-ban-admin")}
              </div>
            );
          }

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isBanned ? (
                  <UnbanDialog user={user} onSuccess={handleRefetch} />
                ) : (
                  <BanDialog user={user} onSuccess={handleRefetch} />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, handleRefetch],
  );

  // Fetch users data
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="font-medium text-red-600">{t("error.title")}</div>
        <div className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : t("error.description")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and search */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder={t("search.placeholder")}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("table.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length}{" "}
          {t("table.pagination.of")} {table.getFilteredRowModel().rows.length}{" "}
          {t("table.pagination.users-displayed")}.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              {t("table.pagination.rows-per-page")}
            </p>
            <select
              className="h-8 w-[70px] rounded border border-input bg-background px-2 text-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {t("table.pagination.page")}{" "}
            {table.getState().pagination.pageIndex + 1}{" "}
            {t("table.pagination.of")} {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">
                {t("table.pagination.go-to-first")}
              </span>
              <BackwardChevrons className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">
                {t("table.pagination.go-to-previous")}
              </span>
              <BackwardChevron className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">
                {t("table.pagination.go-to-next")}
              </span>
              <ForwardChevron className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">
                {t("table.pagination.go-to-last")}
              </span>
              <ForwardChevrons className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
