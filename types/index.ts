export interface ICar {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  city: string;
  fuelType: "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid";
  transmission: "Manual" | "Automatic";
  kilometers: number;
  ownership: "1st Owner" | "2nd Owner" | "3rd Owner" | "4th Owner+";
  registrationState: string;
  description: string;
  features: string[];
  inspectionReport: string;
  serviceHistory: string;
  images: string[];
  createdAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  city: string;
  createdAt: string;
}

export interface ICarRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  budget: number;
  fuelType: string;
  transmission: string;
  preferredYear: number;
  city: string;
  message: string;
  // Legacy fields
  userId?: string | IUser;
  requestedCar?: string;
  status: "pending" | "sourcing" | "found" | "delivered" | "closed";
  createdAt: string;
}

export interface CarFiltersState {
  city: string;
  budgetMin: number;
  budgetMax: number;
  brand: string;
  fuelType: string;
  transmission: string;
  year: string;
  kilometersMax: number;
  ownership: string;
}
