const Item = require('../models/Item');
const cloudinary = require('../config/cloudinary');
const { buildQueryOptions, buildCompleteQuery } = require('../utils/queryHelper');

// Create item
exports.createItem = async (req, res, next) => {
  try {
    let imageUrl = req.body.imageUrl || null;
    
    // If file is uploaded, use Cloudinary
    if (req.files && req.files.image) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'buddha-pos/menu-items' },
          (error, result) => {
            if (error) reject(error);
            else {
              imageUrl = result.secure_url;
              resolve(result);
            }
          }
        );
        stream.end(req.files.image[0].buffer);
      });
    }
    
    const itemData = { ...req.body };
    if (imageUrl) itemData.imageUrl = imageUrl;
    
    const item = await Item.create(itemData);
    const populatedItem = await Item.findById(item._id).populate('categoryId');
    res.status(201).json(populatedItem);
  } catch (err) { next(err); }
};

// Bulk create items
exports.bulkCreateItems = async (req, res, next) => {
  try {
    const items = await Item.insertMany(req.body.items);
    const populatedItems = await Item.find({ _id: { $in: items.map(i => i._id) } }).populate('categoryId');
    res.status(201).json({ count: items.length, data: populatedItems });
  } catch (err) { next(err); }
};

// Get all items with pagination and search
exports.getAllItems = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildQueryOptions(req);
    const query = buildCompleteQuery(req, ['itemName']);
    
    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('categoryId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: items
    });
  } catch (err) { next(err); }
};

// Get items by category
exports.getItemsByCategory = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildQueryOptions(req);
    const query = buildCompleteQuery(req, ['itemName']);
    query.categoryId = req.params.categoryId;
    
    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('categoryId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: items
    });
  } catch (err) { next(err); }
};

// Get item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('categoryId');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) { next(err); }
};

// Update item
exports.updateItem = async (req, res, next) => {
  try {
    let updateData = { ...req.body };
    
    // If file is uploaded, use Cloudinary
    if (req.files && req.files.image) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'buddha-pos/menu-items' },
          (error, result) => {
            if (error) reject(error);
            else {
              updateData.imageUrl = result.secure_url;
              resolve(result);
            }
          }
        );
        stream.end(req.files.image[0].buffer);
      });
    }
    
    const updated = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('categoryId');
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

// Toggle item availability
exports.toggleAvailability = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.isAvailable = !item.isAvailable;
    await item.save();
    const populatedItem = await Item.findById(item._id).populate('categoryId');
    res.json(populatedItem);
  } catch (err) { next(err); }
};

// Delete item
exports.deleteItem = async (req, res, next) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) { next(err); }
};