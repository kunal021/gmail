import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <Loader2 className="animate-spin h-8 w-8" />
    </div>
  );
}

export default Loader;
