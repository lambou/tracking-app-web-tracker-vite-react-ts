import { useState } from "react";
import useWebSocket from "react-use-websocket";
import EmptyContent from "./components/EmptyContent";
import PackageLookupForm from "./components/PackageLookupForm";
import DeliveryDetailsCard from "./components/sections/DeliveryDetailsCard";
import DeliveryMap from "./components/sections/DeliveryMap";
import PackageDetailsCard from "./components/sections/PackageDetailsCard";
import IDelivery from "./interfaces/IDelivery";
import IPackage from "./interfaces/IPackage";
import IWebSocketEvent from "./interfaces/IWebSocketEvent";

function App() {
  const [delivery, setDelivery] = useState<IDelivery | undefined>();
  const [packageData, setPackageData] = useState<IPackage | undefined>();

  const {} = useWebSocket(`${import.meta.env.VITE_WEBSOCKET_API_URL}`, {
    shouldReconnect: () => true,
    onMessage: (message) => {
      const data = JSON.parse(message.data) as IWebSocketEvent;

      // a package has been selected
      if (packageData && delivery) {
        // a package has been updated and it matches the selected delivery
        if (
          data.event === "delivery_updated" &&
          data.delivery_object._id === delivery._id
        ) {
          setDelivery(data.delivery_object);
        }
      }
    },
  });

  return (
    <div className="flex-auto flex flex-col gap-6 py-10 container">
      <h1 className="text-4xl font-bold capitalize text-center">Web tracker</h1>
      <div className="flex-auto flex flex-col items-center gap-6">
        <PackageLookupForm
          className="max-w-3xl w-full"
          onLoaded={(packageData) => {
            setPackageData(packageData);
            setDelivery(packageData?.active_delivery);
          }}
        />
        <div className="w-full flex gap-6">
          {packageData ? (
            <div className="flex flex-col gap-6 w-full max-w-sm">
              <PackageDetailsCard data={packageData} />
              {delivery ? (
                <DeliveryDetailsCard data={delivery} />
              ) : (
                <EmptyContent message="No active delivery" />
              )}
            </div>
          ) : (
            <EmptyContent className="min-h-[256px] w-full max-w-sm" />
          )}
          {packageData ? (
            <DeliveryMap
              className="flex-auto"
              packageData={packageData}
              deliveryPosition={delivery?.location}
            />
          ) : (
            <EmptyContent className="flex-auto" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
