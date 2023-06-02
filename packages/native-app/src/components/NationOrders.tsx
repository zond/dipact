import { NationStatusDisplay } from "diplicity-common-internal";
import { ListItem } from "@rneui/base";
import React, { useState } from "react";
import NationSummary from "../components/NationSummary";
import Order from "../components/Order";

interface NationOrdersProps {
  nationStatus: NationStatusDisplay;
}

const NationOrders = ({ nationStatus }: NationOrdersProps) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <ListItem.Accordion
        isExpanded={open}
        onPress={() => setOpen(!open)}
        noIcon={!nationStatus.orders.length}
        content={
          <ListItem.Content>
            <ListItem.Title>
              <NationSummary nationStatus={nationStatus} />
            </ListItem.Title>
          </ListItem.Content>
        }
      >
        {nationStatus.orders.map((order) => (
          <ListItem key={order.label}>
            <ListItem.Content>
              <Order order={order} />
            </ListItem.Content>
          </ListItem>
        ))}
      </ListItem.Accordion>
    </>
  );
};

export default NationOrders;
