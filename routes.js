"use strict";
const { response } = require("express");
const express = require("express");
const routes = express.Router();

const cartItems = [
  {
    id: 1,
    product: "Shampoo",
    price: 10,
    quantity: 2,
  },
  {
    id: 2,
    product: "Cheerios",
    price: 2.5,
    quantity: 1,
  },
  {
    id: 3,
    product: "Avocado",
    price: 3,
    quantity: 4,
  },
  {
    id: 4,
    product: "Coffee",
    price: 18,
    quantity: 1,
  },
  {
    id: 5,
    product: "Doo-Doo Paper",
    price: 20,
    quantity: 1,
  },
];

let nextId = 6;

routes.get("/cart-items", (req, res) => {
  let filteredCartItems = cartItems;
  let maxPrice = req.query.maxPrice;
  let prefix = req.query.prefix;
  let pageSize = req.query.pageSize;
  if (maxPrice) {
    filteredCartItems = filteredCartItems.filter((item) => {
      return item.price <= parseInt(maxPrice);
    });
  }
  if (prefix) {
    filteredCartItems = filteredCartItems.filter((item) => {
      return item.product.toLowerCase().includes(prefix.toLowerCase().trim());
    });
  }
  if (pageSize) {
    filteredCartItems = filteredCartItems.slice(0, parseInt(pageSize));
  }
  res.json(filteredCartItems);
});

routes.get("/cart-items/:id", (req, res) => {
  let id = req.params.id;
  let foundItem = cartItems.find((item) => {
    return item.id === parseInt(id);
  });
  if (foundItem) {
    res.json(foundItem);
    res.status(200);
  } else {
    res.status(404);
    res.send(`No product with id: ${id}`);
  }
});

routes.post("/cart-items", (req, res) => {
  let newProduct = req.body;
  newProduct.id = nextId++;
  cartItems.push(newProduct);
  res.status(201);
  res.json(newProduct);
});

routes.put("/cart-items/:id", (req, res) => {
  let id = req.params.id;
  let updatedItem = req.body;
  updatedItem.id = id;
  let index = cartItems.findIndex((item) => {
    return item.id === parseInt(id);
  });
  if (index === -1) {
    res.status(404);
    res.send(`No product found with id: ${id}`);
  } else {
    cartItems[index] = updatedItem;
    res.json(updatedItem);
  }
});

routes.delete("/cart-items/:id", (req, res) => {
  let id = req.params.id;
  let index = cartItems.findIndex((item) => {
    return item.id === parseInt(id);
  });
  if (index === -1) {
    res.status(404);
    res.send(`No product found with id: ${id}`);
  } else {
    cartItems.splice(index, 1);
    res.sendStatus(204);
  }
});

module.exports = routes;
