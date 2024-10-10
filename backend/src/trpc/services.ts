import { convertToTRPCService } from '../clientExports';
import { AuthService } from '../services/AuthService';
import { KioskService } from '../services/KioskService';
import { SensorService } from '../services/SensorService';
import { TimeSheetService } from '../services/TimeSheetService';

export const AuthServiceTRPC = convertToTRPCService(AuthService);
export const KioskServiceTRPC = convertToTRPCService(KioskService);
export const SensorServiceTRPC = convertToTRPCService(SensorService);
export const TimeSheetServiceTRPC = convertToTRPCService(TimeSheetService);
