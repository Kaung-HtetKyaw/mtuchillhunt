const { makeMap } = require("./utils");

exports.normalizeQueryOperator = (queryString) => {
  return JSON.parse(
    JSON.stringify(queryString).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )
  );
};

exports.normalizeQueryString = (queryString, excluded_query) => {
  let result = {};
  for (const key in queryString) {
    if (!excluded_query(key)) {
      result[key] = queryString[key];
    }
  }
  result = this.normalizeQueryOperator(result);
  return result;
};

exports.getQueryFromParam = (Model, param) => {
  if (param.split("-").length > 1) {
    return Model.findOne({ slug: param });
  }
  return Model.findById(param);
};

exports.excludeFieldsFromBody = (body, fields) => {
  let result = {};
  const excluded_fields = makeMap(fields);
  for (const key in body) {
    if (!excluded_fields(key)) {
      result[key] = body[key];
    }
  }
  return result;
};
