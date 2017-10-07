function formalizeTranscript(str) {
  if (!str || typeof str !== 'string') {
    return [];
  }
  // Split normal english text
  return str.replace(/([.?!])\s*(?=[A-Z])/g, '$1^').split('^');
}

function formalizeTimedText() {
  return [];
}

module.exports = {
  formalizeTranscript,
  formalizeTimedText
};
