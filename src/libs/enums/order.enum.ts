import { registerEnumType } from "@nestjs/graphql";

export enum OrderStatus {
  PENDING = "PENDING",      // Just created
  ACCEPTED = "ACCEPTED",    // Seller accepted
  REJECTED = "REJECTED",    // Seller rejected
  COMPLETED = "COMPLETED",  // Finished
  CANCELLED = "CANCELLED"   // Buyer cancelled
}
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

export enum OrderType {
  BUY = "BUY",      // Purchase
  RENT = "RENT"     // Rental
} 
registerEnumType(OrderType, {
    name: "OrderType",
})