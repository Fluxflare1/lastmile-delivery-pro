export const courierTrackingSocket = (token: string) =>
  new WebSocket(`wss://api.lastmile-delivery-pro.com/ws/couriers/performance?token=${token}`);
