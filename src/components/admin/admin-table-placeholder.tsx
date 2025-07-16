import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function AdminTablePlaceholder() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 8 }).map((_, colIdx) => (
              <TableHead key={colIdx}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: 8 }).map((_, colIdx) => (
                <TableCell key={colIdx}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminTablePlaceholder;
