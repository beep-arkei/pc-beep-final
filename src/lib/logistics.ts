/**
 * Logistics Simulation Utility
 * Simulates J&T Express tracking statuses based on order creation time.
 */

export type TrackingStatus = {
  status: string;
  location: string;
  timestamp: string;
  description: string;
  isCompleted: boolean;
};

export const getSimulatedTrackingStatus = (createdAt: string): TrackingStatus[] => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

  const statuses: TrackingStatus[] = [
    {
      status: "Order Placed",
      location: "PC Beep Store",
      timestamp: createdDate.toISOString(),
      description: "Your order has been successfully placed and is being processed.",
      isCompleted: true
    }
  ];

  // Preparing to Ship (1-24 hrs)
  if (diffInHours >= 1) {
    const timestamp = new Date(createdDate.getTime() + 1 * 60 * 60 * 1000); // +1 hour
    statuses.push({
      status: "Preparing to Ship",
      location: "PC Beep Warehouse",
      timestamp: timestamp.toISOString(),
      description: "Our team is packing your items and preparing them for courier pickup.",
      isCompleted: true
    });
  } else {
    statuses.push({
      status: "Preparing to Ship",
      location: "PC Beep Warehouse",
      timestamp: "",
      description: "Waiting for processing.",
      isCompleted: false
    });
  }

  // Picked up by Courier (24-48 hrs)
  if (diffInHours >= 24) {
    const timestamp = new Date(createdDate.getTime() + 24 * 60 * 60 * 1000); // +24 hours
    statuses.push({
      status: "Picked up by Courier",
      location: "Dauis Hub",
      timestamp: timestamp.toISOString(),
      description: "J&T Express has picked up your parcel from our warehouse.",
      isCompleted: true
    });
  } else {
    statuses.push({
      status: "Picked up by Courier",
      location: "Dauis Hub",
      timestamp: "",
      description: "Waiting for courier pickup.",
      isCompleted: false
    });
  }

  // In Transit (48+ hrs)
  if (diffInHours >= 48) {
    const timestamp = new Date(createdDate.getTime() + 48 * 60 * 60 * 1000); // +48 hours
    statuses.push({
      status: "In Transit",
      location: "Tagbilaran Sorting Center",
      timestamp: timestamp.toISOString(),
      description: "Your parcel is on its way to the delivery hub.",
      isCompleted: true
    });
  } else {
    statuses.push({
      status: "In Transit",
      location: "Sorting Center",
      timestamp: "",
      description: "Pending transit.",
      isCompleted: false
    });
  }

  return statuses.reverse(); // Newest first for the UI
};
