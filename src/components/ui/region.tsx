import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterRegions } from "@/lib/helpers";

//@ts-ignore
import countryRegionData from "country-region-data/dist/data-umd";
import { useEffect, useState } from "react";

export interface Region {
  name: string;
  shortCode: string;
}

export interface CountryRegion {
  countryName: string;
  countryShortCode: string;
  regions: Region[];
}

interface RegionSelectProps {
  countryCode: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function RegionSelect({
  countryCode,
  value = "",
  onChange = () => {},
  placeholder = "Region",
  className,
  disabled = false,
}: RegionSelectProps) {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const country = countryRegionData.find(
      (c: CountryRegion) => c.countryShortCode === countryCode
    );

    if (country) {
      setRegions(country.regions);
    } else {
      setRegions([]);
    }
  }, [countryCode]);

  return (
    <Select
      value={value}            
      onValueChange={onChange}
      disabled={disabled || !countryCode}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {regions.map(({ name, shortCode }) => (
          <SelectItem key={shortCode} value={shortCode}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


export default RegionSelect;
