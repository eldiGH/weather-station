import { convertToTRPCService } from '../clientExports';
import { AuthService } from '../services/AuthService';
import { KioskService } from '../services/KioskService';
import { SensorService } from '../services/SensorService';

export const AuthServiceTRPC = convertToTRPCService(AuthService);
export const KioskServiceTRPC = convertToTRPCService(KioskService);
export const SensorServiceTRPC = convertToTRPCService(SensorService);
