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
  uuid,
  jsonb
} from 'drizzle-orm/pg-core';
import type { SensorTemplateData } from '../../types/SensorTemplateData';

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
  }>
) => column.default(sql`(now() at time zone 'utc')`);

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
  timeSheets: many(timeSheet)
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

export const sensorTemplateSchema = pgTable('sensor_template', {
  id: serial('id').primaryKey().unique().notNull(),

  data: jsonb().$type<SensorTemplateData>().notNull(),

  name: text('name').notNull()
});

export const sensorTemplateRelations = relations(sensorTemplateSchema, ({ many }) => ({
  sensors: many(sensorSchema)
}));

export const sensorSchema = pgTable('sensor', {
  id: serial('id').primaryKey().unique().notNull(),

  name: text('name').notNull(),
  secret: char('secret', { length: 36 }).notNull().unique(),

  createdAt: defaultNow(myTimestamp('created_at')).notNull(),

  sensorTemplateId: integer('sensor_template_id')
    .references(() => sensorTemplateSchema.id)
    .notNull(),
  ownerId: integer('owner_id')
    .references(() => userSchema.id)
    .notNull()
});

export const sensorRelations = relations(sensorSchema, ({ one, many }) => ({
  owner: one(userSchema, {
    fields: [sensorSchema.ownerId],
    references: [userSchema.id]
  }),

  sensorTemplate: one(sensorTemplateSchema, {
    fields: [sensorSchema.sensorTemplateId],
    references: [sensorTemplateSchema.id]
  }),

  data: many(sensorDataSchema),

  kiosksToSensors: many(kioskToSensorSchema)
}));

export const sensorDataSchema = pgTable('sensor_data', {
  id: serial('id').primaryKey().unique().notNull(),

  sensorId: integer('sensor_id')
    .references(() => sensorSchema.id)
    .notNull(),

  data: jsonb().$type<(string | number | boolean | null)[]>().notNull(),

  createdAt: defaultNow(myTimestamp('created_at')).notNull()
});

export const sensorDataRelations = relations(sensorDataSchema, ({ one }) => ({
  sensor: one(sensorSchema, {
    fields: [sensorDataSchema.sensorId],
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

export const timeSheet = pgTable('time_sheet', {
  id: uuid('id').defaultRandom().primaryKey().unique().notNull(),

  name: text().notNull(),
  defaultPricePerHour: doublePrecision('default_price_per_hour'),
  defaultHours: doublePrecision('default_hours'),

  createdAt: defaultNow(myTimestamp('created_at')).notNull(),

  ownerId: integer('owner_id')
    .references(() => userSchema.id)
    .notNull()
});

export const timeSheetRelations = relations(timeSheet, ({ one, many }) => ({
  owner: one(userSchema, {
    fields: [timeSheet.ownerId],
    references: [userSchema.id]
  }),

  entries: many(timeSheetEntry)
}));

export const timeSheetEntry = pgTable(
  'time_sheet_entry',
  {
    hours: doublePrecision('hours').notNull(),
    pricePerHour: doublePrecision('price_per_hour').notNull(),

    date: date('date', { mode: 'string' }).notNull(),

    createdAt: defaultNow(myTimestamp('created_at')).notNull(),

    timeSheetId: uuid('time_sheet_id')
      .notNull()
      .references(() => timeSheet.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.date, t.timeSheetId] })
  })
);

export const timeSheetEntryRelations = relations(timeSheetEntry, ({ one }) => ({
  timeSheet: one(timeSheet, {
    fields: [timeSheetEntry.timeSheetId],
    references: [timeSheet.id]
  })
}));
