"use client";

import React from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpDown, Check, X, MoreHorizontal, Eye } from "lucide-react";
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
import { ALLOWED_REJECTION_REASONS } from "@/consts/admin";
import {
  getLocalizedDate,
  getLocalizedTime,
  getLocalizedPrice,
  getLocalizedLocation,
} from "@/lib/utils";
import { useLocale } from "next-intl";

// Define the ad type based on API response
type Ad = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  negotiable: boolean;
  adStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  rejectedFor: string | null;
  tier: "Free" | "Pro" | "Expert";
  createdAt: Date;
  updatedAt: Date;
  categoryPath: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  category: {
    id: string;
    path: string;
  } | null;
  city: {
    id: number;
    city_name_ar: string;
    city_name_en: string;
  };
  governorate: {
    id: number;
    governorate_name_ar: string;
    governorate_name_en: string;
  };
  _count: {
    favoritedBy: number;
  };
  analytics: {
    views: number;
    uniqueViews: number;
  };
};

// Fetch ads function
async function fetchAds(filters?: {
  userId?: string;
  adStatus?: string;
}): Promise<Ad[]> {
  const params = new URLSearchParams();
  if (filters?.userId) params.set("userId", filters.userId);
  if (filters?.adStatus) params.set("adStatus", filters.adStatus);

  const response = await fetch(`/api/admin/ads?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch ads");
  }
  const data = await response.json();
  return data.ads;
}

// Accept Ad Dialog Component
function AcceptAdDialog({ ad, onSuccess }: { ad: Ad; onSuccess: () => void }) {
  const t = useTranslations("Admin.Ads");
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const acceptMutation = useMutation({
    mutationFn: async (adId: string) => {
      const response = await fetch("/api/admin/handle-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adId,
          adStatus: "ACCEPTED",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept ad");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("table.actions.accept-success"),
        variant: "success",
      });
      setOpen(false);
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t("table.actions.accept-error"),
        variant: "destructive",
      });
    },
  });

  const handleAccept = () => {
    acceptMutation.mutate(ad.id);
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
        <Check className="me-2 h-4 w-4" />
        {t("table.actions.accept")}
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("table.actions.accept")}</DialogTitle>
            <DialogDescription>
              {t("table.actions.accept-confirm")} "{ad.title}"
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("table.actions.cancel")}
            </Button>
            <Button
              variant="success"
              onClick={handleAccept}
              disabled={acceptMutation.isPending}
            >
              {acceptMutation.isPending
                ? t("table.actions.accepting")
                : t("table.actions.accept")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Reject Ad Dialog Component
function RejectAdDialog({ ad, onSuccess }: { ad: Ad; onSuccess: () => void }) {
  const t = useTranslations("Admin.Ads");
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [rejectedFor, setRejectedFor] = React.useState("");

  const rejectMutation = useMutation({
    mutationFn: async ({
      adId,
      rejectedFor,
    }: {
      adId: string;
      rejectedFor: string;
    }) => {
      const response = await fetch("/api/admin/handle-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adId,
          adStatus: "REJECTED",
          rejectedFor,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject ad");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("table.actions.reject-success"),
        variant: "success",
      });
      setOpen(false);
      setRejectedFor("");
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t("table.actions.reject-error"),
        variant: "destructive",
      });
    },
  });

  const handleReject = () => {
    if (!rejectedFor.trim()) {
      toast({
        title: t("table.actions.reject-reason-required"),
        variant: "destructive",
      });
      return;
    }

    rejectMutation.mutate({
      adId: ad.id,
      rejectedFor: rejectedFor.trim(),
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
        <X className="me-2 h-4 w-4" />
        {t("table.actions.reject")}
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("table.actions.reject")}</DialogTitle>
            <DialogDescription>
              {t("table.actions.reject-confirm")} "{ad.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejected-for">
                {t("table.actions.reject-reason-label")}
              </Label>
              <Select value={rejectedFor} onValueChange={setRejectedFor}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("table.actions.reject-reason-placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {ALLOWED_REJECTION_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {t(`table.actions.reject-reasons.${reason}`)}
                    </SelectItem>
                  ))}
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
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending
                ? t("table.actions.rejecting")
                : t("table.actions.reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminAdsTable() {
  const t = useTranslations("Admin.Ads");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = useQueryState("status", {
    defaultValue: "ALL",
    history: "push",
  });
  const [debouncedStatusFilter, setDebouncedStatusFilter] =
    React.useState<string>("ALL");

  // Debounce status filter changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStatusFilter(statusFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [statusFilter]);

  // Refetch ads data
  const handleRefetch = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
  }, [queryClient]);

  // Memoize the query function
  const queryFn = React.useCallback(() => {
    return fetchAds({
      adStatus:
        debouncedStatusFilter === "ALL" ? undefined : debouncedStatusFilter,
    });
  }, [debouncedStatusFilter]);

  // Define table columns with translations
  const columns: ColumnDef<Ad>[] = React.useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            {t("table.columns.title")}
            <ArrowUpDown className="ms-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="max-w-[200px]">
            <Link
              href={`/ad/${row.original.id}`}
              className="block truncate font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.getValue("title")}
            </Link>
            <div className="truncate text-sm text-muted-foreground">
              {row.original.id}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "user",
        header: t("table.columns.user"),
        cell: ({ row }) => {
          const user = row.original.user;
          if (!user) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            {t("table.columns.price")}
            <ArrowUpDown className="ms-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {getLocalizedPrice(locale, row.getValue("price"))}
            </div>
            {row.original.negotiable && (
              <Badge variant="outline" className="text-xs">
                {t("table.badges.negotiable")}
              </Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "adStatus",
        header: t("table.columns.status"),
        cell: ({ row }) => {
          const status = row.getValue("adStatus") as string;
          const rejectedFor = row.original.rejectedFor;

          let variant: "default" | "warning" | "success" | "destructive" =
            "default";

          switch (status) {
            case "PENDING":
              variant = "warning";
              break;
            case "ACCEPTED":
              variant = "success";
              break;
            case "REJECTED":
              variant = "destructive";
              break;
          }

          return (
            <div>
              <Badge variant={variant}>
                {t(`table.badges.${status.toLowerCase()}`)}
              </Badge>
              {rejectedFor && (
                <div className="mt-1 max-w-[150px] truncate text-xs text-muted-foreground">
                  {t(`table.actions.reject-reasons.${rejectedFor}`)}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "tier",
        header: t("table.columns.tier"),
        cell: ({ row }) => {
          const tier = row.getValue("tier") as string;
          let variant: "default" | "info" | "warning" = "default";

          switch (tier) {
            case "Pro":
              variant = "info";
              break;
            case "Expert":
              variant = "warning";
              break;
            default:
              variant = "default";
          }

          return <Badge variant={variant}>{tier}</Badge>;
        },
      },
      {
        accessorKey: "city",
        header: t("table.columns.location"),
        cell: ({ row }) => {
          const city = row.original.city;
          const [i18nedGov, i18nedCity] = getLocalizedLocation(
            locale,
            city.id,
          ).split(", ");

          return (
            <div className="text-sm">
              <div>{i18nedCity}</div>
              <div className="text-muted-foreground">{i18nedGov}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "analytics",
        header: t("table.columns.analytics"),
        cell: ({ row }) => {
          const analytics = row.original.analytics;
          const favoritesCount = row.original._count.favoritedBy;

          return (
            <div className="text-sm">
              <div>
                <Eye className="me-1 inline h-3 w-3" />
                {analytics.views} {t("table.stats.views")}
              </div>
              <div className="text-muted-foreground">
                {favoritesCount} {t("table.stats.favorites")}
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
            {t("table.columns.created")}
            <ArrowUpDown className="ms-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return (
            <div className="text-sm">
              <div>{getLocalizedDate(locale, date)}</div>
              <div className="text-muted-foreground">
                {getLocalizedTime(locale, date)}
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: t("table.columns.actions"),
        cell: ({ row }) => {
          const ad = row.original;
          const isPending = ad.adStatus === "PENDING";

          if (!isPending) {
            return (
              <div className="text-xs text-muted-foreground">
                {t("table.actions.already-processed")}
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
                <AcceptAdDialog ad={ad} onSuccess={handleRefetch} />
                <RejectAdDialog ad={ad} onSuccess={handleRefetch} />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, handleRefetch],
  );

  // Fetch ads data
  const {
    data: ads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-ads", debouncedStatusFilter],
    queryFn,
    staleTime: 30_000, // Data is considered fresh for 30 seconds
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    retry: 3, // Retry failed requests 3 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  const table = useReactTable({
    data: ads,
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
      {/* Header and controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("filters.status.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.status.all")}</SelectItem>
              <SelectItem value="PENDING">
                {t("filters.status.pending")}
              </SelectItem>
              <SelectItem value="ACCEPTED">
                {t("filters.status.accepted")}
              </SelectItem>
              <SelectItem value="REJECTED">
                {t("filters.status.rejected")}
              </SelectItem>
            </SelectContent>
          </Select>
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
          {t("table.pagination.ads-displayed")}.
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
