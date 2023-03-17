exports.up = knex => knex.schema.createTable("DISH", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("description");
    table.text("category").notNullable();
    table.text("image");
    table.decimal("price", 8, 2).notNullable();
    table.integer("user_id").references("id").inTable("USERS");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("DISH");
