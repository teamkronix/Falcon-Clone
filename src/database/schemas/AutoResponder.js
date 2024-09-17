const mongoose = require('mongoose');

const autoresponderSchema = new mongoose.Schema({
  guildId: { type: String, required: true }, // Server ID
  trigger: { type: String, required: true }, // Keyword or phrase to trigger the response
  response: { type: String, required: true }, // The response to send
  createdAt: { type: Date, default: Date.now }, // When it was created
});

module.exports = mongoose.model('Autoresponder', autoresponderSchema);
