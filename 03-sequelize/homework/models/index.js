var { Sequelize, DataTypes } = require("sequelize");
const S = Sequelize;
var db = new Sequelize(
  "postgres://postgres:loscafres@localhost:5432/henryblog",
  {
    logging: false,
  }
);

const Page = db.define("page", {
  // Tu código acá:
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  urlTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("open", "closed"),
  },
  // route: {
  //   type: DataTypes.STRING,
  // },
  route: {
    type: DataTypes.VIRTUAL,
    get() {
      return `/pages/${this.urlTitle}`;
    },
    set(value) {
      throw new Error("no se pueden guardar datos en este campo");
    },
  },
});

// .addHook() method
Page.addHook("beforeValidate", (page) => {
  page.urlTitle =
    page.title && page.title.replace(/\s+/g, "_").replace(/\W/g, "");
});

const User = db.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

const Category = db.define("category", {
  // Tu código acá:
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
  },
});

// Vincular User con Page
// Tu código acá:
//'hasMany', 'belongsTo'
// uno a muchos

User.hasMany(Page);
Page.belongsTo(User);

//'belongsToMany'
// muchos a muchos

Page.belongsToMany(Category, { through: "category_page" });
Category.belongsToMany(Page, { through: "category_page" });

module.exports = {
  User,
  Page,
  Category,
  db,
};
