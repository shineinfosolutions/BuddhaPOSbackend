const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');
const { buildQueryOptions, buildCompleteQuery } = require('../utils/queryHelper');

exports.createItem = async (req, res, next) => {
  try {
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    
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
    
    const item = await Category.create(itemData);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.getAllItems = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildQueryOptions(req);
    const query = buildCompleteQuery(req, ['categoryName', 'itemName']);
    
    const total = await Category.countDocuments(query);
    const items = await Category.find(query)
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

exports.getItemsByCategory = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildQueryOptions(req);
    const query = buildCompleteQuery(req, ['itemName']);
    query.categoryName = req.params.categoryName;
    
    const total = await Category.countDocuments(query);
    const items = await Category.find(query)
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

exports.getDistinctCategories = async (req, res, next) => {
  try {
    const categories = await Category.distinct('categoryName');
    res.json(categories);
  } catch (err) { next(err); }
};

exports.getItemById = async (req, res, next) => {
  try {
    const item = await Category.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) { next(err); }
};

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
    
    const updated = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) { next(err); }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const item = await Category.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};