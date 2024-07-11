import IPackage from "@/interfaces/IPackage";
import { X } from "lucide-react";
import { HTMLAttributes, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cn, fetchJson } from "../lib/utils";
import Button from "./ui/Button";
import Input from "./ui/Input";

export type PackageLookupFormProps = HTMLAttributes<HTMLDivElement> & {
  onLoaded?: (packageData?: IPackage) => void;
};

export default function PackageLookupForm({
  className,
  onLoaded,
  ...restProps
}: PackageLookupFormProps) {
  const [packageData, setPackage] = useState<IPackage | undefined>();
  const [entityId, setEntityId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const loadDeliveryById = useCallback(
    async (inputId: string) => {
      setLoading(true);
      await fetchJson<IPackage>(
        `${import.meta.env.VITE_APP_API_URL}/api/package/${inputId}`,
      )
        .then((data) => {
          setPackage(data);
        })
        .catch(() => {
          toast.error("No package found");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  useEffect(() => {
    onLoaded?.(packageData);
  }, [packageData]);

  return (
    <div className={cn("flex items-center gap-4", className)} {...restProps}>
      <Input
        type="text"
        value={entityId ?? ""}
        disabled={!!packageData}
        placeholder="Enter package ID"
        onChange={(ev) => {
          setEntityId(ev.target.value);
        }}
      />
      {packageData ? (
        <Button
          variant="dark"
          icon={<X size={16} />}
          onClick={() => {
            setPackage(undefined);
            setEntityId(undefined);
          }}
        >
          Clear
        </Button>
      ) : (
        <Button
          loading={loading}
          disabled={!entityId || loading}
          variant="default"
          onClick={() => {
            if (entityId) {
              loadDeliveryById(entityId);
            }
          }}
        >
          Submit
        </Button>
      )}
    </div>
  );
}
