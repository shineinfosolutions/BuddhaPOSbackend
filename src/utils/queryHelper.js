const buildQueryOptions = (req) => {
  const page = Math.min(parseInt(req.query.page) || 1, 10); // Max 10 pages
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;

  return { page, limit, skip, search };
};

const buildSearchQuery = (fields, searchText) => {
  if (!searchText) return {};

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: searchText, $options: "i" },
    })),
  };
};

const buildDateQuery = (req) => {
  const { startDate, endDate, dateField = 'createdAt' } = req.query;
  const dateQuery = {};

  if (startDate || endDate) {
    dateQuery[dateField] = {};
    if (startDate) dateQuery[dateField].$gte = new Date(startDate);
    if (endDate) dateQuery[dateField].$lte = new Date(endDate);
  }

  return dateQuery;
};

const buildNumberQuery = (req) => {
  const { minPrice, maxPrice, minQty, maxQty, minAmount, maxAmount } = req.query;
  const numberQuery = {};

  if (minPrice || maxPrice) {
    numberQuery.price = {};
    if (minPrice) numberQuery.price.$gte = parseFloat(minPrice);
    if (maxPrice) numberQuery.price.$lte = parseFloat(maxPrice);
  }

  if (minQty || maxQty) {
    numberQuery.qty = {};
    if (minQty) numberQuery.qty.$gte = parseInt(minQty);
    if (maxQty) numberQuery.qty.$lte = parseInt(maxQty);
  }

  if (minAmount || maxAmount) {
    numberQuery.totalAmount = {};
    if (minAmount) numberQuery.totalAmount.$gte = parseFloat(minAmount);
    if (maxAmount) numberQuery.totalAmount.$lte = parseFloat(maxAmount);
  }

  return numberQuery;
};

const buildCompleteQuery = (req, searchFields) => {
  const { search } = buildQueryOptions(req);
  
  const searchQuery = buildSearchQuery(searchFields, search);
  const dateQuery = buildDateQuery(req);
  const numberQuery = buildNumberQuery(req);

  return { ...searchQuery, ...dateQuery, ...numberQuery };
};

module.exports = {
  buildQueryOptions,
  buildSearchQuery,
  buildDateQuery,
  buildNumberQuery,
  buildCompleteQuery
};