export interface SensorTemplateData {
  propertyName: string;
  type: 'text' | 'integer' | 'doublePrecision' | 'boolean';
  isOptional: boolean;
}
