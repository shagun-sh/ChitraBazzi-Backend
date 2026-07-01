const db = require("../config/db");

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [items] = await db.query(
      `
      SELECT
        ci.cart_item_id,
        p.product_id,
        p.product_name,
        p.price,
        p.image_url,
        ci.quantity
      FROM Cart_Items ci
      JOIN Cart c ON ci.cart_id = c.cart_id
      JOIN Product p ON ci.product_id = p.product_id
      WHERE c.user_id = ?
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      cart: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// POST /api/cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    let [cart] = await db.query(
      "SELECT * FROM Cart WHERE user_id = ?",
      [userId]
    );

    let cartId;

    if (cart.length === 0) {
      const [newCart] = await db.query(
        "INSERT INTO Cart (user_id) VALUES (?)",
        [userId]
      );

      cartId = newCart.insertId;
    } else {
      cartId = cart[0].cart_id;
    }

    const [existingItem] = await db.query(
      "SELECT * FROM Cart_Items WHERE cart_id = ? AND product_id = ?",
      [cartId, product_id]
    );

    if (existingItem.length > 0) {
      await db.query(
        `
        UPDATE Cart_Items
        SET quantity = quantity + ?
        WHERE cart_id = ? AND product_id = ?
        `,
        [quantity, cartId, product_id]
      );
    } else {
      await db.query(
        `
        INSERT INTO Cart_Items
        (cart_id, product_id, quantity)
        VALUES (?, ?, ?)
        `,
        [cartId, product_id, quantity]
      );
    }

    res.status(201).json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

// PUT /api/cart/:id
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const [result] = await db.query(
      `
      UPDATE Cart_Items
      SET quantity = ?
      WHERE cart_item_id = ?
      `,
      [quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// DELETE /api/cart/:id
exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM Cart_Items WHERE cart_item_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item",
    });
  }
};