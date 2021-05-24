const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    dateCreated: { type: Date, required: true },
    dateUpdated: { type: Date }
});

module.exports = mongoose.model('Category', categorySchema);