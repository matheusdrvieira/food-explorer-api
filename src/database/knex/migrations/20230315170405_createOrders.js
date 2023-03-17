exports.up = knex => knex.schema.createTable("ORDER", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("USERS");
    table.decimal("amount", 14, 2).notNullable();
    table.text("payment").notNullable();
    table.text("status");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("ORDER");