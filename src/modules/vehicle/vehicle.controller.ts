import { Request, Response } from "express";
import {
  createVehicleService,
  getAllVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  deleteVehicleService,
  VehicleData
} from "./vehicle.service";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const payload: VehicleData = req.body;
    // basic validation
    const { vehicle_name, type, registration_number, daily_rent_price } = payload;
    if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
      return res.status(400).json({ success: false, message: "vehicle_name, type, registration_number, daily_rent_price are required" });
    }

    const vehicle = await createVehicleService(payload);
    res.status(201).json({ success: true, message: "Vehicle created successfully", data: vehicle });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehiclesService();
    const message = vehicles.length ? "Vehicles retrieved successfully" : "No vehicles found";
    res.status(200).json({ success: true, message, data: vehicles });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const vehicle = await getVehicleByIdService(id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    res.status(200).json({ success: true, message: "Vehicle retrieved successfully", data: vehicle });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateVehicleService(id, req.body);
    res.status(200).json({ success: true, message: "Vehicle updated successfully", data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteVehicleService(id);
    res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
