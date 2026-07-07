export interface ICreateRentalRequestPayload {
  propertyId: string;
  moveInDate: string; // date string from the client
  message?: string;
}

export interface IUpdateRentalStatusPayload {
  status: 'APPROVED' | 'REJECTED';
}
