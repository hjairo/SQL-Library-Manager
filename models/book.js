'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {

  };

  Book.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `Title name is required`,
          },
          notNull: {
            msg: `Provide a title name`,
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `Author is required`,
          },
          notNull: {
            msg: `Provide the Author's name`,
          },
        },
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `Genre name is required`,
          },
          notNull: {
            msg: `Provide a genre`,
          },
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `Year is required`,
          },
          notNull: {
            msg: `Please provide the Year`,
          },
          isNumeric: {
            msg: `Year value should be an integer`,
          }
        },
      },
    },
    { sequelize }
  );
  
  return Book;
};