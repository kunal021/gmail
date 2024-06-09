import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectResult: React.FC<{
  maxResult: number;
  setMaxResult: (value: number) => void;
}> = ({ maxResult, setMaxResult }) => {
  return (
    <div>
      <Select onValueChange={(value) => setMaxResult(Number(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={maxResult.toString()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"10"}>10</SelectItem>
          <SelectItem value={"15"}>15</SelectItem>
          <SelectItem value={"20"}>20</SelectItem>
          <SelectItem value={"25"}>25</SelectItem>
          <SelectItem value={"30"}>30</SelectItem>
          <SelectItem value={"45"}>40</SelectItem>
          <SelectItem value={"50"}>50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectResult;
