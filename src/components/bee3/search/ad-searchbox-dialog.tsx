import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import AdSearchboxInput from "./ad-searchbox-input";
import { useState } from "react";

function AdSearchBoxDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="secondary">
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-full w-full max-w-none border-0 p-0">
        <AdSearchboxInput
          onSearch={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AdSearchBoxDialog;
