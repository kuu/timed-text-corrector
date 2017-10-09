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

function formatAzureVideoIndexer(srcData, language) {
  if (!Array.isArray(srcData)) {
    throw new TypeError('Invalid data format: Azure Video Indexer');
  }
  const destLines = [];
  for (const {lines} of srcData) {
    if (!lines || !lines.length) {
      continue;
    }
    for (const srcObj of lines) {
      const timeRange = srcObj.timeRange || srcObj.adjustedTimeRange;
      if (!timeRange || !timeRange.start || !timeRange.end) {
        continue;
      }
      destLines.push({
        start: timeRange.start,
        end: timeRange.end,
        text: srcObj.text
      });
    }
  }
  const destObj = {
    languages: {}
  };
  destObj.languages[language] = {
    lines: destLines
  };
  return destObj;
}

module.exports = {
  formalizeTranscript,
  formalizeTimedText,
  formatAzureVideoIndexer
};
