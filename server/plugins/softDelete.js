module.exports = function softDeletePlugin(schema, options = {}) {
  const deletedAtField = options.deletedAtField || 'deletedAt';
  const isDeletedField = options.isDeletedField || 'isDeleted';

  schema.add({
    [deletedAtField]: { type: Date, default: null },
    [isDeletedField]: { type: Boolean, default: false, index: true },
  });

  schema.pre(/^find/, function(next) {
    if (!this.getQuery().includeDeleted) {
      this.where({ [isDeletedField]: false });
    }
    next();
  });

  schema.pre(/^count/, function(next) {
    if (!this.getQuery().includeDeleted) {
      this.where({ [isDeletedField]: false });
    }
    next();
  });

  schema.methods.softDelete = async function() {
    this[isDeletedField] = true;
    this[deletedAtField] = new Date();
    return this.save();
  };

  schema.methods.restore = async function() {
    this[isDeletedField] = false;
    this[deletedAtField] = null;
    return this.save();
  };

  schema.statics.findDeleted = function() {
    return this.find({ [isDeletedField]: true }).setQuery({ includeDeleted: true });
  };

  schema.statics.findWithDeleted = function() {
    return this.find().setQuery({ includeDeleted: true });
  };
};
