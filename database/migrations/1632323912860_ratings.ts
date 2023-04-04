import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Ratings extends BaseSchema {
  protected tableName = "ratings";

  public async up() {
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.increments("id").primary().notNullable().unsigned();
      table
        .integer("appointment_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("appointments");
      table.string("customer_comment");
      table.integer("customer_rating");
      table
        .integer("customer_id")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("customers");
      table.string("provider_comment");
      table.integer("provider_rating");
      table
        .integer("provider_id")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("providers");
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
