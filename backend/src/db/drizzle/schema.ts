import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  char,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  customType,
  type PgCustomColumnBuilder,
  date,
  uuid
} from 'drizzle-orm/pg-core';

const myTimestamp = customType<{ data: Date; driverData: string }>({
  dataType() {
    return 'timestamp without time zone';
  },

  toDriver(value) {
    return value.toISOString();
  },

  fromDriver(value) {
    return new Date(`${value}Z`);
  }
});

const defaultNow = <T extends string>(
  column: PgCustomColumnBuilder<{
    name: T;
    dataType: 'custom';
    columnType: 'PgCustomColumn';
    data: Date;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
  }>
) => column.default(sql`(now() at time zone 'utc')`);

export const sensorTypeEnumSchema = pgEnum('sensor_type', ['BME68X']);

export const userSchema = pgTable('user', {
  id: serial('id').primaryKey(),

  email: text('email').unique().notNull(),
  password: text('password').notNull(),

  createdAt: defaultNow(myTimestamp('created_at')).notNull()
});

export type UserModel = typeof userSchema.$inferSelect;

export const userRelations = relations(userSchema, ({ many }) => ({
  sensors: many(sensorSchema),
  refreshTokens: many(refreshTokenSchema),
  kiosks: many(kioskSchema),
  timeSheets: many(timeSheetSchema)
}));

export const kioskSchema = pgTable('kiosk', {
  id: serial('id').primaryKey().unique().notNull(),

  kioskUuid: char('kiosk_uuid', { length: 36 }).unique().notNull(),

  ownerId: integer('owner_id')
    .references(() => userSchema.id)
    .notNull(),

  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude')
});

export const kioskRelations = relations(kioskSchema, ({ one, many }) => ({
  owner: one(userSchema, {
    fields: [kioskSchema.ownerId],
    references: [userSchema.id]
  }),

  kiosksToSensors: many(kioskToSensorSchema)
}));

export const refreshTokenSchema = pgTable('refresh_token', {
  id: serial('id').primaryKey().unique().notNull(),

  token: char('token', { length: 36 }).unique().notNull(),
  revoked: boolean('revoked').default(false).notNull(),

  userId: integer('user_id')
    .references(() => userSchema.id)
    .notNull(),

  sessionId: char('session_id', { length: 36 }).notNull(),

  expirationDate: myTimestamp('expiration_date').notNull(),

  createdAt: defaultNow(myTimestamp('created_at')).notNull()
});

export const refreshTokenRelations = relations(refreshTokenSchema, ({ one }) => ({
  user: one(userSchema, { fields: [refreshTokenSchema.userId], references: [userSchema.id] })
}));

export const sensorSchema = pgTable('sensor', {
  id: serial('id').primaryKey().unique().notNull(),

  name: text('name').notNull(),
  type: sensorTypeEnumSchema('type').notNull(),
  secret: char('secret', { length: 36 }).notNull().unique(),

  createdAt: defaultNow(myTimestamp('created_at')).notNull(),

  ownerId: integer('owner_id')
    .references(() => userSchema.id)
    .notNull()
});

export const sensorRelations = relations(sensorSchema, ({ one, many }) => ({
  owner: one(userSchema, {
    fields: [sensorSchema.ownerId],
    references: [userSchema.id]
  }),

  bme68xData: many(bme68xDataSchema),

  kiosksToSensors: many(kioskToSensorSchema)
}));

export const bme68xDataSchema = pgTable('bme68x_data', {
  id: serial('id').primaryKey().unique().notNull(),

  temperature: doublePrecision('temperature').notNull(),
  humidity: doublePrecision('humidity').notNull(),
  pressure: doublePrecision('pressure').notNull(),
  gasResistance: doublePrecision('gas_resistance').notNull(),
  batteryPercentage: doublePrecision('battery_percentage').notNull(),

  sensorId: integer('sensor_id')
    .references(() => sensorSchema.id)
    .notNull(),

  createdAt: defaultNow(myTimestamp('created_at')).notNull()
});

export const bme68xSensorDataRelations = relations(bme68xDataSchema, ({ one }) => ({
  sensor: one(sensorSchema, {
    fields: [bme68xDataSchema.sensorId],
    references: [sensorSchema.id]
  })
}));

export const kioskToSensorSchema = pgTable(
  'kiosk_to_sensor',
  {
    kioskId: integer('kiosk_id')
      .notNull()
      .references(() => kioskSchema.id),
    sensorId: integer('sensor_id')
      .notNull()
      .references(() => sensorSchema.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.kioskId, t.sensorId] })
  })
);

export const kioskToSensorRelations = relations(kioskToSensorSchema, ({ one }) => ({
  kiosk: one(kioskSchema, {
    fields: [kioskToSensorSchema.kioskId],
    references: [kioskSchema.id]
  }),

  sensor: one(sensorSchema, {
    fields: [kioskToSensorSchema.sensorId],
    references: [sensorSchema.id]
  })
}));

export const timeSheetSchema = pgTable('time_sheet', {
  id: uuid('id').defaultRandom().primaryKey().unique().notNull(),

  name: text().notNull(),
  defaultPricePerHour: doublePrecision('default_price_per_hour'),
  defaultHours: integer('default_hours'),

  createdAt: defaultNow(myTimestamp('created_at')).notNull(),

  ownerId: integer('owner_id')
    .references(() => userSchema.id)
    .notNull()
});

export const timeSheetRelations = relations(timeSheetSchema, ({ one, many }) => ({
  owner: one(userSchema, {
    fields: [timeSheetSchema.ownerId],
    references: [userSchema.id]
  }),

  entries: many(timeSheetEntrySchema)
}));

export const timeSheetEntrySchema = pgTable(
  'time_sheet_entry',
  {
    hours: integer('hours').notNull(),
    pricePerHour: doublePrecision('pricePerHour').notNull(),

    date: date('date', { mode: 'string' }).notNull(),

    createdAt: defaultNow(myTimestamp('created_at')).notNull(),

    timeSheetId: uuid('time_sheet_id')
      .notNull()
      .references(() => timeSheetSchema.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.date, t.timeSheetId] })
  })
);

export const timeSheetEntryRelations = relations(timeSheetEntrySchema, ({ one }) => ({
  timeSheet: one(timeSheetSchema, {
    fields: [timeSheetEntrySchema.timeSheetId],
    references: [timeSheetSchema.id]
  })
}));
